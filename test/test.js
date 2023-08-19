const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',  // Change this if MySQL is on a different host
  port: 3333,         // Default MySQL port
  user: 'root',
  password: 'thisroot',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');
  // Your code here
});
