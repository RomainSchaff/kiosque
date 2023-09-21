const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 2, // nombre de connexions simultanées maximales
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: "kiosque",
    dateStrings: ['DATE', 'DATETIME']
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

module.exports = pool;
