const express =require("express");
const router=express.Router();
const RoomSchema = require("../Database/RoomModule");
const isAdmin = require("../Middlewares/isAdmin");

router.post("/createroom",isAdmin,async(req,res)=>{
    let {roomName,information}=req.body;
    if(!roomName||!information){
        return res.status(400).json({response:"All fields are required"});
    }
    else{
        try{
            let newroom=new RoomSchema({
              roomName,
              information,
            })
            await newroom.save();
            res.status(200).json({response:"Room created sucessfully"});
        }
        catch{
            res.status(300).json({response:"Failed to created room"})
        }
    }
})
router.get("/allrooms",async (req,res)=>{
    const userdata = await RoomSchema.find({})
    res.send(userdata);
})
router.post("/delete/:id",isAdmin,async(req,res)=>{
    let id=req.params.id;
    try{
    const deletingroom=await RoomSchema.findByIdAndDelete(id);
    if(!deletingroom){
        return res.status(400).json({response:"Room not found"})
    }
    res.status(200).json({response:"Room deleted successfully"})
    }
    catch{
        res.status(500).json({response:"Server error"})
    }
})
router.get("/present/:id", async (req, res) => {
    try {
        const id = req.params.id; // directly get id
        const userdata = await RoomSchema.findById(id); // pass id directly
        if (!userdata) {
            return res.status(404).json({ response: "Room not found" });
        }
        res.status(200).json(userdata);
    } catch (error) {
        res.status(500).json({ response: "Server error", error: error.message });
    }
});
module.exports=router;