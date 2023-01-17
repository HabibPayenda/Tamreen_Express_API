const mongoose = require('mongoose');

const mongoConnect = async () => {
    try {
    const con = await mongoose.connect('mongodb://localhost/tamreen',
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('mongodb connected')
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongoConnect;