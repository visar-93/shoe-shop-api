const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post',
[
    body('title')
    .trim()
    .isLength({min: 5})
],
 feedController.createPost);

 router.get("/post/:productId", feedController.getPost);

 
router.put('/post/:productId',
[body("title").trim().isLength({ min: 5 })],
feedController.updatePost);

router.delete('/post/:productId', feedController.deletePost);

module.exports = router;
