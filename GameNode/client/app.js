/* global cloak */

//var form = document.querySelector('#input-form');
//var input = document.querySelector('#input');

//var lobbyForm = document.querySelector('#lobby-form');
//var lobbyInput = document.querySelector('#lobby-input');

//var messages = document.querySelector('#messages');
//var counter = document.querySelector('#counter');

var createRoomButton = document.querySelector('#createlobby');
var createRoomPart2 = document.querySelector('#openroom');
var userNameInputCreate = document.querySelector('#nameboxcreate');

var joinRoomName = document.querySelector('#joinroomname');
var joinRoomCode = document.querySelector('#joinroomcode');
var joinRoomButton = document.querySelector('#joinroombutton');
var answerSubmit = document.querySelector('#answersubmit');


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
    'refreshRoom': function (data) {
      var users = data.users;
      var roomCount = data.count;
      var UsersElement = document.getElementById('Users');
      document.getElementById("room-code").textContent = data.room;

      UsersElement.innerHTML = ''; // clears children of Users

      console.log('refreshing room (with '+roomCount+' users): '+ users);
      users.forEach(({id, name}) => {
        const div = document.createElement('div');
        div.className = 'room-user';
        div.textContent = name;
        UsersElement.appendChild(div);
      });

    }
    ,
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
    submitAnswer: function ()
    //
    'roomCreated': function (result) {
      console.log(result.success ? 'room join success' : 'room join failure');
      if (result.success) {
        console.log("Room Information " + result.roomId + " " + result.roomName);
        document.getElementById("room-code").textContent = result.roomName;
      }
    },
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
  var y = joinRoomName.value;
  console.log({x, y});
  cloak.message('joinRoomFromName', { room: x, username: y });
}));

createRoomPart2.addEventListener('click', (function (e) {
  console.log('clicked make new room button');
  console.log(`username "${userNameInputCreate.value}"`);

  cloak.message('createRoom', userNameInputCreate.value);
  cloak.message('listUsers');
}));
answerSubmit.addEventListener('click', (function (e) {
  console.log('clicked submit answer');
  cloak.message('createRoom', userNameInputCreate.value);
  cloak.message('listUsers');
}));

cloak.run('http://localhost:5000');
