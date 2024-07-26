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

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit('new_message', input.value, roomName, () => {
      addMessages(`You: ${input.value}`);
      input.value = '';
    });
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enterRoom', input.value, showRoom);
  roomName = input.value;
  input.value = '';
});

socket.on('welcome', () => {
  addMessages('Someone joined!');
});

socket.on('new_message', addMessages);

socket.on('bye', () => {
  addMessages('Someone left ㅠㅠ');
});
