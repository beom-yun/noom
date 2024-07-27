import http from 'http';
import express from 'express';
import SocketIO from 'socket.io';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

wsServer.on('connection', socket => {
  socket['nickname'] = 'Anon';
  socket.onAny(event => console.log(`Socket Event: ${event}`));
  socket.on('enterRoom', (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit('welcome', socket.nickname);
    wsServer.sockets.emit('roomChange', publicRooms());
  });
  socket.on('newMessage', (msg, room, done) => {
    socket.to(room).emit('newMessage', `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on('nickname', nickname => (socket['nickname'] = nickname));
  socket.on('disconnecting', () => {
    socket.rooms.forEach(room => socket.to(room).emit('bye', socket.nickname));
  });
  socket.on('disconnect', () => {
    wsServer.sockets.emit('roomChange', publicRooms());
  });
});

httpServer.listen(3000, () => console.log(`Listening on http://localhost:3000`));
