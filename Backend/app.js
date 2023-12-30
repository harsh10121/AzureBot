require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/chatDB");

app.get("/",function(req,res){
    res.json({content:"fetch successful"});
});

app.listen(3000,function(){
    console.log("Server started on port 5173");
});
