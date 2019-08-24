/* global cloak */

var form = document.querySelector('#input-form');
var input = document.querySelector('#input');

var lobbyForm = document.querySelector('#lobby-form');
var lobbyInput = document.querySelector('#lobby-input');

var messages = document.querySelector('#messages');
var counter = document.querySelector('#counter');

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
      counter.textContent = count;
    }

  },
});

cloak.run('http://130.102.176.91:8090');

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