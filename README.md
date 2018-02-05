# groot
Groot powered by node.js, express, and slack API

##Packages Used
-express
-request
-node.js
-body-parser
-http
-firebase
-firebase-admin
-node-schdule
-slack-node


##File Directory
-index.js
-README.md
-node_modules

##ngrok Setup
ngrok exposes local servers behind NATs and firewalls to the public internet over secure tunnels. This allows you to have an introspectable tunnel to monitor incoming and outgoing calls to your web-server.


- download ngrok.
	- Download Website (link)[https://ngrok.com/download]
- once downloaded open up application.exe.
- run `ngrok http whatever port you want` 
	- Example `ngrok http 8080`
- Should see window stating application, which should show your given port as online, alon with these attributes;
	- Forwarding address
	- connections
	- http log
- move on to setting up node.js server using express.

##Firebase Setup

- Sign-in to Firebase
- Go to Authentication Tab
- click on Web Setup
- copy config file into index.js
