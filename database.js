var mysql = require("mysql2");

var connection = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Preetham@924',
    database: 'hoteldb'
});

module.exports = connection;