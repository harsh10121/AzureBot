import React from "react";
import relay from "./GetICE";

let username,credential;

async function set(){
    await relay().then(function(data){
        username=data.username;
        credential=data.credential;
    });
}
set();

export const avatarAppConfig = {
    cogSvcRegion : "eastus",
    cogSvcSubKey : import.meta.env.VITE_SPEECH_KEY,
    voiceName : "en-US-JennyNeural",
    avatarCharacter : "lisa",
    avatarStyle : "casual-sitting",
    avatarBackgroundColor : "black",
    iceUrl : "stun:relay.communication.microsoft.com:3478",
    iceUsername : username,
    iceCredential : credential
}