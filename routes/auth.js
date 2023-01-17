const express = require('express');

const  {login } = require('../controllers/authControlers');


const User = require('../models/Users');


const router = express.Router();

router.route('/').post(login);




module.exports = router;