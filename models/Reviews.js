const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    number: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    content: {
        type: String,
        min: 12,
        max: 64
    }
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;