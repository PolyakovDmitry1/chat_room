const connection = require('../util/database');

module.exports = class Message {
	
  constructor(message, username, time) {
    this.message = message;
    this.username = username;
    this.time = time;
  }

  static getMessages(){
    return connection.query('SELECT * FROM messages');
  }
  
  async saveMessage(){
    return connection.query('INSERT messages(message, login, time) VALUES (?,?,?)',
      [this.message, this.username, this.time]);
  }

};
