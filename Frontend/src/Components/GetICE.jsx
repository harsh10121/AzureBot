import React from "react";
import { CommunicationIdentityClient }  from "@azure/communication-identity";
import { CommunicationRelayClient }  from "@azure/communication-network-traversal";

const relay = async () => {
    const connectionString = "endpoint=https://real-time-avatar.unitedstates.communication.azure.com/;accesskey=ivmfpcruwuzxe4/EOUVGbmpSMPxIs4eZM5KxNDLvjfdr2WeXU+R6i7/bkh7pN6Zo0IaWKgpwa3AOIZn7+jTh/w=="
    const identityClient = new CommunicationIdentityClient(connectionString);

    let identityResponse = await identityClient.createUser();

    const relayClient = new CommunicationRelayClient(connectionString);

    const config = await relayClient.getRelayConfiguration(identityResponse);

    return config.iceServers[0];  
};
export default relay;