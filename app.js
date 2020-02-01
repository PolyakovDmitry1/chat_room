var mysql = require('mysql2');
var session = require('express-session');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var connection = mysql.createPool({
	//connectionLimit: 10,
	host: "127.0.0.1",
	user: "root",
	database: "chat",
	password: ""
});

module.exports=connection;
const signupRouter=require("./routes/signupRouter.js");
const userRouter = require("./routes/userRouter.js");

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	  cookie: { 
            httpOnly: true,
            maxAge: null
          }
}));

app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/signup", signupRouter);

app.use(express.static(path.join(__dirname, 'public')));
var controller = require('./controllers/chatController.js');
io.on('connection', controller.respond );

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

