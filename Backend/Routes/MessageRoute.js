const express = require("express");
const router = express.Router();
const MessageModule = require("../Database/MessageModule");

module.exports=(io)=>{
router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await MessageModule.find({ room: roomId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {    
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});   


router.post("/send", async (req, res) => {
  const { room, user, text, userid } = req.body;
  try { 
    const message = await MessageModule.create({ room, user, text, userid });

    // Emit the new message to everyone in the room
    io.to(room).emit("newMessage", message);

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});p
return router;
}