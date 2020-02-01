# CHAT

## Live Demo
https://mychat-room.herokuapp.com/

## How to use
Make sure you have Node.js and the npm  installed
```
$ git clone https://github.com/Dimasss11/chat_room.git 
$ cd chat_room
$ npm install
$ npm start
```
And point your browser to http://localhost:3000

## Configuration (database)
app.js
```
host: "127.0.0.1",
user: "root",
database: "chat",
password: ""
```
You're gonna need to create a DB named 'chat' and import chat.sql from the folder 'sql' or open chat.mwb and synchronize model with database 

## Features
- Multiple users can join a chat room and each users input username on website load.
- When a user connected a notification shows the user how many users are online.
- Users can type chat messages to the chat room.
- when the user types a message, the notification shows other users that the user is typing.
- A notification is sent to all users when a user joins or leaves the chatroom.
- Also users can see the time of the message was sent.
- Added user registration and message storage.
