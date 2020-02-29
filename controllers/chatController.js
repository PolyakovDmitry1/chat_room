let user=require("../models/user.js");
let message=require("../models/message.js");
var path = require('path');
var numUsers = 0;
var nick;

exports.chat = async function(request, response) {
  let item=[request.session.username, request.session.username];
    if (request.session.loggedin) {
      let [data]=await user.getUser(item);
        nick=data[0].login;
  	    response.sendFile(path.join(__dirname, '../public','index.html'));
  
    } else {
      response.send('Please login to view this page!');
    }
};



module.exports.respond = function(socket){
	var addedUser=false;
  message.getMessages().then(function([data]){
  		addedUser=true;
  	socket.username=nick;
  	socket.emit('add user', {data:data,nick:nick});


  	++numUsers;
    socket.emit('login', {
      numUsers: numUsers
    });
   

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });

  	});


  socket.on('new_message', async function(data){
    socket.broadcast.emit('st_new_message', {message: data.message, username: data.username,time:data.time});
    socket.emit('my_new_message', {message: data.message, username: data.username,time:data.time});
    let newMessage=new message(data.message, data.username, data.time);
    await newMessage.saveMessage();
  });


  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
}
