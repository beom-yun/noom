const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function addMessages(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#msg input');
  socket.emit('newMessage', input.value, roomName, () => {
    addMessages(`You: ${input.value}`);
    input.value = '';
  });
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#name input');
  socket.emit('nickname', input.value);
  input.value = '';
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector('#msg');
  const nameForm = room.querySelector('#name');
  msgForm.addEventListener('submit', handleMessageSubmit);
  nameForm.addEventListener('submit', handleNicknameSubmit);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enterRoom', input.value, showRoom);
  roomName = input.value;
  input.value = '';
});

socket.on('welcome', user => {
  addMessages(`${user} joined!`);
});

socket.on('newMessage', addMessages);

socket.on('bye', user => {
  addMessages(`${user} left ㅠㅠ`);
});

socket.on('roomChange', rooms => {
  const roomList = welcome.querySelector('ul');
  roomList.innerHTML = '';
  // if (rooms.length === 0) {
  //   return;
  // }
  rooms.forEach(room => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.append(li);
  });
});
