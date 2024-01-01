require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const OpenAI = require("openai");
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));

const corsOptions = {
    origin: "https://good-space-task.vercel.app",
    methods: ["POST", "GET"],
    credentials: true
};

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://good-space-task.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
});

app.use(cors({
    origin:["https://good-space-task.vercel.app"],
    methods:["POST","GET"],
    credentials: true
}));

const io = new Server(server,{
    cors:corsOptions
});

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
});


mongoose.connect(process.env.mongoUrl);

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const threadSchema = new mongoose.Schema({
    userid:String,
    messages:[{name:String,chat:String}]
});

const User = mongoose.model("User",userSchema);
const Thread = mongoose.model("Thread",threadSchema);


app.get("/",async function(req,res){
    res.json({name:"harsh bhai"});
});

app.post("/login",async function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    // put into user DB

    bcrypt.hash(password, 4, async function(err, hash) {
        const doc = await User.findOneAndUpdate({email:email},{password:hash},{
            new:true,
            upsert:true
        });
        res.json({id:doc._id}); 
    });
});

app.get("/test",async function(req,res){
    const response = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages:[{"role":"user","content":"essay on global warming"}],
        max_tokens:70
    });
    console.log(response.choices[0]);
});

app.post("/data",async function(req,res){
    const data = await Thread.findOne({userid:req.body.id});
    res.send(data);
});

app.post("/api/audio",async function(req,res){
    // take last post of particular user and send it as buffer
    try {
        const mp3 = await openai.audio.speech.create({
            model: 'tts-1',
            voice: 'alloy',
            input: req.body.msg,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        res.end(buffer,"binary");
    } 
    catch(error){
        console.error('Error generating and sending audio:', error);
    }
});


io.on("connection",function(socket){
    console.log(`a user connected ${socket.id}`);

    socket.on("join_room",(data)=>{
        const userID = data.id;
        socket.join(userID);
        console.log(`user with ID: ${socket.id} joined room : ${userID}`);
    });

    socket.on("sendMsg",async (data)=>{
        // store it in database
        console.log(data);
        // socket joining based on user ID
        const response = await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages:[{"role":"user","content":`${data.chat}`}],
            max_tokens:50
        });
        //console.log(response.choices[0].message.content);
        const botMsg = {
            chat : response.choices[0].message.content,
            name : "Robo"
        };
        const userMsg = {
            chat : data.chat,
            name : data.name
        }

        const total = [userMsg,botMsg];

        io.to(socket.id).emit("botMsg", total);
        socket.to(data.userID).emit("botMsg",total);

        const messagesToInsert = [{name:data.name,chat:data.chat},{name:"Robo",chat:botMsg.chat}];

        const doc = await Thread.findOneAndUpdate({userid:data.userID},{$push:{messages:{$each:messagesToInsert}}},
            { upsert: true, new: true });
    });

    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id);
    });
});

server.listen(3000,function(){
    console.log("Server started on port 3000");
});