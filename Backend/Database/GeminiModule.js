const mongoose=require("mongoose");

const chatSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    messages: [
        { role: String, content: String, timestamp: { type: Date, default: Date.now } }
    ],
})

module.exports = mongoose.model("chat", chatSchema);