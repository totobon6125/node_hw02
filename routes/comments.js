import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

// 댓글 생성 API - POST
router.post('/posts/:postId/comments', async (req, res, next) => {

  try {
    const { postId } = req.params;

    const { user, password, content } = req.body

    if (!user || !password) {

      return res.status(400).json({ errMessage: "아이디 혹은 비밀번호가 틀렸습니다." });
    } else if (!content) {

      return res.status(400).json({ errMessage: "댓글을 입력해주세요." });
    }
    const post = await prisma.posts.findFirst({ where: { postId: +postId } })
    console.log("post 값은", post)
    await prisma.Comments.create({
      data: {
        postId: post.postId,
        user,
        password,
        content
      },
    })

    return res.status(200).json({ message: "댓글을 생성하였습니다." });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "데이터 형식이 올바르지 않습니다." })
  };
});


// 게시글에 해당한는 댓글 전체 조회(내용제외) API - GET
router.get('/posts/:postId/comments', async (req, res, next) => {

  try {

    const { postId } = req.params;
    const post = await prisma.posts.findFirst({ where: { postId: +postId } });

    if (!post) {
      return res.status(400).json({ message: "게시글이 존재하지 않습니다." });
    }

    const comments = await prisma.comments.findMany({
      where: { postId: +postId },
      select: {
        commentId: true,
        postId: true,
        user: true,
        content: true,
        createdAt: true
      },
    });

    return res.status(200).json({ data: comments });
  } catch (err) {
    res.status(500).json({ message: "데이터 형식이 올바르지 않습니다." })
  }
});


// 댓글 수정 API - PUT
router.put('/posts/:postId/comments/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params
    const { content, password } = req.body

    const putCommnet = await prisma.comments.findUnique({
      where: { commentId: +commentId },
    });

    if (!content) {

      return res.status(404).json({ errMessage: '댓글이 존재하지 않습니다.' });
    }
    else if (putCommnet.password !== password) {
      return res.status(401).json({ errMmessage: '비밀번호가 일치하지 않습니다.' });
    }

    await prisma.comments.update({
      data: {
        content
      },
      where: {
        commentId: +commentId,
        password,
      },
    });

    return res.status(200).json({ message: '댓글이 수정되었습니다.' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "데이터 형식이 올바르지 않습니다." })
  }
});


// 댓글 삭제 API - DELETE
router.delete('/posts/:postId/comments/:commentId', async (req, res, next) => {
  const { commentId } = req.params;
  const { password } = req.body;

  const delComment = await prisma.comments.findFirst({
    where: { commentId: +commentId }
  });

  if (!delComment) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  }
  else if (delComment.password !== password) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  await prisma.comments.delete({ where: { commentId: +commentId } });

  return res.status(200).json({ data: '게시글이 삭제되었습니다.' });
});


export default router;