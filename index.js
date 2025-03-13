

const express = require('express');


const authRouter = require('./routes/auth');
const { default: mongoose } = require('mongoose');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const PORT = 3000;
const app = express(); 
// const DB="mongodb+srv://sopankalyane777:sopan108@cluster0.mezkj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const  DB = "mongodb+srv://sopankalyane777:foH1QtEBOu81NbKx@cluster0.mezkj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const DB ="mongodb+srv://sopan777:sopan108@cluster0.th9cl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB = "mongodb+srv://sopankalyane777:sopan108@cluster0.mezkj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

 app.use(express.json());
 app.use(authRouter);
 app.use(adminRouter);
 app.use(productRouter);
 app.use(userRouter);

mongoose.connect(DB).then(() => {
    console.log("connnected ");
})
.catch((e) => {
  console.log(e);
})

// creating API
app.listen(PORT ,"0.0.0.0",() =>{
    console.log(`connected at port${PORT}  `);
} );
 