const express = require('express');

const {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewControllers');

const router = express.Router();

router.route('/')
.get(getAllReviews)
.post(createReview);

router.route('/:id')
.get(getReview)
.patch(updateReview)
.delete(deleteReview);

module.exports = router;