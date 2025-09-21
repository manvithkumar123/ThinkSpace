const express=require('express');
const router=express.Router();
const QueryModule=require("../Database/QueriesModule");

router.post("/sendquery",async(req,res)=>{
    let {Username,Mail,Query}=req.body;
    if(!Username || !Mail || !Query){
        return res.status(400).json({msg:"Please enter all fields"});
    }
    else{
    try{
    const newquery = new QueryModule({
        Username,
        Mail,
        Query
    })
    await newquery.save();
    res.status(200).json({respone:"Query sent successfully"});
    }
    catch(err){
        res.status(500).json({msg:"Server error"});
    }
    }
})
router.post("/delete/:id",async(req,res)=>{
    const {id} = req.params;
    try{
        let idtodelete=await QueryModule.findByIdAndDelete(id);
        if(!idtodelete){
            res.status(401).json({response:"Query not found"});
        }
        res.status(200).json({response:"Query deleted successfully"});
    }
    catch(err){
        console.log(err)
        res.status(401).json({response:"Error in deleting query"});
    }
})
router.get("/getqueries",async(req,res)=>{
    try{
        let queries=await QueryModule.find({});
        res.status(200).json(queries); // always return an array, even if empty
    }
    catch(err){
        res.status(500).json({response:"Server error"});
    }
})
router.get("/:id",async(req,res)=>{
    const {id}=req.params;
    try{
        let query= await QueryModule.findById(id);
        if(!query){
            return res.status(404).json({response:"Query not found"});
        }
        res.status(200).json(query);
    }
    catch(err){
        res.status(500).json({response:"Server error"});
    }
})
router.post("/deleteall",async(req,res)=>{
    try{
        await QueryModule.deleteMany({});
        res.status(200).json({response:"All queries deleted successfully"});
    }
    catch(err){
        res.status(500).json({response:"Server error"});
    }
})
module.exports=router;
