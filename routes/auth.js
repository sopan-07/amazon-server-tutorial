const express = require('express');
const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

authRouter.post('/api/signup', async (req, res) => {
  try {
    // ... (Your signup logic -)
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({ 
      email,
      password: hashedPassword,
      name,
    });

    user = await user.save();
    res.json(user); // Send JSON response
  } catch (e) {
    res.status(500).json({ error: e.message }); // Send JSON error response
  }
});

authRouter.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User with this email does not exist' }); // Corrected message
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, "passwordkey"); // Replace "passwordkay" with a strong secret
    
    // Send back the token and user data (excluding the password for security)
    const { password: userPassword, ...rest } = user._doc; // Destructure to remove password
    res.json({ token, ...rest }); // Use the spread operator to send the rest of the user data

  } catch (e) {
    console.error("Signin Error:", e); // Log the error on the server
    res.status(500).json({ error: e.message }); // Send JSON error response
  }
});

  authRouter.post("/tokenIsValid",async(req,res)=>{
    try{
      const token = req.header("X-auth-token");
      if (!token) return res.json(false);
      const  verified = jwt.verify(token,"passwordkey");
      if (!verified) return res.json(false);

      const user = await User.findById(verified.id);
      if(!user) return res.json(false);
      res.json(true);
    } catch(e){
      res.status(500).json({ error: e.message});
    }
  });

  authRouter.get('/',auth, async(req,res)=>{
    const user = await User.findById(req.user);
    res.json({ ...user._doc,token: req.token});

  })
module.exports = authRouter;