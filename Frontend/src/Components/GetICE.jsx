import React from "react";
import { CommunicationIdentityClient }  from "@azure/communication-identity";
import { CommunicationRelayClient }  from "@azure/communication-network-traversal";

const relay = async () => {
    const connectionString = import.meta.env.VITE_CONNECTION_STRING
    const identityClient = new CommunicationIdentityClient(connectionString);

    let identityResponse = await identityClient.createUser();

    const relayClient = new CommunicationRelayClient(connectionString);

    const config = await relayClient.getRelayConfiguration(identityResponse);

    return config.iceServers[0];  
};
export default relay;