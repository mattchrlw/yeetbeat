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

var joinRoomName = document.querySelector('#joinroomname')
var joinRoomCode = document.querySelector('#joinroomcode')
var joinRoomButton = document.querySelector('#joinroombutton')



cloak.configure({
  messages: {
    /*chat: function (msg) {
      var message = document.createElement('div');
      message.textContent = msg;
      message.className = 'msg';
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    },
    userCount: function (count) {
      //counter.textContent = count;
    },*/
    'joinLobbyResponse': function (success) {
      console.log('joined lobby');
      game.refreshLobby();
    },
    /*'refreshLobby': function (data) {
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
        .each(function (user) {
          if (inLobby) {
            //lobbyListElement.innerHTML += '<li>' + escape(user.name) + '</li>';
          }
          else {
            lobbyListElement.innerHTML = users;

            for (var i = 0; i < users.length; i++) {
              lobbyListElement.innerHTML += users[i].name; vs
            }

          }
        });
      lobbyListElement.innerHTML += '</ul>';
    },*/
    'refreshRoom': function (data) {
      var users = data.users;
      var roomCount = data.roomCount;

    var UsersElement = document.getElementById('Users');

      console.log('other users in room', users);

      for (var i = 0; i < users.length; i++) {
        console.log(i);
        console.log(users[i].name);
        UsersElement.innerHTML += users[i].name;
      }

    }
  },
  'joinRoomResponse': function (result) {
    if (result.success) {
      game.room.id = result.id;
      game.begin();
      game.refreshWaiting();
    }
  },
  //
  refreshWaitingResponse: function (members) {
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
  'roomCreated': function (result) {
    console.log(result.success ? 'room join success' : 'room join failure');
    if (result.success) {
      console.log("Room Information" + result.roomId + " " + result.roomName);
      document.getElementById("room-code").innerHTML = result.roomName;

    }
  },
  //
  serverEvents: {
    'connect': function () {
      console.log('connect');
    },

    'disconnect': function () {
      console.log('disconnect');
    },

    'lobbyMemberJoined': function (user) {
      console.log('lobby member joined', user);
      cloak.message('listUsers');
    },

    'lobbyMemberLeft': function (user) {
      console.log('lobby member left', user);
      cloak.message('listUsers');
    },

    'roomCreated': function (rooms) {
      console.log('created a room', rooms);
      rooms.roomId.addMember(rooms.user);
      console.log(rooms.room.getMembers());
      console.log("adfjhasdkflhasdkjlfhaslkjdhfkljasdhflkjashdflkahsdlfkajsdfhattempted to add user");

      //game.refreshLobby();
    },

    'roomDeleted': function (rooms) {
      console.log('deleted a room', rooms);
      game.refreshLobby();
    },

    'roomMemberJoined': function (user) {
      console.log('room member joined', user);
      //game.refreshWaiting();
    },

    'roomMemberLeft': function (user) {
      console.log('room member left', user);
      // The other player dropped, so we need to stop the game and show return to lobby prompt
      game.showGameOver('The other player disconnected!');
      cloak.message('leaveRoom');
      console.log('Removing you from the room because the other player disconnected.');
    },

    'begin': function () {
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
joinRoomButton.addEventListener('click', (function (e) {

  var x = joinRoomCode.value;
  console.log(x);
  var y = joinRoomName.value;
  cloak.message('joinRoomFromName', { x, y }  );


}));

createRoomPart2.addEventListener('click', (function (e) {
  console.log('New Room button clicked');
  console.log(userNameInputCreate.value);

  cloak.message('createRoom', userNameInputCreate.value);
  cloak.message('listUsers');
  console.log(userNameInputCreate.value);
}));





cloak.run('http://130.102.176.91:8090');
