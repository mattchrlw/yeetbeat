/* jshint node:true */

var cloak = require('cloak');
var _ = require('underscore');
var connect = require('connect');
const PORT = process.env.PORT || 5000

var sendLobbyCount = function(arg) {
  this.messageMembers('chat', "for lobby");
};

const server = connect().use(connect.static('./client')).listen(PORT);

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
    chat: function(msg, user) {
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
    joinRoom: function(id, user) {
      cloak.getRoom(id).addMember(user);
      user.message('joinRoomResponse', {
        id: id,
        success: true
      });
    },

    listRooms: function(arg, user) {
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
    init: function() {
      /*
        Room Variables,
        this.xxxxxxxxx
        need scores, songs, playlist, l
        etc etc etc


      */
      this.playlist;
      this.amountSongs;
      this.scores = {playerid: x, score: y};
      this.songlength;
      this.modifiers;

      console.log(cloak.getRooms(true));
      console.log("Room Initation " + this.name + " " + this.id);
    },


    pulse: function() {
      // add timed turn stuff here
    },

    close: function() {
      this.messageMembers('you have left ' + this.name);
    }

  }
});

cloak.run();

console.log('We are up and running on port: ' + PORT);
