import { React,useEffect,useState} from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home.jsx";
import Login from "./Login.jsx";

import io from "socket.io-client";
const socket = io.connect("https://goodspacet1.onrender.com");

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
                    <Route path="https://good-space-task.vercel.app/" element={<Login handleUserID={handleUserID} socket={socket}/>}/>
                    <Route path="https://good-space-task.vercel.app/home" element={<Home userID={userID} email={email} socket={socket}/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;