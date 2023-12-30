import { React,useEffect} from "react";
import axios from "axios";

function App(){
    
    useEffect(function(){
        axios.get("http://localhost:3000/")
            .then(function(response){
                console.log(response.data);
            });
    },[]);

    return (
        <div>
            <h1>Hello</h1>
        </div>
    );
}

export default App;