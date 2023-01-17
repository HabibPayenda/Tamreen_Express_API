const mongoose = require('mongoose');
const { isSameDay, format } = require('date-fns');



const QrsScannedSchema = mongoose.Schema({
    
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    email: String ,
    time: {
        type: String 
    }
    
});

const QrsScanned = mongoose.model('QrsSccanned', QrsScannedSchema);

module.exports = QrsScanned;