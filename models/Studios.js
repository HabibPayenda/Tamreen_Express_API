const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    }
})


const studioShema = mongoose.Schema({
    name: {
        type: String,
        min: 5, 
        max: 64,
        required: true
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    picture: String,
    pictureUrl: String,
    backgroundPicture: String,
    backgroundPictureUrl: String,
    categories: [categorySchema],
    posts: [String],
    followers: [String],
    reviews: [String],
    location: String,
    contracts: [String],
    qrsScanned: [String]
});

const Studio = mongoose.model('Studio', studioShema);

module.exports = Studio;