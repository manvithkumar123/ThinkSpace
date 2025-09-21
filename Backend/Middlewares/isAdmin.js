const jwt = require('jsonwebtoken');
const usermodule = require('../Database/Usermodule');

const isAdmin = async (req, res, next) => {
    const token = req.cookies.usertoken;

    try {
        if (!token) {
            return res.status(401).json({ message: "No token, please login" });
        }

        const verify = jwt.verify(token, process.env.JWT_KEY);
        const user = await usermodule.findOne({ email: verify.email }).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied, admin only" });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

module.exports = isAdmin;