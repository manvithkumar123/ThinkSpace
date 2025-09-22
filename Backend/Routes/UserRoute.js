const express = require('express');
const router = express.Router();
const userSchema = require("../Database/Usermodule");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generatetoken = require('../utils/generatetoken');
const isLoggedin = require('../Middlewares/isLoggedin');

// Helper function to set cookie
const setUserTokenCookie = (res, token) => {
    res.cookie("usertoken", token, {
        httpOnly: true,
        secure: true,      // must be true if backend is HTTPS
        sameSite: "None",  // required for cross-site cookies
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
};

// -------------------- REGISTER --------------------
router.post("/register", async (req, res) => {
    console.log("POST /register endpoint hit");
    console.log("Request body:", req.body);

    const { email, password, key, name, role } = req.body;

    if (!email || !password || !key || !name) {
        return res.status(400).json({ response: "All fields are required" });
    }

    try {
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ response: "User already exists, please login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedKey = await bcrypt.hash(key, 10);

        const newUser = new userSchema({
            email,
            password: hashedPassword,
            key: hashedKey,
            name,
            role,
        });

        await newUser.save();

        const token = generatetoken(newUser);
        setUserTokenCookie(res, token); // Set cross-origin cookie here

        return res.status(201).json({ response: "User created successfully" });
    } catch (err) {
        console.error("Error in creating user:", err);
        return res.status(500).json({ response: "Internal server error", error: err.message });
    }
});

// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
    console.log("POST /login endpoint hit");
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    try {
        const existingUser = await userSchema.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ response: "User not found, please sign up" });
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            return res.status(401).json({ response: "Invalid credentials" });
        }

        const token = generatetoken(existingUser);
        setUserTokenCookie(res, token); // Set cross-origin cookie here

        return res.status(200).json({ response: "Logged in successfully" });
    } catch (err) {
        console.error("Error logging in user:", err);
        return res.status(500).json({ response: "Internal server error", error: err.message });
    }
});

// -------------------- FORGOT PASSWORD --------------------
router.post("/forgotpassword", async (req, res) => {
    console.log("POST /forgotpassword endpoint hit");
    console.log("Request body:", req.body);

    const { email, key, password } = req.body;

    try {
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ response: "User not found, please sign up" });
        }

        const validKey = await bcrypt.compare(key, user.key);
        if (!validKey) {
            return res.status(401).json({ response: "Invalid key or username" });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        return res.status(200).json({ response: "Password changed successfully, please login" });
    } catch (err) {
        console.error("Error changing password:", err);
        return res.status(500).json({ response: "Internal server error", error: err.message });
    }
});

// -------------------- LOGGED USER --------------------
router.get("/loggeduser", isLoggedin, async (req, res) => {
    console.log("GET /loggeduser endpoint hit");

    try {
        const token = req.cookies.usertoken;
        if (!token) {
            return res.status(401).json({ response: "User not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const loggedUser = await userSchema.findOne({ email: decoded.email }).select("-password -key");

        return res.status(200).json({ response: loggedUser });
    } catch (err) {
        console.error("Error fetching logged user:", err);
        return res.status(500).json({ response: "Internal server error", error: err.message });
    }
});

// -------------------- LOGOUT --------------------
router.post("/logout", isLoggedin, async (req, res) => {
    console.log("POST /logout endpoint hit");

    try {
        res.clearCookie("usertoken", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });
        return res.status(200).json({ response: "Logged out successfully" });
    } catch (err) {
        console.error("Error logging out user:", err);
        return res.status(500).json({ response: "Internal server error", error: err.message });
    }
});

module.exports = router;