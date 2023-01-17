
const Review = require('../models/Reviews');

exports.getAllReviews = async (req, res) => {
    const reviews = await Review.find();
    if(!reviews) return res.status(404).json({
        message: 'No reviews found'
    });

    res.status(200).json({
        message: "success",
        results: reviews.length,
        data: reviews
    });
}

exports.getReview = async (req, res) => {
    const id = req.params.id;

    const review = await Review.findById(id).populate('studio', 'name').populate('owner', 'name');
    if(!review) return res.status(404).json({
        message: 'No review found'
    });

    res.status(200).json({
        message: 'success',
        data: review
    });
}

exports.createReview = async (req, res ) => {
    const data = req.body;
    if(!data) return res.status(500).json({
        message: 'No review data'
    })
    let review = new Review({
        studio: data.studio,
        owner: data.owner,
        number: data.number,
        content: data.content
    });
    review = await review.save();

    res.status(200).json({
        message: 'success',
        data: review
    });
}

exports.updateReview = async (req, res) => {
    const id = req.params.id;
    if(!id) return res.status(404).json({
        message: 'No review found'
    });
    const data = req.body;
    if(!data) return res.status(404).json({
        message: 'No review data found'
    });
    console.log(data);
    try {
        const review = await Review.findByIdAndUpdate(id, data,{
            new: true, 
            runValidators: true
        });
        res.status(200).json({
            message: 'success',
            data: review
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: 'Faild',
            error: error.message
        })
    }

    
}

exports.deleteReview = async (req, res ) => {
    const id = req.params.id;
    
   const review = await Review.findByIdAndDelete(id);
   if(!review) return res.status(404).json({
       message: 'No review found',
   });

   res.status(200).json({
       message: 'success',
       data: {}
   });
}