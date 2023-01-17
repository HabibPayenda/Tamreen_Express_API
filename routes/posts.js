const express = require('express');

const {
    getAllPosts,
    getPosts,
    createPost,
    uploadPostPhoto,
    deletePost,
    likePost,
    unLikePost,
    commentPost,
    getFollowedPosts
} = require('../controllers/postsControlers');
const requireAuth = require('../middlewares/requireAuth');


const router = express.Router();

router.route('/')
.get(getAllPosts)
.post(requireAuth, uploadPostPhoto, createPost);

router.route('/like/:id')
.patch(likePost);
router.route('/unLike/:id')
.patch(unLikePost);

router.route('/comments/:id')
.patch(commentPost);

router.route('/user')
.post(getFollowedPosts);

router.route('/:id')
.get(getPosts)
.delete(deletePost);
// .patch(updateReview)
// .delete(deleteReview);

module.exports = router;