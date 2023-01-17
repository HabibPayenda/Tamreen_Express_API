
const Post = require('../models/Posts');
const { format } = require('date-fns');
const path = require('path');

const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image/posts');
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

exports.uploadPostPhoto = upload.single('photo')


exports.getAllPosts = async (req, res) => {
    const posts = await Post.find();
    if(!posts) return res.status(404).json({
        message: 'No Posts found'
    });

    res.status(200).json({
        message: "success",
        results: posts.length,
        data: posts
    });
}

// Getting all the Posts for a sepecific Studio

exports.getPosts = async (req, res) => {
    const studio = req.params.id;
    console.log(`Studio id is : ${studio}`)
    const posts = (await Post.find({studio: studio}).sort({createdAt: -1}));
    if(!posts) return res.status(404).json({
        message: 'No Posts found'
    });
        console.log(`Posts are : ${posts}`)
    res.status(200).json({
        message: 'success',
        data: posts
    });
}
// Getting all the Posts for a sepecific User Followed Studios

exports.getFollowedPosts = async (req, res) => {
    const studios = req.body.studios;
    console.log(`Studios in getFollowedPosts backend is: ${studios}`)
    console.log(`Studios in getFollowedPosts backend is: ${studios.length}`)
    console.log(`Checking if studios is an array getFollowedPosts backend is: ${Array.isArray(studios)}`)
    let posts = []
    try {
       studios.forEach( async (studio, index, studios) => {
         const response =   await Post.find({studio: studio}).populate({
             path: 'studio',
             select: 'name'
         });
        //  console.log(`response in getFollowedStudio is: ${response}`)
         console.log(`response in getFollowedStudio is: ${Array.isArray(response)}`)
         response.map((post) => {
            posts.push(post)
         })
         console.log(`Posts are: ${posts.length}`)
         if(index === studios.length -1) {
             res.status(200).json({
                 message: 'success',
                 results: studios.length,
                 data: posts
             })

         }
         return posts;
        });
    
            
        

    } catch (error) {
        console.log(`Error in getFollowed posts backend is: ${error}`)
    }
}





// Creating a Post 

exports.createPost = async (req, res ) => {
    const { content, studio} = req.body;
    const userId = req.user._id;
    const file = req.file;
    console.log(file)

    let date = Date.now();
    date = format(date, "MM-dd-yyyy");
    
    if( !content) return res.status(500).json({
        message: 'Post needs content'
    })

    if(content.length < 6 && content.length > 256) return res.status(301).json({
        message: 'Content must be between 6 and 256 charecters.'
    });
       

    let post = await new Post({
        creater: userId,
        studio: studio,
        time: date,
        content: content,
        image: file.filename,
        imageUrl: `http://192.168.43.211:9000/image/posts/${file.filename}`
    
        
    });
    post = await post.save();

    res.status(200).json({
        message: 'You have created a new post',
        data: post
    });
}



exports.deletePost = async (req, res ) => {
    const id = req.params.id;
    
   const post = await Post.findByIdAndDelete(id);
   if(!post) return res.status(404).json({
       message: 'No review found',
   });

   res.status(200).json({
       message: 'success',
       data: {}
   });
}

exports.likePost = async (req, res) => {
    const _id = req.params.id;
    console.log(`Post id is ${_id}`)
    const data = req.body;

    console.log(data)

    try {
        const postt = await Post.findById(_id);
        console.log(postt)
        const likess = postt.likes;
        console.log(likess)
        let post = await Post.findById(_id);

        if(!post) return res.status(404).json({
            message: 'Wrong Post'
        });

        post.likes.push(data.user)
        post = await post.save()
        console.log(`Post is : ${post}`)
        

        res.status(200).json({
            message: 'success', 
            data: post
        })
        
    } catch (error) {
        console.log(`Erro in likePost is : ${error}`)
    }

    
}
exports.unLikePost = async (req, res) => {
    const _id = req.params.id;
    console.log(`Post id is ${_id}`)
    const user = req.body.user;

    
    try {
        
        let post = await Post.findById(_id);
        
        if(!post) return res.status(404).json({
            message: 'Wrong Post'
        });
        
        console.log(`user is : ${user}`)
        
        post.likes.pull({_id: user})
        post = await post.save()
        
        console.log(`Post is : ${post.likes}`)
        res.status(200).json({
            message: 'success', 
            data: post
        })
        
    } catch (error) {
        console.log(`Erro in UlikePost is : ${error}`)
    }

    
}


exports.commentPost = async (req, res) => {
    const _id = req.params.id;
    console.log(`Post id is ${_id}`)
    const comment = req.body.commented;
    console.log(`Commented is ${comment}`)

    
    try {
        
        let post = await Post.findById(_id);
        
        if(!post) return res.status(404).json({
            message: 'Wrong Post'
        });
        
        post.comments.push(comment);
        post = await post.save()
        
        console.log(`Post comments are : ${post.comments}`)
        res.status(200).json({
            message: 'success', 
            data: post
        })
        
    } catch (error) {
        console.log(`Erro in commentPost is : ${error}`)
    }

    
}