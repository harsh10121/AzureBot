import { React,useEffect,useState} from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home.jsx";
import Login from "./Login.jsx";

// server deployed - https://goodspacet1.onrender.com
import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");

function App(){

    const [userID,setUserID] = useState("");
    const [email,setEmail] = useState("");

    function handleUserID(data){
        socket.emit("join_room",data);
        setUserID(data.id);
        setEmail(data.email);
    }

    return (
        <div className="main">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login handleUserID={handleUserID} socket={socket}/>}/>
                    <Route path="/home" element={<Home userID={userID} email={email} socket={socket}/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;