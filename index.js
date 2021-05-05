const express = require("express");
const path = require("path");
const socket_io = require("socket.io");
const http = require("http");

// Initializations

const app = express();
const server = http.createServer(app);
const io = socket_io(server);
var userName = "";
var userConnections = {};

PORT = process.env.PORT || 3000;

// using static public files

app.use(express.static(path.join(__dirname,"public")));

//Server Handlers -> Listeners & Emitters
io.on("connection", (socket) => {

	//adding the socket id with username to array
	userConnections[socket.id] = userName;

	// using a channel (client_username to send username to respective clients).
	socket.emit("client_username",{user_name : userName});

	//emitting(or) broadcasting the new connected clients name to all clients so as to be able to notify all clients that new user joined.
	socket.broadcast.emit("new_user_joined",{user_name : userName});

	console.log("new user connected with socket : " + socket.id);

	//all the chat message sent by a client are listened to, from here and sent back to all other clients using 
	// broadcast method & emit methods

	socket.on("chat_channel", (data)=>{
		// broadcasting recieved msg from a client to other clients
		socket.broadcast.emit("chat_channel",data);
	});

	//***TO-DO On disconnet event channel. 
	socket.on("disconnect", ()=>{
		//emitting the name of user disconnect to all users except him
		console.log(`user ${userConnections[socket.id]} disconnected`);
        delete userConnections[socket.id];
		socket.broadcast.emit("user_disconnected",{user_name : userConnections[socket.id]});
	});

});



//taking the username from client and redirescting to chat-page.html
app.get("/new-user", (req,res)=> {
	userName = req.query.user_name;
	res.redirect("chat-page.html");
})

server.listen(PORT, (req,res) => {
	console.log(`Server is running on PORT ${PORT}`);
});





// Problem 1 : how to display Client Username, When his message is sent?
// 			Used Client File as chat-page.js, but need to get username from index.html and redirect to chat.js,
// 			this problem is handled by getting the username from index.html to server on submitting the form and at
// 			the same time, connection will be made as it redirects to client Socket Page, then emitting the username 
// 			back to the client when connection is made is the solution to use it again and again from client side. 


// Problem 2 : If 2 users join at same time, there is a chance of same username being to both users, to avoid that,
// 			we're adding a 1sec delay when the client is connect and username is emitted. 


// problem 3 : front-end to display the senders msg on right and recievers message on left. tried making the message 
// 			send to appear on right, using float,flexbox didnt work. finally came up with a solution using bootstrap
// 			grid system.