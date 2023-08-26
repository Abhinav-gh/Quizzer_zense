const mysql = require("mysql2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "thisroot",
    database: "quizdb",
    port: 3333,
});
connection.connect((err) =>{
    if(err){
        console.log(err)
        return
    }
    console.log('Database connected');
})


function registerUser(regDetails, done) {
    // Checking if user with username already exists
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [regDetails.un],
      function(err, rows) {
        if (err) throw err;
  
        // If not exists, enter details into the database
        if (!rows[0]) {
          const query = "INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)";
          connection.query(
            query,
            [regDetails.first, regDetails.last, regDetails.un, regDetails.pw],
            function(err) {
              if (err) throw err;
              done("success");
            }
          );
        } else {
          // Callback return call
          done(null);
        }
      }
    );
  };
  function configure() {
    //Database Configuration
    let connection = mysql.createConnection(
      {
        host: "localhost",
        port: 3333,
        user: "root",
        password: "thisroot",
        database: "quizdb"
      },
      function() {
        console.log("hello connection"); // eslint-disable-line
      }
    );
    connection.connect();
  
    //return Configuration connection
    return connection;
  };
  
  function loginUser (loginDetails, done) {
    //Calling Configuration
    let connection = configure();
  
    //Retrieving login details from database
    let query = "select * from users where username='" +
      loginDetails.un +
      "' && password='" +
      loginDetails.pw +
      "'";
    connection.query(query, function(err, rows) {
      if (err) throw err;
      connection.end();
  
      //Checks if any usernames are returned with "loginDetails.un" name && "loginDetails.pw" password
      if (rows[0]) {
        done(err, rows[0]);
      } else {
        done(err, null);
      }
    });
  };
  module.exports = {
    connection: connection,
    register: registerUser,
    login: loginUser,
  };