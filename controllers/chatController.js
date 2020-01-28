var numUsers = 0;
 
module.exports.respond = function(socket){

	var addedUser = false;
  socket.on('new_message', function(data){
    socket.broadcast.emit('st_new_message', {message: data.message, username: data.username,time:data.time});
    socket.emit('my_new_message', {message: data.message, username: data.username,time:data.time});
  });

  
  socket.on('add user', (username) => {
    if (addedUser) return;

    
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
   
    
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
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
 
