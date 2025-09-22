const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const Materialmodule = require("../Database/MaterialsModule");
const isLoggedin = require("../Middlewares/isLoggedin");
const jwt = require("jsonwebtoken");
const usermodule = require("../Database/Usermodule"); // adjust path if needed

const upload = multer({ dest: "uploads/" });

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL,
);

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// Route to generate auth URL
router.get("/auth", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  return res.json({ url: authUrl });
});

// OAuth2 callback route
router.get("/oauth2callback", async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(path.join(__dirname, "../config/tokens.json"), JSON.stringify(tokens));
    return res.send("Authentication successful! You can now upload files.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error retrieving access token");
  }
});

// Upload file using OAuth2
router.post("/upload", upload.single("file"),isLoggedin,async (req, res) => {
    let user;
    let{ Branch, Semester, Subject,preview } = req.body;
    const token=req.cookies.usertoken;
    
  try {
    if(!token){
        return res.status(401).json({response:"Login First"});
    }
    else{
        try{
            const verify = jwt.verify(token, process.env.JWT_KEY);
            user = await usermodule.findOne({ email: verify.email}).select("-password")
            if (!user) {
                return res.status(401).json({ response: "User not found" });
            }
        }
        catch{
            return res.status(401).json({response:'an unknown error occured'});
        }
    }
    if (!req.file || !Branch || !Semester || !Subject) {
        return res.status(400).send("All fields are required");
    }
    if (fs.existsSync(path.join(__dirname, "../config/tokens.json"))) {
      const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, "../config/tokens.json")));
      oAuth2Client.setCredentials(tokens);
    } else {
      return res.status(401).json({response:'OAuth tokens not found. Authenticate first'});
    }

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const fileMetadata = {
      name: req.file.originalname,
      parents: ['1U9gaUf-L9b-gL60ueYRt9nzI1Qi6PJxH']
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink",
    });
    console.log("Drive upload response:", response.data.id);

    // Set permission for anyone with the link
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    fs.unlinkSync(req.file.path);

    const newMaterial = new Materialmodule({
        downloadUrl: response.data.webContentLink,
        viewUrl: response.data.webViewLink,
        UploadedBy: user.name,
        Branch,
        Subject,
        Semester,
    });
    await newMaterial.save();
    return res.json({response:"file uploaded successfully"});
  } catch (err) {
    console.error("Upload error:", err); // log full error to server console
    return res.status(500).json({ response: "An error occurred", error: err.message });
}
});
router.get("/materials", async (req, res) => {
  try{
    const materials=await Materialmodule.find()
    res.json(materials);
  }
  catch(err){
    res.status(500).json({response:"internal server error"});
  }

});
router.get("/pdf/:id",async (req,res)=>{
  const id=req.params.id;
  try{
    const material=await Materialmodule.findById(id);
    if(!material){
      return res.status(404).json({response:"Material not found"});
    }
    else{
      res.json(material);
    }
  }
  catch{
    res.status(500).json({response:"internal server error"});
  }
})
router.post("/delete/:id",async(req,res)=>{
  const id=req.params.id;
  try{
    const deletingmaterial=await Materialmodule.findByIdAndDelete(id);
    if(!deletingmaterial){
      return res.status(404).json({response:"Material not found"});
    }
    else{
      return res.json({response:"Material deleted successfully"});
    }
  }
  catch{
    res.status(500).json({response:"internal server error"});
  }
})
module.exports = router;