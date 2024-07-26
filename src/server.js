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

wsServer.on('connection', socket => {
  socket.onAny(event => console.log(`Socket Event: ${event}`));
  socket.on('enterRoom', (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit('welcome');
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', msg);
    done();
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach(room => socket.to(room).emit('bye'));
  });
});

httpServer.listen(3000, () => console.log(`Listening on http://localhost:3000`));
