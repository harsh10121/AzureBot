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
    cogSvcSubKey : "bf6b0303ed4d46e6929350789ac7e30a",
    voiceName : "en-US-JennyNeural",
    avatarCharacter : "lisa",
    avatarStyle : "casual-sitting",
    avatarBackgroundColor : "black",
    iceUrl : "stun:relay.communication.microsoft.com:3478",
    iceUsername : username,
    iceCredential : credential
}