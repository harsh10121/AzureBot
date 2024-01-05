import {React,useState,useEffect} from "react"
import {useNavigate} from "react-router-dom";
import axios from "axios";
import relay from "./GetICE";

function Login({handleUserID,socket}){   
    const [cred,setCred] = useState({email:"",password:""});
    const navigate = useNavigate();
    const [userID,setUserID] = useState("");

    function handleChange(event){
        setCred(function(prevCred){
            return {...prevCred,[event.target.name]:event.target.value};
        });
    }

    async function handleClick(){
        //send data to server
        const response = await axios.post("http://localhost:3000/login", {
            email: cred.email,
            password: cred.password
        },{withCredentials: true});
        
        handleUserID({id:response.data.id,email:cred.email});
        navigate("/home");
        setCred({email:"",password:""});
    }


    return (
        <div className="login">
            <div>Login</div>
            <label>Email</label>
            <input type="text" name="email" onChange={handleChange} autoComplete="off"/>
            <label className="loginPass">Password</label>
            <input type="password" name="password" onChange={handleChange} autoComplete="off"/>
            <button type="submit" onClick={handleClick} className="loginBtn">Login</button>
        </div>
    );
}

export default Login;