const Studio = require('../models/Studios');
const Review = require('../models/Reviews');
const multer = require('multer');
const path = require('path');


const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image/studios/profiles');
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

exports.uploadStudioProfile = upload.single('profile');


const multerStorage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image/studios/backgrounds');
        console.log('Multer Storage');
    },
    filename: (req, file, cb) => {
    cb(null,`${req.user.name}_photo_${req.user._id}${Date.now()}${path.parse(file.originalname).ext}` ) ;
    }
});

const multerFilter2 = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
        console.log("Multer Filter");
    }else{
        cb( res.status(400).json({message: 'Please upload an Image file '}) , false);
    }
}


 const upload2 = multer({
    storage: multerStorage2,
    fileFilter: multerFilter2,
});

exports.uploadStudioBackground = upload2.single('background');



exports.profileUpload = async (req, res) => {
    
    console.log(req.files);
    console.log(req.file);

 
    const owner = req.user._id;
    const studio = await Studio.findOne({owner});
    if (!studio){
        return res.status(401).json({
            message: 'You do not have a studio ',
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
        const id = studio._id;
        await Studio.findByIdAndUpdate(id, {picture: file.filename, pictureUrl: `http://192.168.43.211:9000/image/studios/profiles/${file.filename}`});
        res.status(200).json({
            message: 'Photo Uploaded',
            success: "Success",
            data: file.filename
        });
}

exports.backgroundUpload = async (req, res) => {
    
    console.log(req.files);
    console.log(req.file);

 
    const owner = req.user._id;
    const studio = await Studio.findOne({owner});
    if (!studio){
        return res.status(401).json({
            message: 'You do not have a studio ',
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
        const id = studio._id;
        await Studio.findByIdAndUpdate(id, {backgroundPicture: file.filename, backgroundPictureUrl: `http://192.168.43.211:9000/image/studios/backgrounds/${file.filename}`});
        res.status(200).json({
            message: 'Photo Uploaded',
            success: "Success",
            data: file.filename
        });
}


exports.getAllStudios = async (req, res) => {
    const studios = await Studio.find();
    if(studios.length< 1) return res.status(404).json({
        message: 'No studios Found',
        data: {}
    })
    console.log(`Studios in getAllStudios is: ${studios}`)
    res.status(200).json({
        message: 'success',
        resutls: studios.length,
        studios
    })
}

exports.createStudio = async (req, res) => {
    const data = req.body;
    if(!data) return res.status(401).json({
        message: 'Invalide Data',
        data
    });

    let studio = new Studio({
        name: data.name,
        owner: data.owner
    });

    studio = await studio.save();

    res.status(201).json({
        message: 'success',
        studio
    })
}

exports.getStudioMinDetail = async (req, res) => {
    const id = req.params.id;
    const studio = await Studio.findById(id);
    const reviwes = await Review.find({studio: id});
    if(!reviwes) return res.status(404).json({
        message: 'No review found',
        data: studio
    });

    res.status(200).json({
        message: 'success',
        resutls: reviwes.length,
        studio,
        reviwes
    });
}


exports.getStudio = async (req, res) => {
    console.log(`Req.params is : ${req.params}`)
    console.log(`Req.params is : ${req.params.id}`)
    
    const owner = req.params.id;
    const studio = await Studio.findOne({owner: owner});
    if(!studio) return res.status(404).json({
        message: 'No studio found',
    });
    

    console.log(`Studio in Get Studio is :  ${studio}`)
    console.log(`Type of studio is:  ${typeof studio}`);
    console.log(`Type of studio is:  ${studio.name}`);

    console.log(`Studio Categories in GetStudio is : ${studio.categories}`)
    
    
    res.status(200).json({
        message: 'success',
        studio: studio
    });
}

exports.updateStudio = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    console.log(`Data in update studio is ${data}`)
    console.log(`Data in update studio is ${data.name}`)
    console.log(`Data in update studio is ${id}`)
    
    const studio = await Studio.findByIdAndUpdate(id,{name: data.name}, {
        new: true,
        runValidators: true
    });
    if(!studio) return res.status(404).json({
        message: 'Invalide Id'
    })

    res.status(201).json({
        message: 'success',
        data: studio
    })
}

exports.updateStudioCategory = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    console.log(`Data in updateCategory is : ${data.startTime}`)

    let studio = await Studio.findById(id);
    studio.categories.push({category: data.category , startTime: data.startTime, endTime: data.endTime});
    studio = await studio.save();
    console.log(`Studio in in UpdateCategory is: ${studio}`)

    res.status(200).json({
        message: 'success',
        data: studio
    })
}

////////////////////////////// To Do
/////////////////////////////
exports.deleteStudioCategory = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    console.log(`Data in deleteCategory is : ${data}`)

    let studio = await Studio.findById(id);
    studio.categories.push({category: data.category , startTime: data.startTime, endTime: data.endTime});
    studio = await studio.save();
    console.log(`Studio in in UpdateCategory is: ${studio}`)

    res.status(200).json({
        message: 'success',
        data: studio
    })
}

exports.deleteStudio = async (req, res) => {
    const id = req.params.id;
    const studio = await Studio.findByIdAndDelete(id);
    if(!studio) return res.status(404).json({
        message: 'Invalide Id'
    })

    res.status(201).json({
        message: 'success',
        data: {}
    })
}