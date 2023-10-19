const jwt = require("jsonwebtoken");
const User = require('../Models/userModels');
require('dotenv').config();



const userAuthenticate = async (req , res , next) =>{
    try{
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token,process.env.SECRETKEY);
        const rootUser = await User.findOne({_id:verifyToken._id , "tokens.token":token});
        if (!rootUser){
            throw new Error('User not found')
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
                                                               
    }catch(error){
        return res.status(505).json({message:'User Not Logged In'})
    }

}

module.exports = userAuthenticate;