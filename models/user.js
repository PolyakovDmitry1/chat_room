const connection = require('../util/database');
const bcrypt = require('bcrypt');

module.exports = class User {
	
  constructor(email, login, name, password, date, timestamp, country) {
    this.email = email;
    this.login = login;
    this.name = name;
    this.password = password;
		this.date = date;
		this.timestamp = timestamp;
    this.country = country;
  }

	async save() {
		this.password=await crypt(this.password);
    return connection.query(
    	'INSERT accounts(email, login, real_name, password, birth_date, timestamp,country) VALUES (?,?,?,?,?,?,?)',
	  	[this.email, this.login, this.name, this.password, this.date,	this.timestamp, this.country]
    );
  }

	static async data([pass, login]){
		let [rows, fields]=await connection.query('SELECT * FROM accounts WHERE login=? OR email=?', [login,login]);
		if(rows.length<1) return false;
		let result=await cryp(pass, rows[0].password);
		return result;
	}

	static getUser(user){
		return connection.query('SELECT * FROM accounts WHERE login=? OR email=?', user);
	}
	
	static getCountries(){
		return connection.query('SELECT * FROM countries');
	}
	
	static checklogin(login){
		return connection.query('SELECT login, login FROM accounts WHERE login=?', login);
	}
	
	static checkemail(email){
		return connection.query('SELECT email, login FROM accounts WHERE email=?', email);
	}

};

	function crypt(myPlaintextPassword) {
		return new Promise (function(succeed, fail){
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
					if(err) console.log(err);
					if (hash) succeed(hash);	
				});
			});
	  })	 
}

	function cryp(pass, hash) {
		return new Promise (function(succeed, fail){
			bcrypt.compare(pass, hash, function(err, result) {
				if(err) console.log(err);
				succeed(result);
		});
	})	 
}