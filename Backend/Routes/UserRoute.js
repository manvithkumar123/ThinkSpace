const express = require('express');
const router=express.Router();
const userSchema=require("../Database/Usermodule");
const e = require('express');
const dbgr=require('debug')('development:userroute');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const generatetoken=require('../utils/generatetoken');
const isLoggedin = require('../Middlewares/isLoggedin');


router.post("/register", async (req, res) => {
    console.log("POST /register endpoint hit");
    console.log("Request body:", req.body);

    const { email, password, key, name, role } = req.body;

    // Validate required fields
    if (!email || !password || !key || !name) {
        console.log("Missing required fields");
        return res.status(400).json({ response: "All fields are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            console.log("User already exists with email:", email);
            return res.status(409).json({ response: "User already exists, please login" });
        }

        console.log("Hashing password and key");
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedKey = await bcrypt.hash(key, 10);
        console.log("Password and key hashed");

        const newUser = new userSchema({
            email,
            password: hashedPassword,
            key: hashedKey,
            name,
            role,
        });

        console.log("Saving new user to database");
        await newUser.save();
        console.log("User saved successfully");

        const token = generatetoken(newUser);
        res.cookie("usertoken", token, { httpOnly: true });

        console.log("User created successfully, sending response");
        return res.status(201).json({ response: "User created successfully" });

    } catch (err) {
        console.error("Error in creating user:", err);
        return res.status(500).json({ response: "Internal server error", error: err.message });
    }
});
router.post("/login",async(req,res)=>{
    console.log("POST /login endpoint hit");
    console.log("Request body:", req.body);
    let {email,password}=req.body;
    let exisitinguser=await userSchema.findOne({email:email});
    if(!exisitinguser){
        console.log("User not found with email:", email);
        return res.status(404).json({response:"user not found please sign up "});
    }
    else{
        try{
            console.log("Comparing password");
            let logincredientials= await bcrypt.compare(password,exisitinguser.password);
            if(!logincredientials){
                console.log("Invalid credentials for user:", email);
                return res.status(401).json({response:"invalid credientials"});
            }
            else{
                let token=generatetoken(exisitinguser);
                res.cookie("usertoken",token);
                console.log("Logged in successfully, sending response");
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
    console.log("POST /forgotpassword endpoint hit");
    console.log("Request body:", req.body);
    let{email,key,password}=req.body;
    const userfind=await userSchema.findOne({email:email});
    if(!userfind){
        console.log("User not found with email:", email);
        return res.status(409).json({response:"user not found please sign up"});
    }
    else{
        let compare = await bcrypt.compare(key,userfind.key);
        let hashpassword=await bcrypt.hash(password,10);
        if(!compare){
            console.log("Invalid key for user:", email);
            return res.status(404).json({response:"invalid key or username"});
        }
        else{
            try{
                console.log("Updating password for user:", email);
                userfind.password=hashpassword;
                await userfind.save();
                console.log("Password changed successfully");
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
    console.log("GET /loggeduser endpoint hit");
    try{
        const token=req.cookies.usertoken;
        if(!token){
            console.log("No usertoken cookie found");
            return res.status(401).json({response:"user not logged in"});
        }
        const decoded=jwt.verify(token,process.env.JWT_KEY);
        const loggeduser=await userSchema.findOne({email:decoded.email}).select("-password -key");
        console.log("Fetched logged user:", loggeduser.email);
        res.status(200).json({ response: loggeduser });
    } catch (err) {
        console.error("Error fetching logged user:", err);
        res.status(500).json({ response: "Internal server error", error: err.message });
    }
})
router.post("/logout",isLoggedin,async(req,res)=>{
    console.log("POST /logout endpoint hit");
    try{
        res.clearCookie("usertoken");
        console.log("User logged out successfully");
        res.status(200).json({response:"logged out successfully"});
    }
    catch(err){
        dbgr("error in logging out user",err);
        res.status(500).json({response:"internal server error"});
    }
})
module.exports=router;