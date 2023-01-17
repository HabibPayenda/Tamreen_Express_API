const bcrypt = require('bcrypt');
const User = require('../models/Users');
exports.login = async (req,res) => {
    const data = req.body;
    console.log(`Request to auth is ${data}`);
    console.log(`Request to auth is ${data.email}`);

    console.log(`Req type to auth is ${typeof data}`);
    let user = await User.findOne({email: data.email});
    if(!user){
        return res.status(404).json({
            success: 'false',
            message: 'wrong email or password'
        });
    }

    const validPassword = await bcrypt.compare(data.password, user.password);
    if(!validPassword){
       return res.status(404).json({
            success: 'false', 
            message: 'wrong email or password'
        });
    }

  const token = user.generateAuthToken();

    res.status(200).json({
        success: 'true',
        token,
        hasStudio: user.hasStudio,
        id: user._id
        })

}