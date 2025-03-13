const jwt = require('jsonwebtoken');
const authRouter = require('../routes/auth');

const auth = async(req,res, next )=>{
    try{
        const token = req.header('X-auth-token');
        
        if(!token)
            res.status(401).json({msg: 'No Auth Token'})
        const verified =jwt.verify(token,"passwordkey");
        if(!verified) return res.status(401).json({msg:"token verification auth denied"});

        req.user= verified.id;
        req.token = token;
        next();
    }catch(err){
        res.status(500).json({error: err.message});
    }
};
module.exports = auth;