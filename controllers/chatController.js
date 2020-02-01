let user=require("../models/user.js");
var path = require('path');
var numUsers = 0;
var nick;

exports.chat = function(request, response) {
	nick=request.session.username;
  if (request.session.loggedin) {
  	userlogin=request.session.username;
  	 response.sendFile(path.join(__dirname, '../public','index.html'));
  } else {
    response.send('Please login to view this page!');
  }
};

module.exports.respond = function(socket){
	var addedUser=false;
  	user.getMessages().then(function(data){
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


  socket.on('new_message', function(data){
    socket.broadcast.emit('st_new_message', {message: data.message, username: data.username,time:data.time});
    socket.emit('my_new_message', {message: data.message, username: data.username,time:data.time});
    user.saveMessage(data.message, data.username, data.time).then(()=>{});
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
