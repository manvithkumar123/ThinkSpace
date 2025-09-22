const express = require('express');
const app = express();
const cors = require('cors');
const path=require('path')
const mongoose = require("./Database/Mongooseconnection")
const flash = require("connect-flash")
const expressSession=require("express-session")
const cookieParser = require("cookie-parser");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL }
});


const userRoute=require("./Routes/UserRoute")
const RoomRoute=require("./Routes/RoomRoute")
const googleDriveRouter =require( "./Routes/GoogleDrive.js");
const QueryRoute=require("./Routes/QueryRoute.js")
const GeminiRouter = require("./Routes/GeminiRoute");
const MessageRouter=require("./Routes/MessageRoute.js")(io);

const socketHandler = require("./utils/socketHandler.js");
socketHandler(io);


app.use(cookieParser());
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.SESSION_SECRET,
}))
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: true }));
app.use(flash());

app.use("/api/user",userRoute)
app.use("/api/room",RoomRoute)
app.use("/api/drive", googleDriveRouter);
app.use("/api/query", QueryRoute);
app.use("/api/gemini",GeminiRouter)
app.use("/api/chat",MessageRouter)

app.get("/",(req,res)=>{
    res.send("hi")
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));