const express = require('express');
const mongoose = require('mongoose');
const connectDb = require('./config/db');
const config = require('config');
const users = require('./routes/users');
const studios = require('./routes/studios');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');
const QrsScanned = require("./routes/QrsScanned");
const posts = require('./routes/posts');
const cors = require('cors')

if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR jwtPrivateKey Not Defined');
    process.exit(1);
}

connectDb();

const app = express();



app.use(express.json());
app.use(cors())
app.use(express.static(`${__dirname}/public`));


app.use('/api/v1/users', users);
app.use('/api/v1/studios', studios);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/auth', auth);
app.use('/api/v1/QrsScanned', QrsScanned);
app.use('/api/v1/posts', posts);


app.listen(9000, () => {
    console.log('Connected to the server on port 9000');
});
