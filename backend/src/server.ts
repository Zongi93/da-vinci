import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import socketIo from 'socket.io';

import * as utils from './utils';

import {
  socketManagerService,
  tableManagerService,
  userManagerService
} from './services';

import { GameDaVinci } from './models/games/da-vinci/service';
import {
  authenticate,
  checkCsrf,
  createTable,
  getUser,
  joinTable,
  listTables,
  loginUser,
  logoutUser,
  pairSocket
} from './routers';

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

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

export const ioServer = socketIo(server);
socketManagerService.init(ioServer);

ioServer.on('connection', socket => {
  console.log(`Socket connection with ${socket.id} established`);
  socketManagerService.addSocket(socket);
});
