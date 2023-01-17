const jwt = require('jsonwebtoken')
const User = require('../models/Users');
const Config = require('config');

module.exports = (req, res, next) => {
    const {authorization} = req.headers;

    if (!authorization) {
        res.status(403).json({
            message: 'You must be logged in!',
            susscess: 'Faild'
        })
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, Config.get('jwtPrivateKey'), async (error , payload ) => {
        if(error){
            return res.status(402).json({message: 'You must be logged in ', susscess: 'Faild'})
            }
        const {_id } = payload;
        const user = await User.findById(_id);
        req.user = user;
        next();
    });
}