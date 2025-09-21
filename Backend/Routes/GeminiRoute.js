const express = require("express")
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chatmodule = require("../Database/GeminiModule.js");
const GeminiModule = require("../Database/GeminiModule.js");
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
    try {
        const { userid, prompt } = req.body;
        
        let chat = await Chatmodule.findOne({ userId: userid });
        if (!chat) {
            chat = new Chatmodule({ userId: userid, messages: [] });
        }
        chat.messages.push({ role: "user", content: prompt });
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        chat.messages.push({ role: "ai", content: aiResponse });
        await chat.save();

        res.json({ messages: chat.messages });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/deleteall", async (req, res) => {
    const { userid } = req.body;

    if (!userid) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const deleted = await GeminiModule.findOneAndDelete({ userId: userid });

        if (!deleted) {
            return res.status(404).json({ message: "User chat not found" });
        }

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
module.exports=router;