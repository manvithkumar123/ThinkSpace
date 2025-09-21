const mongoose=require('mongoose');
const dbgr=require('debug')('development:mongoose');
require('dotenv').config(); 
mongoose.connect(process.env.MONGO_URL
).then(()=>{dbgr("connected to mongoose")})
.catch((error)=>{dbgr("mongoose connection error")})