import express from 'express';
import path from 'path';
import {createServer} from 'http';
import socket from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

import "./core/db";
import createRoutes from './core/routes';
import createSocket from './core/socket';

const app = express();
const http = createServer(app);
const io = socket(http);

app.use(express.static(path.join(__dirname, 'public')));

createSocket(io);
createRoutes(app, io);


http.listen(process.env.PORT || 80, function () {
    console.log('Server is now listening on port 3030!');
});