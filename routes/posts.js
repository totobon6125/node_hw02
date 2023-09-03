import express from 'express';
import { prisma } from '../utils/prisma/index.js';


const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.


// 게시글 생성 API - POST
router.post('/posts', async (req, res, next) => {
  const { user, password, title, content } = req.body;

  try {
    const post = await prisma.Posts.create({
      data: {
        user,
        password,
        title,
        content
      },
    });

    return res.status(201).json({ data: post });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ errMessage: "아이디가 중복 입니다." });
    } else if(!user || !password) {
      return res.status(400).json({ errMessage: "아이디나 패스워드 값이 올바르지 않습니다" });
    } else {
      return res.status(400).json({ errMessage: "제목이나 내용을 적어 주세요." });
    }

  }
});



// 게시글 전체 조회(내용제외) API - GET
router.get('/posts', async (req, res, next) => {
  try {
    const posts = await prisma.posts.findMany({
      select: {
        postId: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ data: posts });
  } catch (err) {
    let error = err
    if (err === error) {
      return console.log(잡혀라)
    }
    console.log(err)
  }
});


// 게시글 상세 조회 API - GET
router.get('/posts/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await prisma.posts.findFirst({
      where: { postId: +postId },
      select: {
        postId: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ data: post });
  } catch (err) {
    console.log(err)
  }
});


// 게시글 수정 API - PUT
router.put('/posts/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    console.log("postId: ", postId)
    const { title, content, password } = req.body;

    const post = await prisma.posts.findUnique({
      where: { postId: +postId },
    });
    console.log("post에 들어있는 값들", post)

    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }
    else if (post.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    await prisma.posts.update({
      data: {
        title, content
      },
      where: {
        postId: +postId,
        password,
      },
    });

    return res.status(200).json({ data: '게시글이 수정되었습니다.' });
  } catch (err) {
    console.log(err)
  }
});


// 게시글 삭제 API - DELETE
router.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    // 해당 postId와 일치하는 게시글을 조회
    const post = await prisma.posts.findUnique({
      where: { postId: +postId },
    });

    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    // 해당 게시글에 속한 댓글을 먼저 삭제
    await prisma.comments.deleteMany({
      where: { postId: +postId },
    });

    // 게시글 삭제
    await prisma.posts.delete({
      where: { postId: +postId },
    });

    return res.status(200).json({ message: '게시글과 댓글이 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;