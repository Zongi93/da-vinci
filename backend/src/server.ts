import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import socketIo from 'socket.io';

require('./utils/array-shuffle');

/*
import { GameDaVinci } from './models/games/da-vinci/service'; */
import {
  addAi,
  authenticate,
  checkCsrf,
  createTable,
  getUser,
  joinTable,
  leaveTable,
  listTables,
  loginUser,
  logoutUser,
  pairSocket,
  removeAi,
  startTable
} from './routers';
import {
  socketManagerService,
  tableManagerService,
  userManagerService
} from './services';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const port = 3000;

app.route('/api/user/login').get(getUser);
app.route('/api/user/login').post(loginUser);
app.route('/api/user/pair-socket').post(checkCsrf, authenticate, pairSocket);
app.route('/api/user/logout').get(logoutUser);
app.route('/api/table/list').get(listTables);
app.route('/api/table/create').post(checkCsrf, authenticate, createTable);
app.route('/api/table/join').post(checkCsrf, authenticate, joinTable);
app.route('/api/table/leave').post(checkCsrf, authenticate, leaveTable);
app.route('/api/table/start').post(checkCsrf, authenticate, startTable);
app.route('/api/table/add-ai').post(checkCsrf, authenticate, addAi);
app.route('/api/table/remove-ai').post(checkCsrf, authenticate, removeAi);

const server = app.listen(port, () =>
  console.log(`Table game server is listening on port ${port}!`)
);

export const ioServer = socketIo(server);
socketManagerService.init(ioServer);

ioServer.on('connection', socket => {
  console.log(`Socket connection with ${socket.id} established`);
  socketManagerService.addSocket(socket);
});

setTimeout(() => socketManagerService.signalServerStart(), 1500);
