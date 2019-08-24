/* jshint node:true */

var cloak = require('cloak');
var _ = require('underscore');
var connect = require('connect');

var clientPort = 8080;
var serverPort = 8090;

var sendLobbyCount = function(arg) {
  this.messageMembers('chat', "for lobby");
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
      console.log("List Rooms " + cloak.getRooms(true));
    },
    //////////////////////////////////////////////
    listUsers: function(arg, user) {
      user.message('refreshRoom', {
        users: user.room.getMembers(true),
        roomCount: user.room.getMembers().length
      });
    },
    createRoom: function(arg, user) {
      var room = cloak.createRoom(Math.floor(Math.random()*100000-1), 100);
      user.name = arg
      var success = room.addMember(user);
      user.message('roomCreated', {
        success: success,
        roomId: room.id,
        roomName: room.name
      });
    },
    joinRoomFromName: function(arg,user)  {
      var rooms = cloak.getRooms();
      console.log(" ROOOMS " + rooms);
      console.log(arg.x);
      for (index = 0; index < rooms.length; ++index) {
        console.log(" current index "  + rooms[index][1]);
        if (rooms[index][1] == arg[0]) {
          console.log("FOUND");
          user.name = arg[1];
          rooms[index].addMember(user);
          break;
        } else {
          console.log('aihlsdfgaydsgfhadgfsdjf');
        }
      }
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

connect()
.use(connect.static('./client'))
.listen(clientPort);

console.log('client running on on ' + clientPort);
