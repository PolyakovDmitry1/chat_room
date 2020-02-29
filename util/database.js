const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10,
	host: "127.0.0.1",
	user: "root",
	database: "chat",
	password: ""
});

module.exports = pool.promise();
