/* jshint node:true */

var cloak = require('cloak');
var _ = require('underscore');
var express = require('express');
var youtubedl = require('youtube-dl');
var fs = require('fs');
const bodyParser = require('body-parser');
var path = require('path');
const ypi = require('youtube-playlist-info');


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

async function getPlayList(url) {
  try {
    const videos = [];

    var PlaylistID = url.split("list=")[1];
    await ypi("AIzaSyDt2-8433-k2eK0GGUIUbKvmO2jkbIvH8Y", PlaylistID).then(items => {
      //console.log(items);
      //List of songs is the titles of the youtube video

      items.forEach(function (value) {
        videos.push({
          title: value.title,
          video_id: value.resourceId.videoId
        });
      });
    });
    return videos;
  }
  catch (e) {
    //playlist link is invalid, do something, don't continue
    return 'ERROR: Link invalid';
  }
}

const delay = time => new Promise(res=>setTimeout(res,time));
app.get('/downloadYoutube/:url', async function (req, res) {
  const flag = {};
  const data = await downloadYoutubeVid(req.params.url, flag);
  while (!flag.done) {
    await delay(200);
  }
  console.log('returning url: ' + flag.url);
  res.json(flag.url);
})

app.get('/getPlaylist/:url', async function (req, res) {
  const data = await getPlayList(req.params.url);
  res.json(data);
})

var sendLobbyCount = function (arg) {
  this.messageMembers('chat', "for lobby");
};

//const server = connect().use(connect.static('./client')).listen(PORT);

const rooms = {};

function sendRefreshRoom(user) {
  user.message('refreshRoom', {
    users: user.room.getMembers(true),
    room: user.room.name,
    count: user.room.getMembers(true).length
  });
}

function sendAllRefreshRoom(room) {
  room.getMembers().forEach(user => {
    sendRefreshRoom(user);
  })
}

cloak.configure({
  express: server,
  port: PORT,
  messages: {
    chat: function (msg, user) {
      user.getRoom().messageMembers('chat', msg);
    },

    checkAnswer: function(arg, user) {
      user.getRoom();
    },
    ////////////////////////////////////////////
    joinLobby: function(arg, user) {
      cloak.getLobby().addMember(user);
      user.message('joinLobbyResponse');
      console.log("User Joined Lobby " + user.id);
    },
    joinRoom: function (id, user) {
      cloak.getRoom(id).addMember(user);
      user.message('joinRoomResponse', {
        id: id,
        success: true
      });
    },

    listRooms: function (arg, user) {
      user.message('listRooms', cloak.getRooms(true));
      console.log("received list rooms " + cloak.getRooms(true));
    },
    //////////////////////////////////////////////
    listUsers: function(arg, user) {
      sendRefreshRoom(user);      
    },
    createRoom: function(arg, user) {
      const roomNum = Math.floor(Math.random()*1000000-1);
      var room = cloak.createRoom(roomNum, 100);
      user.name = arg;

      console.log("creating room " + roomNum + ' for ' + arg);
      rooms[roomNum] = room;
      console.log("all rooms: " + JSON.stringify(rooms));

      var success = room.addMember(user);
      user.message('roomCreated', {
        success: success,
        roomId: room.id,
        roomName: room.name
      });
    },
    joinRoomFromName: function(arg,user)  {
      console.log("user joining room!");
      // console.log("all rooms: " + JSON.stringify(rooms));

      const room = rooms[arg.room];
      user.name = arg.username;
      room.addMember(user);

      console.log("refreshing other users in room " + room.name);
      sendAllRefreshRoom(room);
    },
    updateScore: function(arg,user) {
      if (user.data !== undefined) {
        user.data.score += arg;
      }
      else {
        user.data = {
          score: arg
        };
      }
      console.log("This is the console log you are looking for: " + JSON.stringify(user.data));
    },
    getAllScores: function(arg,user) {
      console.log("getAllScores hit");
      var allUsers = user.getRoom().getMembers();
      var list = [];
      allUsers.forEach(function (item) {
        if (item.data !== undefined) {
          console.log(item.name);
          list.push({
            name: item.name,
            score: item.data.score
          });
        }
        else {
          list.push({
            name: item.name,
            score: 0
          });
        }
      })
      cloak.messageAll("getScoreBoard", list);
    }

  },

  lobby: {
    newMember: sendLobbyCount,
    memberLeaves: sendLobbyCount,
  },
  room: {
    init: function () {
      /*
        Room Variables,
        this.xxxxxxxxx
        need scores, songs, playlist, l
        etc etc etc


      */
      // this.playlist;
      // this.amountSongs;
      // this.scores = {playerid: x, score: y};
      // this.songlength;
      // this.modifiers;

      console.log(cloak.getRooms(true));
      console.log("Room Initation " + this.name + " " + this.id);
    },


    pulse: function () {
      // add timed turn stuff here
    },

    close: function () {
      this.messageMembers('you have left ' + this.name);
    }

  }
});

cloak.run();
// server.run();