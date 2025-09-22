const mongoose=require('mongoose');
const dbgr=require('debug')('development:mongoose');
require('dotenv').config(); 
mongoose.connect(process.env.MONGO_URL
).then(()=>{
  console.log("connected to mongoose");
})
.catch((error)=>{
  console.log("mongoose connection error");
})