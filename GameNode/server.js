/* jshint node:true */

var cloak = require('cloak');
var _ = require('underscore');
var express = require('express');
var youtubedl = require('youtube-dl');
var fs = require('fs');
const bodyParser = require('body-parser');
var path = require('path');
const ypi = require('youtube-playlist-info');

const url = require('url');
const querystring = require('querystring');



const PORT = process.env.PORT || 5000

const app = express();
// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/", express.static(__dirname + "/client"));

const server = app.listen(PORT, function () {
  console.log(`Example app listening on port ${ PORT }!`);
});

async function downloadYoutubeVid(url, flag) {
  var video = await youtubedl.exec(url, ['-g', '-f', 'bestaudio[ext=m4a]'], { cwd: __dirname }, function(err, output)  {
    if (err) {
      console.error(err);
      return;
    }
    // console.log(JSON.stringify(output));
    output.forEach(x => {
      console.log('video: ' + x);
    })
    flag.url = output[0];
    flag.done = 1;
  });
  console.log(video);
  var createdFileName = "";

  // Will be called when the download starts.
  /*video.on('info', function (info) {
    createdFileName = info._filename;
  });*/
  var rand = Math.random();
  console.log("hi");
  var pos = 0;
  return "/media/video" + rand.toString() + ".mp3"; //attach to game
}
 
/*async function downloadPlaylist(url) {
  var video = await youtubedl(url, ["-f 140"], null);
  var createdFile = "";
  video.on('error', function error(err) {
    return 'error 2:' + err;
  });

  var size = 0;
  video.on('info', function (info) {
    size = info.size;
    createdFile = path.join(__dirname + '/', size + '.m4a');
    video.pipe(fs.createWriteStream(createdFile));
  });

  video.on('next', downloadPlaylist);
}*/

async function getPlayList(playlistURL) {
  try {
    const videos = [];
    let parsedUrl = url.parse(playlistURL);
    let parsedQs = querystring.parse(parsedUrl.query);
    // console.log(querystring.parse(url));
    var PlaylistID = parsedQs.list;
    await ypi("AIzaSyDt2-8433-k2eK0GGUIUbKvmO2jkbIvH8Y", PlaylistID).then(items => {
      //console.log(items);
      //List of songs is the titles of the youtube video

      items.forEach(function (value) {
        if (value.title == 'Private video') return;
        videos.push({
          title: value.title,
          url: 'http://www.youtube.com/watch?v='+value.resourceId.videoId
        });
      });
    });
    return videos;
  }
  catch (e) {
    console.error(e);
    //playlist link is invalid, do something, don't continue
    return 'ERROR: Link invalid';
  }
}

async function getYoutubeURL(ytURL) {
  const flag = {};
  const data = await downloadYoutubeVid(req.params.url, flag);
  while (!flag.done) {
    await delay(200);
  }
  console.log('returning url: ' + flag.url);
  return flag.url;
}

const delay = time => new Promise(res=>setTimeout(res,time));
app.get('/downloadYoutube/:url', async function (req, res) {
  res.json(await getYoutubeURL());
})

app.get('/getPlaylist/:url', async function (req, res) {
  const data = await getPlayList(req.params.url);
  res.json(data);
})

//const server = connect().use(connect.static('./client')).listen(PORT);

const rooms = {};

function sendrefreshRoomResponse(user) {
  user.message('refreshRoomResponse', {
    users: user.room.getMembers(true),
    room: user.room.name,
    count: user.room.getMembers(true).length
  });
}

function sendAllrefreshRoomResponse(room) {
  room.getMembers().forEach(user => {
    sendrefreshRoomResponse(user);
  })
}

cloak.configure({
  express: server,
  port: PORT,
  messages: {
    //////////////////////////////////////////////
    refreshRoom: function(arg, user) {
      sendrefreshRoomResponse(user);      
    },
    newRoom: function(arg, user) {
      const roomNum = Math.floor(Math.random()*1000000-1);
      var room = cloak.createRoom(roomNum, 100);
      user.name = arg.username;

      console.log("creating room " + roomNum + ' for ' + arg.username);
      rooms[roomNum] = room;
      console.log("all rooms: " + JSON.stringify(Object.keys(rooms)));

      var success = room.addMember(user);
      user.message('newRoomResponse', {
        success: success,
        roomId: room.id,
        roomName: room.name
      });
      sendrefreshRoomResponse(user);
    },
    joinRoom: function(arg,user)  {
      // console.log("all rooms: " + JSON.stringify(rooms));
      const room = rooms[arg.room];
      user.name = arg.username;

      room.addMember(user);

      console.log("refreshing other users in room " + room.name);
      sendAllrefreshRoomResponse(room);
    },
    'startGame': async function (arg, user) {
      console.log('starting game with playlist URL: ' + arg.playlist);
      const videos = await getPlayList(arg.playlist);
      user.room.messageMembers('startGameResponse', {song_names: videos.map(x => x.title)});
    } 

  },

  lobby: {},
  room: {
    init: function () {
      this.data = {'TEST': 'yeet', playlist: null, points: {}};
      console.log("Room Initation " + this.name + " " + this.id);
    },


    pulse: function () {
      // add timed turn stuff here
    },

    close: function () {}

  }
});

cloak.run();
// server.run();