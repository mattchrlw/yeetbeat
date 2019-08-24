/* jshint node:true */

var cloak = require('cloak');
var _ = require('underscore');
var connect = require('connect');

var clientPort = 8080;
var serverPort = 8090;

var sendLobbyCount = function(arg) {
  this.messageMembers('userCount', this.getMembers().length);
  this.messageMembers('chat', "succ my weewee");
};

cloak.configure({
  port: serverPort,
  messages: {
    chat: function(msg, user) {
      user.getRoom().messageMembers('chat', msg);
    },
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
      console.log(cloak.getRooms(true));
    },

    listUsers: function(arg, user) {
      user.message('refreshLobby', {
        users: user.room.getMembers(true),
        inLobby: user.room.isLobby,
        roomCount: user.room.getMembers().length,
        roomSize: user.room.size
      });
    },

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

connect()
.use(connect.static('./client'))
.listen(clientPort);

console.log('client running on on ' + clientPort);
