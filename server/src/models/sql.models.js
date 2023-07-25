const mysql = require('mysql')

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '2812',
  database : 'chats'
});

module.exports = db