/* global cloak */

//var form = document.querySelector('#input-form');
//var input = document.querySelector('#input');

//var lobbyForm = document.querySelector('#lobby-form');
//var lobbyInput = document.querySelector('#lobby-input');

//var messages = document.querySelector('#messages');
//var counter = document.querySelector('#counter');

var createRoomButton = document.querySelector('#createlobby');
var createRoomPart2 = document.querySelector('#openroom')
var userNameInputCreate = document.querySelector('#nameboxcreate')

cloak.configure({
  messages: {
    chat: function(msg) {
      var message = document.createElement('div');
      message.textContent = msg;
      message.className = 'msg';
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    },
    userCount: function(count) {
      //counter.textContent = count;
    },
    'joinLobbyResponse': function(success) {
      console.log('joined lobby');
      game.refreshLobby();
    },

    'joinRoomResponse': function(result) {
      if (result.success) {
        game.room.id = result.id;
        game.begin();
        game.refreshWaiting();
      }
    },
    //
    refreshWaitingResponse: function(members) {
      if (!members) {
        return;
      }
      var waitingForPlayerElem = document.getElementById('waitingForPlayer');
      if (members.length < 2) {
        waitingForPlayerElem.style.display = 'block';
      }
      else {
        waitingForPlayerElem.style.display = 'none';
      }
    },
    //
    'roomCreated': function(result) {
      console.log(result.success ? 'room join success' : 'room join failure');
      if (result.success) {
        //game.room.id = result.roomId;
        //game.begin();
        console.log("Room Information" + result.roomId + " " + result.roomName);
        document.getElementById("room-code").innerHTML = result.roomName;

      }
    },
    //

  },
  serverEvents: {
    'connect': function() {
      console.log('connect');
    },

    'disconnect': function() {
      console.log('disconnect');
    },

    'lobbyMemberJoined': function(user) {
      console.log('lobby member joined', user);
      cloak.message('listUsers');
    },

    'lobbyMemberLeft': function(user) {
      console.log('lobby member left', user);
      cloak.message('listUsers');
    },

    'roomCreated': function(rooms) {
      console.log('created a room', rooms);

      //game.refreshLobby();
    },

    'roomDeleted': function(rooms) {
      console.log('deleted a room', rooms);
      game.refreshLobby();
    },

    'roomMemberJoined': function(user) {
      console.log('room member joined', user);
      //game.refreshWaiting();
    },

    'roomMemberLeft': function(user) {
      console.log('room member left', user);
      // The other player dropped, so we need to stop the game and show return to lobby prompt
      game.showGameOver('The other player disconnected!');
      cloak.message('leaveRoom');
      console.log('Removing you from the room because the other player disconnected.');
    },

    'begin': function() {
      console.log('begin');
      cloak.message('listRooms');
    }
  }
});

/*
form.addEventListener('submit', function(e) {
  e.preventDefault();
  var msg = input.value;
  if (msg.length < 1) {
    return;
  }
  cloak.message('chat', msg);
  input.value = '';
});


lobbyForm.addEventListener('submit', function(e) {
  e.preventDefault();

  cloak.message('chat', "aaaasdasdasdsa");
  console.log(cloak.connected());
  console.log(cloak.getUsers());
  console.log(cloak.currentUser());
});
*/
createRoomButton.addEventListener('click', (function(e) {
  cloak.message('createRoom', "1234" );
    console.log('New button clicked');

}));

createRoomPart2.addEventListener('click', (function(e) {

  // SETS USERS NAME AND ADDS TO LOBBY
  //user.name = nameboxcreate.value;
  console.log(nameboxcreate.value);
  nameboxcreate.value = '';
    console.log(' -- Room Button 2 clicked');
    //console.log(' -- New user name ' + user.name);
    //    console.log(cloak.currentUser());
        console.log(this.currentUser());



}));





cloak.run('http://130.102.176.91:8090');
