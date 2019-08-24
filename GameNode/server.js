/* jshint node:true */

var cloak = require('cloak');
var _ = require('underscore');
var connect = require('connect');
var express = require('express');
const app = express();
var youtubedl = require('youtube-dl');
var fs = require('fs');
const bodyParser = require('body-parser');
var path = require('path');
const ypi = require('youtube-playlist-info');


const PORT = process.env.PORT || 5000

var clientPort = 8080;
var serverPort = 8090;

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

async function downloadYoutubeVid(url) {
  var video = await youtubedl(url, ['-f 140'],
    { cwd: __dirname });
  var createdFileName = "";

  // Will be called when the download starts.
  video.on('info', function (info) {
    createdFileName = info._filename;
  });
  video.pipe(fs.createWriteStream(createdFileName));
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

app.get('/getPlaylist/:url', async function (req, res) {
  const data = await getPlayList(req.params.url);
  res.json(data);
})

var sendLobbyCount = function (arg) {
  this.messageMembers('chat', "for lobby");
};

//const server = connect().use(connect.static('./client')).listen(PORT);

console.log('client running on on ' + clientPort);

app.use("/", express.static(__dirname + "/client"));

const server = app.listen(PORT, function () {
  console.log(`Example app listening on port ${ PORT }!`);
})

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
  messages: {
    chat: function (msg, user) {
      user.getRoom().messageMembers('chat', msg);
    },
    joinLobby: function (arg, user) {
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

console.log('We are up and running on port: ' + PORT);
