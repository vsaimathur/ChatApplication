var socket = io.connect("http://localhost:3000");
var user_name = "";


// DOM Queries
var msg = document.getElementById("msg");
var send_btn = document.getElementById("send_btn");
var chat_list = document.getElementById("chat_list");

//Client Listeners

//storing the clients user_name onto client script after taking it from get method(querystring) from index.html form.
socket.on('client_username',(data) => {
	user_name = data.user_name;
	//**TO-DO display all the online clients to this newly joined client in his chat-box.
});

//getting the newly joined clients username and displaying it in chat-box
socket.on('new_user_joined', (data) => {
	var li_newUser = document.createElement("li");
	li_newUser.setAttribute("class","row");
	li_newUser.innerHTML = `<div class = "offset-md-3 offset-lg-3 col-md-6 col-lg-6 user_joined rounded text-center">user ${data.user_name} joined the chat</div>`
	chat_list.appendChild(li_newUser);
});

//getting the msg's from other clients and displaying it in chat-box
socket.on("chat_channel", (data) => {

	var li_chatChannalR = document.createElement("li");
	li_chatChannalR.setAttribute("class","row");
	li_chatChannalR.innerHTML = `<div class = "col-md-2 col-lg-2 msgs_received rounded"><span style = "color : orange; font-weight : bold;">${data.name}</span> <br> <span>${data.message}</span></div>`
	chat_list.appendChild(li_chatChannalR);

});

//getting the disconnect clients username and displaying it in chat-box
socket.on("user_disconnected", (data) => {
	var li_userDisconnected = document.createElement("li");
	li_userDisconnected.setAttribute("class","row");
	li_userDisconnected.innerHTML = `<div class = "offset-md-3 offset-lg-3 col-md-6 col-lg-6 user_disconnected rounded text-center">user ${data.user_name} left the chat</div>`
	chat_list.appendChild(li_userDisconnected);
});


//Client Emitters
send_btn.addEventListener("click", (event)=> {
	if(msg.value != "")
	{
		socket.emit('chat_channel',{
			message : msg.value,
			name : user_name
		});

		//appending the entered text into chat-box
		var li_chatChannalS = document.createElement("li");
		li_chatChannalS.setAttribute("class","row");
		li_chatChannalS.innerHTML = `<div class = "offset-md-10 offset-lg-10 col-md-2 col-lg-2 msgs_sent rounded"><span style = "color : orange; font-weight : bold;">${user_name}</span> <br> <span>${msg.value}</span></div>`;
		chat_list.appendChild(li_chatChannalS); 

		//emptying the input text box
		msg.value = "";
	}
});


//Enter key to send message event "keypress" after typing msg in msg element input field
msg.addEventListener("keypress", (event) => {
	if(event.keyCode === 13)
	{
		event.preventDefault();
		send_btn.click();
	}
});



//To pick up from emitting the sent msg to all recievers 2morrow.
//To add Enter key trigger to send msg
//
