const mongoose = require('mongoose');

const RoomSchema= new mongoose.Schema({
    roomName:String,
    information:String,
})
module.exports=mongoose.model("room",RoomSchema)