const path = require('path');
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const multer = require('multer');
const Studio = require('../models/Studios');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image/users');
        console.log('Multer Storage');
    },
    filename: (req, file, cb) => {
    cb(null,`${req.user.name}_photo_${req.user._id}${Date.now()}${path.parse(file.originalname).ext}` ) ;
    }
});

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
        console.log("Multer Filter");
    }else{
        cb( res.status(400).json({message: 'Please upload an Image file '}) , false);
    }
}


 const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo')


// exports.upload(req, res, async () => {
//     console.log(req.file)
//     console.log(req.photo)
//     console.log(req.image)
//     console.log(req.payload)
//     console.log(req.body)
//     console.log(req.body.photo)
//     console.log(typeof req.body.photo)
//     console.log(req.files)

//     // console.log(req.body)
//     // console.log(req.body.photo)
//     // console.log(req)
 
//     const _id = req.user._id;
//     const user = await User.findById(_id);
//     if (!user){
//         return res.status(401).json({
//             message: 'You need to be Loged In ',
//             success: 'Faild'
//         })
//     }

//     if(!req.file){
//         res.status(400).json({
//             message: 'Please Upload an Image',
//             success: 'Faild'
//         });
//     }

//     const file = req.file;
//     console.log(file)

// })



exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if(users.length<1) return res.status(404).json({message: 'No user in the database'});
        res.status(200).json({
            message: "success",
            results: users.length,
            data: users
        })
       
    } catch (error) {
        res.status(400).json({
            message: 'Faild',
            error
        })
    }
}


exports.getCurrentUser = async (req, res ) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'savedPosts.post'
        });
        
        res.status(200).json({
            success: 'success',
            user
        })
    } catch (error) {
        console.log(`Error in Current User: ${error}`)
    }
}

exports.updateCurrentUser = async (req, res) => {
    try {
        const _id = req.user._id;
        console.log(_id);
        console.log(req.body)

        const {name, email, category:{label}} = req.body;

        console.log(`name: ${name}  Email: ${email}  Category: ${label}, Lat: ${latitude}, Long: ${longitude}`);
        const user =  await User.findByIdAndUpdate(_id, {name: name, email: email, category: label} , {
            new: true, 
            runValidators: true
        } );
        
        res.status(200).json({
            message: 'Updated successfully',
            user
        })


        
    } catch (error) {
        res.status(404).json({
            message: 'Something went wrong in the server'
        })
    }
}


exports.updateCurrentUserSavedPost = async (req, res ) => {
    try {
        const _id = req.params.id
        const post = req.body.post;
        console.log(`Post is : ${post}`)
        let user = await User.findById(_id);
        user.savedPosts.push({post: post});
        user = await user.save();

        res.status(200).json({
            message: 'success',
            data: user
        })

    } catch (error) {
        console.log(`Error in updateCurrentUserSacedPost in userControllers is: ${error}`)
    }
}

exports.updateCurrentLocation = async (req, res) => {
    try {
        const _id = req.user._id;
        
        console.log(req.body)

        const {latitude, longitude} = req.body;

        console.log(`Latitude is : ${latitude} Longitude is : ${longitude}`);
        const user =  await User.findByIdAndUpdate(_id, {locationLat: latitude, locationLong: longitude } , {
            new: true, 
            runValidators: true
        } );
        
        res.status(200).json({
            message: 'Updated successfully',
            user
        })


        
    } catch (error) {
        res.status(404).json({
            message: 'Something went wrong in the server'
        })
    }
}



exports.photoUpload = async (req, res) => {
    
    console.log(req.files);
    console.log(req.file);

    // console.log(req.body)
    // console.log(req.body.photo)
    // console.log(req)
 
    const _id = req.user._id;
    const user = await User.findById(_id);
    if (!user){
        return res.status(401).json({
            message: 'You need to be Loged In ',
            success: 'Faild'
        })
    }

    if(!req.file){
        res.status(400).json({
            message: 'Please Upload an Image',
            success: 'Faild'
        });
    }

    const file = req.file;
    console.log(file)


    if(file.size > 10000000){
        return res.status(403).json({
            message: 'Please upload in image less than 1MB',
            success: 'Faild'
        });
    }

        await User.findByIdAndUpdate(_id, {picture: file.filename, pictureUrl: `http://192.168.43.211:9000/image/users/${file.filename}`});
        res.status(200).json({
            message: 'Photo Uploaded',
            success: "Success",
            data: file.filename
        });
}


exports.createUser = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        console.log(`req type to users is ${typeof data}`);
        if(!data) return res.status(401).json({message: 'Invalid Data'});
            let user = await User.findOne({email: data.email});
            if(user){
                 return  res.status(400).json({
                    success: 'false',
                    message: 'Email in use'
                });
            }

         user = new User({
            name: data.userName,
            email: data.email,
            password: data.password,
            facebook: data.facebook
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const token = user.generateAuthToken();

        user = await user.save();
        res.status(200).json({
            message: 'success',
            data: {
                name: user.name,
                email: user.email,
                token: token
            }
        })
        
    } catch (error) {
        console.log(error);
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = await User.findByIdAndUpdate(id, data, {
            new: true, 
            runValidators: true
        })
        if(!user) return res.status(404).json({message: 'Invalid Id'});
        res.status(201).json({
            message: 'success',
            data: user
        })
        
        
    } catch (error) {
        res.status(400).json({
            message:'Faild',
            error: error.message
        })
    }
}


exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;        
        const user = await User.findById(id);
        if(!user) return res.status(404).json({message: 'Invalid Id'});
        res.status(200).json({
            message: 'success',
            data: {user}
        });
        
        
    } catch (error) {
        res.status(400).json({
            message:'Faild',
            error: error.message
        })
    }
}


exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        
        const user = await User.findByIdAndDelete(id)
        if(!user) return res.status(404).json({message: 'Invalid Id'});

        res.status(203).json({
            message: 'success',
            data: {}
        });
        
        
    } catch (error) {
        res.status(400).json({
            message:'Faild',
            error: error.message
        })
    }
}


exports.followStudio = async (req, res) => {
    const id = req.params.id
    const studioId = req.body.studio
    console.log(`Studio in follow Studio is : ${studioId}`)
    console.log(`User in followStudio is: ${id}`)
    try {
        let user = await User.findById(id);
        user.followedStudios.push( studioId)
        user = await user.save();
        
    } catch (error) {
        console.log(`Error in followStudio in back is : ${error}`)
    }
}

exports.getFollowedStudios = async (req, res) => {
    const id = req.params.id
    const studios = req.body;
    console.log(`Request is : ${req.body}`)
    console.log(`Checking if studios is an array : ${Array.isArray(studios)}`)
    console.log(`Studios in getFollowedStudios is : ${studios[0]}`)
    console.log(`User in getFollowedStudios is: ${id}`)
    try {

        const allStudios = await Studio.find({_id: studios[0]});
        console.log(`AllStudios in forEach is: ${allStudios}`)
      
    } catch (error) {
        console.log(`Error in followStudio Back is : ${error}`)
    }
}

exports.getFollowedStudiosDetails = async (req, res) => {   
    const studios = req.body.studios;
    let result = [];

    try {

        studios.forEach( async (id, index, studios) => {
          const studio =  await Studio.findById(id);
          result.push(studio);

          if(index === studios.length -1) {
            res.status(200).json({
                message: 'success',
                results: result.length,
                data: result
            })

        }
        });
        
    } catch (error) {
        console.log(`Error in getFollowedStudiosDetails Back is : ${error}`)
    }
}