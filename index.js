const express = require("express");
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const cors=require("cors");
const userRoute=require('./Routes/userRoute');
const chatRoute=require('./Routes/chatRoute');
const messageRoute=require('./Routes/messageRoute')
app.use(express.json());
app.use(cors());
app.use("/api/users",userRoute);
app.use("/api/chats",chatRoute);
app.use("/api/messages",messageRoute);
const port=3000;
mongoose.connect('mongodb://127.0.0.1:27017/waveapp',{
useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>
    console.log('DataBase is Connected')
).catch((error)=>
    console.log('Database connection fail: ', error.message)
)
app.get("/", (req, res)=>{
    res.send('welcom to home page')
})

app.listen(
    port, (req, res)=>{
        console.log(`Server is runing on port No.${port}`)
    }
)