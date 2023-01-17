const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require("config");
const qr = require('qrcode');

const pointSchema = mongoose.Schema({
    timestamp: Number,
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number
    }
})

const followedStudioSchema = mongoose.Schema({
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    }
})

const savedPostSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        min: 5,
        max: 32,
        required: true
    },
    locationLat: Number ,
    locationLong: Number ,
    subscription:{
        type: String
    },
    password: {
        type: String,
        min: 5,
        max: 24,
        required: true
    },
    email: {
        type: String,
        min: 5,
        max: 64,
        required: true
    },
    facebook: {
        type: String,
        min: 10, 
        max: 256
    },
    google: {
        type: String
    },
    picture: {
        type: String
    },
    pictureUrl: {
        type: String
    },
    active: {
        type: Boolean
    },
    pushToken: String,
    hasStudio: {
        type: Boolean,
        default: false
    },
    category: {
        type: String
    },
    backgroundImage: {
        type: String
    },
    qrCode: {
        type: String
    },
    qrsScanned: [String],
    followedStudios: [],
    savedPosts : [savedPostSchema]
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
    return token;
}
userSchema.pre('save', function(next) {
      qr.toDataURL(this.email , (err, data) =>{
     
     if(err) console.log(`Error in qr is ${err}`);
     this.qrCode = data;
     next();
 })
});

const User = mongoose.model('User', userSchema);

module.exports = User;