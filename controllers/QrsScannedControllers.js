
const QrsScanned = require('../models/QrsScanned');
const { isSameDay, format } = require('date-fns');


exports.getAllScanned = async (req, res) => {
    const scanned = await QrsScanned.find();
    if(!scanned) return res.status(404).json({
        message: 'No reviews found'
    });

    res.status(200).json({
        message: "success",
        results: scanned.length,
        data: scanned
    });
}

exports.getScanned = async (req, res) => {
    const studio = req.params.id;

    const scanned = await QrsScanned.findMany({studio});
    if(!scanned) return res.status(404).json({
        message: 'No review found'
    });

    res.status(200).json({
        message: 'success',
        data: scanned
    });
}

exports.createScanned = async (req, res ) => {
    const data = req.body;

    let date = Date.now();
    date = format(date, "MM-dd-yyyy");
    
    console.log(`Data in create scan  is: Email: ${data.email} Studio:  ${data.studio}`)
    if(!data) return res.status(500).json({
        message: 'No data'
    })
    const check = await QrsScanned.findOne({$and: [{email: data.email}, {time: date}]});
    if(check){
        return res.status(404).json({message: 'Qr allready Scanned'})
    }
       

    let scanned = await new QrsScanned({
        email: data.email,
        // studio: data.studio,
        time: date
        
    });
    scanned = await scanned.save();

    res.status(200).json({
        message: 'You can Enter the Studio',
        data: scanned
    });
}



// exports.deleteReview = async (req, res ) => {
//     const id = req.params.id;
    
//    const review = await Review.findByIdAndDelete(id);
//    if(!review) return res.status(404).json({
//        message: 'No review found',
//    });

//    res.status(200).json({
//        message: 'success',
//        data: {}
//    });
// }