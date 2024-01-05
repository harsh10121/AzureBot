import {React,useState,useRef,useEffect} from "react";
import { createAvatarSynthesizer, createWebRTCConnection } from "./Connection";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { avatarAppConfig } from "./config";

function Avatar({msg}){

    const [avatarSynthesizer, setAvatarSynthesizer] = useState(null);
    const myAvatarVideoRef = useRef();
    const myAvatarVideoEleRef = useRef();
    const myAvatarAudioEleRef = useRef();
    const btnRef = useRef();

    var iceUrl = avatarAppConfig.iceUrl
    var iceUsername = avatarAppConfig.iceUsername
    var iceCredential = avatarAppConfig.iceCredential

    const handleOnTrack = (event) => {
        if (event.track.kind === 'video') {
            const mediaPlayer = myAvatarVideoEleRef.current;
            mediaPlayer.id = event.track.kind;
            mediaPlayer.srcObject = event.streams[0];
            mediaPlayer.autoplay = true;
            mediaPlayer.playsInline = true;
            mediaPlayer.addEventListener('play', () => {
            window.requestAnimationFrame(()=>{});
          });
        } else {
          const audioPlayer = myAvatarAudioEleRef.current;
          audioPlayer.srcObject = event.streams[0];
          audioPlayer.autoplay = true;
          audioPlayer.playsInline = true;
          audioPlayer.muted = true;
        }
      };

    const stopSpeaking = () => {
        avatarSynthesizer.stopSpeakingAsync().then(() => {
          console.log("Stop request sent")
        }).catch();
    }

    const speakSelectedText = () => {
        const audioPlayer = myAvatarAudioEleRef.current;
        audioPlayer.muted = false;        
        avatarSynthesizer.speakTextAsync(msg).then(
            (result) => {
                if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                    console.log("Speech and avatar synthesized to video stream.")
                } else {
                    console.log("Unable to speak. Result ID: " + result.resultId)
                    if (result.reason === SpeechSDK.ResultReason.Canceled) {
                        let cancellationDetails = SpeechSDK.CancellationDetails.fromResult(result)
                        console.log(cancellationDetails.reason)
                        if (cancellationDetails.reason === SpeechSDK.CancellationReason.Error) {
                            console.log(cancellationDetails.errorDetails)
                        }
                    }
                }
        }).catch((error) => {
            console.log(error)
            avatarSynthesizer.close()
        });
    }

    const startSession = async () => {

        let peerConnection = createWebRTCConnection(iceUrl,iceUsername, iceCredential);
        
        console.log("WebRTC status: " + peerConnection.iceConnectionState)
        peerConnection.onicegatheringstatechange = (event) => {
            console.log("ICE gathering state: " + peerConnection.iceGatheringState);
        };

        peerConnection.oniceconnectionstatechange = e => {
            console.log("WebRTC status: " + peerConnection.iceConnectionState)
    
            if (peerConnection.iceConnectionState === "connected") {
                console.log("Connected to Azure Avatar service");
            }
            if (peerConnection.iceConnectionState === "disconnected" || peerConnection.iceConnectionState === "failed") {
                console.log("Azure Avatar service Disconnected");
            }
        }

        peerConnection.ontrack = handleOnTrack;
        peerConnection.addTransceiver('video', { direction: 'sendrecv' });
        peerConnection.addTransceiver('audio', { direction: 'sendrecv' });

        let avatarSynthesizer = createAvatarSynthesizer();
        setAvatarSynthesizer(avatarSynthesizer);

        await avatarSynthesizer.startAvatarAsync(peerConnection).then((r) => {
            console.log("Avatar started");
     
        }).catch(
            (error) => {
                console.log("Avatar failed to start. Error: " + error);
            }
        );
    }

    useEffect(function(){
        if(msg){
            // msg has to be spoken
            if(avatarSynthesizer)speakSelectedText();
        }
        else{
            // stop speaking
            if(avatarSynthesizer)stopSpeaking();
        }
    },[msg]);


    return(
        <div>
            <div>
                <div>
                    <div ref={myAvatarVideoRef}>
                        
                        <video className="myAvatarVideoElement" ref={myAvatarVideoEleRef}></video>

                        <audio ref={myAvatarAudioEleRef}></audio>
                        <button className="btn" ref={btnRef}
                            onClick={startSession}>
                            {avatarSynthesizer?"Connected With Avatar":"Connect with Avatar"}
                        </button>
                    </div>  
                </div>
            </div>
        </div>
    );
}

export default Avatar;