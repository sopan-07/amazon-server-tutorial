const jwt = require('jsonwebtoken');
const User =require('../models/user');
const admin = async(req, res , next )=>{
    try{
        const token = req.header("X-auth-token");
        if(!token)
            return res.status(401).json({msg:"No aurh token "});

        const verified = jwt.verify(token,"passwordkey");
        if(!verified)
            return res.status(401).json({msg:"Token verification failed"});
        const user = await User.findById(verified.id);
        if (user.type=='user'|| user.type=='seller'){
            return req.status(401).json({msg:"You are not an admin"});
        }
        req.user = verified.id;
        req.token = token;
        next();
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

module.exports= admin;