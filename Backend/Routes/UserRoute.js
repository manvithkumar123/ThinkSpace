const express = require('express');
const router=express.Router();
const userSchema=require("../Database/Usermodule");
const e = require('express');
const dbgr=require('debug')('development:userroute');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const generatetoken=require('../utils/generatetoken');
const isLoggedin = require('../Middlewares/isLoggedin');



router.post("/register",async(req,res)=>{
    let {email,password,key,name,role}=req.body;
    if (!email || !password || !key || !name) {
        return res.status(400).json({ response: "All fields are required" });
    }
    let exisitinguser=await userSchema.findOne({email});
    if(exisitinguser){
        res.status(409).json({response:"User already exisits please login"});
    }
    else{
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedkey = await bcrypt.hash(key, 10);
        let newuser= new userSchema({
            email,
            password: hashedPassword,
            key:hashedkey,
            name,
            role,
        });
        await newuser.save();
        let token=generatetoken(newuser);
        res.cookie("usertoken",token);
        res.status(201).json({response:"User created successfully"});
    }
    catch(err){
        dbgr("error in creating user",err);
        res.status(500).json({response:"internal server error"});
    }}
})
router.post("/login",async(req,res)=>{
    let {email,password}=req.body;
    let exisitinguser=await userSchema.findOne({email:email});
    if(!exisitinguser){
        return res.status(404).json({response:"user not found please sign up "});
    }
    else{
        try{
            let logincredientials= await bcrypt.compare(password,exisitinguser.password);
            if(!logincredientials){
                return res.status(401).json({response:"invalid credientials"});
            }
            else{
                let token=generatetoken(exisitinguser);
                res.cookie("usertoken",token);
                res.status(200).json({response:"logged in successfully"});
            }

        }
        catch(err){
            dbgr("error in logging in user");
            res.status(500).json({response:"internal server error"});
        }
    }
})
router.post("/forgotpassword",async(req,res)=>{
    let{email,key,password}=req.body;
    const userfind=await userSchema.findOne({email:email});
    if(!userfind){
        return res.status(409).json({response:"user not found please sign up"});
    }
    else{
        let compare = await bcrypt.compare(key,userfind.key);
        let hashpassword=await bcrypt.hash(password,10);
        if(!compare){
            return res.status(404).json({response:"invalid key or username"});
        }
        else{
            try{
                userfind.password=hashpassword;
                await userfind.save();
                res.status(201).json({response:"sucessfully changed password please login"});
            }
            catch{
                dbgr("error in logging in user");
                return res.status(500).json({response:"internal server error"});
            }
        }
    }

})
router.get("/loggeduser",isLoggedin,async(req,res)=>{
    try{
        const token=req.cookies.usertoken;
        if(!token){
            return res.status(401).json({response:"user not logged in"});
        }
        const decoded=jwt.verify(token,process.env.JWT_KEY);
        const loggeduser=await userSchema.findOne({email:decoded.email}).select("-password -key");
        res.status(200).json({ response: loggeduser });
    } catch (err) {
        console.error("Error fetching logged user:", err);
        res.status(500).json({ response: "Internal server error", error: err.message });
    }
})
router.post("/logout",isLoggedin,async(req,res)=>{
    try{
        res.clearCookie("usertoken");
        res.status(200).json({response:"logged out successfully"});
    }
    catch(err){
        dbgr("error in logging out user",err);
        res.status(500).json({response:"internal server error"});
    }
})
module.exports=router;