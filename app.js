import express from 'express';
import PostsRouter from './routes/posts.js';
import CommentsRouter from './routes/comments.js';

const app = express();
const PORT = process.env.port;

app.use(express.json());
app.use('/api', [PostsRouter, CommentsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});