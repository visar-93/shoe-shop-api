const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth,feedController.getPosts);

// POST /feed/post
router.post(
    "/post",
    isAuth,
    [body("title").trim().isLength({ min: 5 })],
    feedController.createPost
  );

  // GET /feed/post/id
  router.get("/post/:productId", isAuth, feedController.getPost);
 
  // PUT / feed/post/id
  router.put('/post/:productId',
  isAuth,
  [body("title").trim().isLength({ min: 5 })],
  feedController.updatePost);

  // DELETE /feed/post/id
  router.delete('/post/:productId', isAuth, feedController.deletePost);

module.exports = router;
