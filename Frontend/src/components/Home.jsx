import {React,useState,useRef,useEffect} from "react"
import {useNavigate} from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import Webcam from "react-webcam";
import Draggable from "react-draggable";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function Home({userID,email,socket}){
    const navigate = useNavigate();
    // const videoref = useRef(null);
    const [showCamera, setShowCamera] = useState(0);

    const [audio] = useState(new Audio());
    const [loading, setLoading] = useState(false);
    const [chat, setChat]=useState("");
    const [thread, setThread] = useState([]);
    const [defaultPosition, setDefaultPosition] = useState({ x:window.innerWidth-1300, y:22});
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
    const[speak,setSpeak]=useState(0);

    useEffect(function(){
        if(!userID){
            navigate("/");
        }
    },[]);

    useEffect(function(){
        const handleBotMsg = (data) => {
            setThread((prev) => [...prev,data[0]]);
            setThread((prev) => [...prev, data[1]]);
            console.log(data);
        };

        socket.on("botMsg",handleBotMsg);

        return ()=>{
            socket.off("botMsg",handleBotMsg);
        };
    },[socket]);

    useEffect(function(){
        let cancelRequest = false;

        async function history() {
            try {
                const resp = await axios.post("http://localhost:3000/data", { id: userID });

                if (!cancelRequest && resp.data.messages) {
                    setThread(resp.data.messages);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        history();

        return ()=>{
            cancelRequest = true;
        };

    },[]);

    useEffect(function(){
        setChat(transcript);
        return ()=>{
            setChat();
        }
    },[transcript]);

    function handleChange(event){
        setChat(event.target.value);
    }
    async function handleSubmit(){
        const name = (email.split("@"))[0];
        const msg = {
            chat:chat,
            userID:userID,
            name:name
        };
        socket.emit("sendMsg",msg);
        // setThread(function(prevArr){
        //     return [...prevArr,msg];
        // });
        setChat("");
    }
    
    function handleCamera(){
        setShowCamera(function(prev){
            if(prev===0)return 1;
            else return 0;
        });
        
        setDefaultPosition({ x:window.innerWidth-1300, y:22});
    }

    async function handlePlay(){
        try {
            if(speak===0)
            {
                setLoading(true);
                const msg = (thread.length===0?"":thread[thread.length-1].chat);
                const response = await axios.post("http://localhost:3000/api/audio",{msg:msg},{responseType: 'arraybuffer'});
                
                const arrayBuffer = response.data;
                const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
                const dataUri = URL.createObjectURL(blob);

                audio.src = dataUri;
                audio.play();
            }
            else{
                audio.pause();
            }
        } 
        catch (error) {
            console.error('Error fetching and playing audio:', error);
        } 
        finally {
            setLoading(false);
            if(speak===0) setSpeak(1);
            else setSpeak(0);
        }
    }

    const videoConstraints = {
        width: 150,
        height: 100,
        facingMode: "user"
    };

    return (
        <div>
            <div>
                <div className="block1">
                    <div className="msg">
                        <ScrollToBottom className="msg-container">
                            {thread.map((message)=>{
                                return (
                                    <div className="message" id={message.name === "Robo" ? "other" : "you"}>
                                        <div className="message-child">
                                            <div className="message-meta">
                                                <p>{message.name}</p>
                                            </div>
                                            <div className="message-content">
                                                <p>{message.chat}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </ScrollToBottom>
                    </div>
                </div>
                <div className="search">
                    <input name="chatbox" type="text" value={chat} onChange={handleChange} autoComplete="off"/>
                    <button className="plane" onClick={handleSubmit}><span className="material-icons-outlined">send</span></button>
                </div>
                {showCamera && 
                    <Draggable position={defaultPosition} onStop={(e, data) => setDefaultPosition({ x: data.x, y: data.y })}>
                        <div style={{ width: '150px', height: '100px'}}>
                            <Webcam height={100} width={150} videoConstraints={videoConstraints}/>
                        </div>
                    </Draggable>
                }
                <div className="combined">
                    <div className="block2">
                        <button onClick={handleCamera} title="Video">
                            <span className="material-icons-outlined">video_call</span>
                        </button>
                    </div>
                    <div className="block3" title="Turn On Mic">
                        <button onClick={SpeechRecognition.startListening}>
                            <span class="material-icons-outlined">mic_none</span>
                        </button>
                    </div>
                    <div className="block3">
                        <button onClick={resetTranscript} title="Reset Voice Text">
                            <span class="material-icons-outlined">restart_alt</span>
                        </button>
                    </div>
                    <div className="block3">
                        <button title="Convert Text Into Voice" id="playButton" onClick={handlePlay} disabled={loading}>
                            <span class="material-icons-outlined">speaker_phone</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;