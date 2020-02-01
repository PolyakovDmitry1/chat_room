let connection=require("../app.js");
let crypto = require('crypto');

exports.data=function(user){
	user[0]=crypt(user[0]);
	return new Promise(function(succeed, fail) {
		connection.query('SELECT * FROM accounts WHERE password=? AND (login=? OR email=?)', user, function(error, results, fields) {
		if (results) succeed(results);
		if(error) fail(new Error("error"));
	});
	});	
};


exports.getUser=function(user){
	return new Promise(function(succeed, fail) {
		connection.query('SELECT * FROM accounts WHERE login=? OR email=?', user, function(err, data){
		if (data) succeed(data);
		if(err) fail(new Error("error"));
	});
	});	
};


exports.getCountries=function(){
	return new Promise(function(succeed, fail) {
	connection.query('SELECT * FROM countries', function(err, data){
	if (data) succeed(data);
	if(err) fail(new Error("error"));	
	});
});
}


exports.checklogin=function(login){
	return new Promise(function(succeed, fail) {
	connection.query('SELECT login, login FROM accounts WHERE login=?', login, function(err, data){
	if (data) succeed(data);
	if(err) fail(new Error("error"));	
	});
});
}


exports.checkemail=function(email){
	return new Promise(function(succeed, fail) {
	connection.query('SELECT email, login FROM accounts WHERE email=?', email, function(err, data){
	if (data) succeed(data);
	if(err) fail(new Error("error"));	
	});
});
}


exports.registration=function(user){
	user[3]=crypt(user[3]);
	return new Promise(function(succeed, fail) {
	connection.query('INSERT accounts(email, login, real_name, password, birth_date, timestamp,country) VALUES (?,?,?,?,?,?,?)', user, function(err, data){
	if (data) succeed(data);
	if(err) fail(new Error("error"));	
	});
});
}


exports.getMessages=function(){
	return new Promise(function(succeed, fail) {
	connection.query('SELECT * FROM messages',  function(err, data){
	if (data) succeed(data);
	if(err) fail(new Error("error"));	
	});
});
}


exports.saveMessage=function(msg,login,time){
	return new Promise(function(succeed, fail) {
	connection.query('INSERT messages(message, login, time) VALUES (?,?,?)', [msg, login, time],  function(err, data){
	if (data) succeed(data);
	if(err) fail(new Error("error"));	
	});
});
}


 function crypt(pas){
	let mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
	let mystr = mykey.update(pas, 'utf8', 'hex')
	mystr += mykey.final('hex');
	return mystr;
}