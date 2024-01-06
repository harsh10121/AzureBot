# Application's Architecture

A real time chat application with camera and microphone integration, leveraging OpenAI's API, Socket.io, and MongoDB. The app also features text to speech and speech to text capabilities.

In the App, Node.js is used to provide runtime environment, React JS- a frontend library- is used to interact with the clients, MongoDB -a NoSQL databases- is used to store chat history and user history, Express JS which is a backend framework is used to handle API requests from client, Socket.io is used to provide real time communication between client and AI.

For the app mongoDB schema and their connection will look like this 
![image](https://github.com/harsh10121/GoodSpace-Task/assets/93761689/d4196521-21aa-4e21-a7d3-83642beeaa8e)

### API's exposed by the backend
- GET Request on "/" route
- GET Request on "/test" route
- POST Request on "/login" route
- POST Request on "/data" route
- POST request on "/api/audio" route

- "/" route , Response is json for confirming connection
- "/login" route , expects input as email and password, Response is user id from MongoDB
- "/data" route , expects input as user id, Response is history of user
- "/api/audio" , expects inputs as text, Response is audio in the binary form

### Socket.io Events
socket.io library is used to build up real time communication
- connection, automatically triggers when client comes online
- join_room , Expects input as id and room will be created using join
- sendMsg, Expects input as user input text, Response broadcasts text and AI response to all users within room, using emit on server

Client
- botMsg , Response as user text and AI response

# Setup
For setting up project NPM, Node.js, MongoDB, Express, Socket.io, React(using vite or create-react-app), dotEnv, Mongoose, react-router-dom, axios, socket.io-client, react-scroll-to-bottom and some for webCam and microphone has been used. (Majorly will be installed using NPM).

# User Guide
- A Login section will be visible to users who will follow the production link of repository, which is build using react and deployed on vercel, and server is hosted on render so it can take some time to respond against your login request.
- After logging in, a chat section will be visible where communication with AI can be initiated by writing input.
- In the Bottom section 4 button are there
  - Video
  - Mic On
  - Reset text you spoken
  - Text to speech conversion Button
- Camera is Draggable so users can adjust accordingly

# Troubleshooting while deploying
- CORS and React Router issue can be faced during production, make sure to use cors in server and also provide origin as javascript object by specifying client url, React router issue can be handled based on platform used for deploying frontend, like for vercel include vercel.json by specifying some parameters given in vercel doc.
- Don't forget to connect with MongoDB Atlas for deploying database seperately. 



