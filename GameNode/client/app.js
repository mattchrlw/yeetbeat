/* global cloak */

//var form = document.querySelector('#input-form');
//var input = document.querySelector('#input');

//var lobbyForm = document.querySelector('#lobby-form');
//var lobbyInput = document.querySelector('#lobby-input');

//var messages = document.querySelector('#messages');
//var counter = document.querySelector('#counter');

var createLobbyButton = document.querySelector('#createlobby');


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
    //
    /*'refreshLobby': function(data) {
      var users = data.users;
      var inLobby = data.inLobby;

      var lobbyElement = document.getElementById('lobby'),
        lobbyListElement = document.getElementById('lobby-list'),
        newRoomUIElement = document.getElementById('new-room-ui'),
        roomsElement = document.getElementById('rooms'),
        roomListElement = document.getElementById('room-list');

      console.log('other users in room', users);
      lobbyElement.style.display = 'block';
      lobbyListElement.style.display = 'block';
      newRoomUIElement.style.display = 'block';
      roomsElement.style.display = 'block';
      roomListElement.style.display = 'block';
      lobbyListElement.innerHTML = '<ul>';
      _.chain(users)
        .each(function(user) {
          if (inLobby) {
            lobbyListElement.innerHTML += '<li>' + escape(user.name) + '</li>';
          }
          else {
            lobbyListElement.innerHTML += '<li>' + escape(user.name) + ' (' + data.roomCount + '/' + data.roomSize + ')</li>';
          }
        });
      lobbyListElement.innerHTML += '</ul>';
    },
    //
    'listRooms': function(rooms) {
      var roomListElement = document.getElementById('room-list');
      roomListElement.innerHTML = '<ul>';
        _.each(rooms, function(room) {
          roomListElement.innerHTML += '<li>' + escape(room.name) + ' (' + room.users.length + '/' + room.size + ') <a href="#" onclick="game.joinRoom(\'' + room.id  + '\')">join</a><li class="indented">' + room.users[0].name + '</li></li>';
        });
      roomListElement.innerHTML += '</ul>';
    },*/

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
        document.getElementById("room-code").innerHTML = result.roomId;

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
createLobbyButton.addEventListener('click', (function(e) {
  cloak.message('createRoom', "1234" );
    console.log('New button clicked');

}));







cloak.run('http://130.102.176.91:8090');
