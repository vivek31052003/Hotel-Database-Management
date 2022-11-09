var mysql = require("mysql2");
require("dotenv").config();

var connection = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Vivek@1234',
    database: 'hotel1'
});

module.exports = connection;