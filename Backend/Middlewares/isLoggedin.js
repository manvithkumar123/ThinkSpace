const jwt = require('jsonwebtoken');
const usermodule = require('../Database/Usermodule');

module.exports = async (req, res, next) => {
    const token = req.cookies.usertoken;

    if (!token) {
        return res.status(401).json({ success: false, message: "Please login first" });
    }

    try {
        const verify = jwt.verify(token, process.env.JWT_KEY);
        const user = await usermodule.findOne({ email: verify.email }).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.clearCookie("usertoken");
        return res.status(401).json({ success: false, message: "Session expired, please login again" });
    }
};