const mongoose = require("mongoose");

const QueriesSchema=new mongoose.Schema({
    Username:String,
    Mail:String,
    Query:String,
},{timestamps:true})

module.exports=mongoose.model("Queries",QueriesSchema);