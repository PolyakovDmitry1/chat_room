    
   let typingTimer;                
   let doneTypingInterval = 800;  
   let myInput = document.getElementById('message');
   let block = document.querySelector('.msg-wrap');
   let socket = io();
    name();
    //send

  send_message.addEventListener('click',(e)=>{
    let s = message.value.replace(/^\s+|\s+$/g, '');
    if(!s) return;
    e.preventDefault();
    socket.emit('new_message', {message:message.value,username:username.value,time:getTime()});
    message.value="";
    })

   //listen
  socket.on('my_new_message', (data)=>{
    messages.insertAdjacentHTML('beforeend', `<div style="background:#e6ffcc;" class="media-body"><small class="pull-right time"><i class="fa fa-clock-o"></i>${data.time}pm</small><h5 class="media-heading" style="color:#006600">${data.username}</h5><small class="col-lg-10">${data.message}</small></div> `);
    block.scrollTop = block.scrollHeight;
   });


  socket.on('st_new_message', (data)=>{
    messages.insertAdjacentHTML('beforeend', `<div style="background:#e6f7ff" class="media-body"><small class="pull-right time"><i class="fa fa-clock-o"></i>${data.time}pm</small><h5 class="media-heading">${data.username}</h5><small class="col-lg-10">${data.message}</small></div> `);
    block.scrollTop = block.scrollHeight;
   })


  function name(){
    let nick= prompt('What is your nickname?', "nickname");
    username.value=nick;
    socket.emit('add user', username.value);
    socket.on('login', (data)=>{
     messages.insertAdjacentHTML('beforeend', `<div class="alert alert-info msg-date"><strong>${checkparticipant(data.numUsers)}</strong></div>`);
   })
  }


  socket.on('user joined', (data)=>{
    messages.insertAdjacentHTML('beforeend', `<div class="alert alert-info msg-date"><strong>${data.username} joined</strong></div>`);
    messages.insertAdjacentHTML('beforeend', `<div class="alert alert-info msg-date"><strong>${checkparticipant(data.numUsers)}</strong></div>`);
     block.scrollTop = block.scrollHeight;
  })


  message.addEventListener('input',(e)=>{
    e.preventDefault();
    socket.emit('typing','');
  })
  

  socket.on('typing', (data)=>{
    if(document.getElementById(data.username)) return;
    messages.insertAdjacentHTML('beforeend', `<div id="${data.username}" class="alert alert-info msg-date"><strong>${data.username} is typing</strong></div>`);
    block.scrollTop = block.scrollHeight;
  })


  myInput.addEventListener('keyup', () => {
  clearTimeout(typingTimer);
    if (myInput.value) {
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
      }
    });
    
    //user is "finished typing," do something
  function doneTyping () {
    socket.emit('stop typing','');
  }


  socket.on('stop typing', (data) => {
    let x = document.getElementById(data.username);
    x.remove(x.selectedIndex);
  });


  socket.on('disconnect', () => {
  });


 socket.on('user left', (data) => {
  messages.insertAdjacentHTML('beforeend', `<div class="alert alert-info msg-date"><strong>${data.username} left</strong></div>`);
  messages.insertAdjacentHTML('beforeend', `<div class="alert alert-info msg-date"><strong>${checkparticipant(data.numUsers)}</strong></div>`);
  block.scrollTop = block.scrollHeight;
 });


  function checkparticipant(numUsers){
   if(numUsers==1){ 
      numUsers="there is 1 participant";
    }else{
      numUsers=`there are ${numUsers} participants`; 
    }
    return numUsers;
  }


  function getTime(){
      function checkTime(i){
        if (i<10){
          i="0" + i;
        }
        return i;
      }
    let t = new Date();
    return checkTime(t.getHours())+":"+checkTime(t.getMinutes())
  }
