let user=require("../models/user.js");

exports.index = function (request, response) {
	if(request.session.loggedin){
		response.redirect('/chat');
	}else{
    response.render("login.hbs",{
		errors: request.session.errors,
		login:request.session.username
	});
	request.session.errors = null;
	request.session.account=null;
	request.session.username=null;
	request.session.loggedin=false;
	}	
};

exports.signup= function(request, response) {
	if(request.session.loggedin){
		response.redirect('/chat');
	}else{
	user.getCountries().then(function(data){
	request.session.loggedin=false;	
	response.render("signUp.hbs",{
		countries:data,
		errors: request.session.errors,
		account:request.session.account
	});
	request.session.errors = null;
	request.session.account=null;
	});
}
};

exports.logout=function (req, res) {
  req.session.destroy();
  res.redirect('/');
};

exports.addUser= function(req,res) {
	let timestamp=Math.round((new Date()).getTime() / 1000);
	req.session.username=req.body.login;
	let userdata=[req.body.email,req.body.login,req.body.name,req.body.password,req.body.date,timestamp,req.body.country];
	user.registration(userdata).then(function(){
		res.redirect('/chat');
	});	
};