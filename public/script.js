    
   let typingTimer;                
   let doneTypingInterval = 800;  
   let myInput = document.getElementById('message');
   let block = document.querySelector('.msg-wrap');
   let socket = io();
   let nick;
   name();
    //send

  send_message.addEventListener('click',(e)=>{
    let s = message.value.replace(/^\s+|\s+$/g, '');
    if(!s) return;
    e.preventDefault();
    socket.emit('new_message', {message:message.value,username:nick,time:getTime()});
    message.value="";
    })

   //listen
  socket.on('my_new_message', (data)=>{
    add_messages('my_new_message', data.message, data.username, data.time);
   });


  socket.on('st_new_message', (data)=>{
    add_messages('st_new_message', data.message, data.username, data.time);
   })


  function name(){
    socket.on('add user', (data)=>{
      nick=data.nick;
      username.innerHTML=data.nick;
      let dat=data.data;
      for(var i=0; i<dat.length; i++){
        if(dat[i].login==nick){
          add_messages('my_new_message', dat[i].message, dat[i].login, dat[i].time);
        } else{
          add_messages('st_new_message', dat[i].message, dat[i].login, dat[i].time);
        }
      }
    });
  
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
    if (myInput.value || myInput.value.length==0) {
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


function add_messages(belong,msg,login,time){
  if(belong=='my_new_message'){
    messages.insertAdjacentHTML('beforeend', `<div style="background:#e6ffcc;" class="media-body"><small class="pull-right time"><i class="fa fa-clock-o"></i>${time}pm</small><h5 class="media-heading" style="color:#006600">${login}</h5><small class="col-lg-10">${msg}</small></div> `);
    block.scrollTop = block.scrollHeight;
  }
  if(belong=='st_new_message'){
    messages.insertAdjacentHTML('beforeend', `<div style="background:#e6f7ff" class="media-body"><small class="pull-right time"><i class="fa fa-clock-o"></i>${time}pm</small><h5 class="media-heading">${login}</h5><small class="col-lg-10">${msg}</small></div> `);
    block.scrollTop = block.scrollHeight;
  }
}