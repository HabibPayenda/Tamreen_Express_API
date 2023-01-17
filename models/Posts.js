const mongoose = require('mongoose');

const likesSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})


const PostsSchema = mongoose.Schema({
    
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
      type: String,
      min: 6, 
      max: 256, 
      required: true 
    } ,
    likes: [{likesSchema}],
    comments: [{}],
    shares: [{}],
    image: String,
    imageUrl: String,
    time: {
        type: String 
    }, 
    createdAt: {
        type: Date,
        default: Date.now()
    }

    
});

const Post = mongoose.model('Post', PostsSchema);

module.exports = Post;