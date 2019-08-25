/* global cloak */

//var form = document.querySelector('#input-form');
//var input = document.querySelector('#input');

//var lobbyForm = document.querySelector('#lobby-form');
//var lobbyInput = document.querySelector('#lobby-input');

//var messages = document.querySelector('#messages');
//var counter = document.querySelector('#counter');

var newRoomButton = document.querySelector('#createlobby');
var newRoomPart2 = document.querySelector('#openroom');
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
    'refreshRoomResponse': function (data) {
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

    },
    submitAnswer: function () {},
    //
    'newRoomResponse': function (result) {
      console.log(result.success ? 'Making room succeeded.' : 'room join failure');
      console.log("Room Information " + result.roomId + " " + result.roomName);
    },
  },
  //
  serverEvents: {
    'connect': function () {
    },

    'disconnect': function () {
      console.log('disconnect');
    },

    'roomMemberJoined': function (user) {
      //game.refreshWaiting();
    },

    'roomMemberLeft': function (user) {
      // The other player dropped, so we need to stop the game and show return to lobby prompt
    },

    'begin': function () {
      console.log('begin');
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
  cloak.message('joinRoom', { room: x, username: y });
}));

newRoomPart2.addEventListener('click', (function (e) {
  console.log('clicked make new room button');
  console.log(`username "${userNameInputCreate.value}"`);

  cloak.message('newRoom', {username: userNameInputCreate.value, playlist: 'PLAYLIST URL'});
  cloak.message('refreshRoom');
}));
answerSubmit.addEventListener('click', (function (e) {
  console.log('clicked submit answer');
  cloak.message('newRoom', userNameInputCreate.value);
}));

cloak.run(SERVER); // dev mode
// cloak.run('http://yeetbeat.fun')
