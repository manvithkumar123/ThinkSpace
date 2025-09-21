const mongoose = require("mongoose");

const materialSchema=new mongoose.Schema({
    downloadUrl:String,
    viewUrl:String,
    UploadedBy:String,
    Branch:String,
    Subject:String,
    Semester:String,
}, { timestamps: true });

module.exports=mongoose.model("Materialmodule",materialSchema)