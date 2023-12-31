require('@babel/register');
import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import createRouter from './routes/createrooms'; // 사용자 방만들기
import http from 'http';
import { Server } from 'socket.io';
import chat from './sockets/chat';
import imageUpload from "./routes/imageUpload"; // 이미지 업로드하기
import roundStart from "./routes/roundStart"; // 라운드별 게임 시작하기
import joinRoomRouter from './routes/joinroom'; // 사용자 입장하기 
import checkRanks from './routes/checkRanks'; // 석차조회하기

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.use('/', imageUpload);  // 이미지 업로드하기
app.use('/', roundStart); // 라운드별 게임 시작하기
app.use('/', checkRanks);  // 석차조회하기

// db 연결
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to the MySQL server.");
});

// http 서버 생성
const server = http.createServer(app);

// socket.io 연결
const io = new Server(server);

// chat.js 미들웨어
chat(io);

const roomsRouter = createRouter(db);
app.use(roomsRouter); // 사용자 방만들기

const joinRouter = joinRoomRouter(db);
app.use(joinRouter); // 사용자 입장하기 

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});