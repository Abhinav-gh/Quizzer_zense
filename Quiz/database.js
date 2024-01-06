const mysql = require("mysql2");
const mongoose = require('mongoose');
const User = require('./models/users');
require('dotenv').config();
const dburi = process.env.MONGODB_URI;

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "thisroot",
  database: "quizdb",
  port: 3333,
});
connection.connect((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Database connected');
})


async function registerUser(regDetails, done) {
  // // Checking if user with username already exists
  // connection.query(
  //   "SELECT * FROM users WHERE username = ?",
  //   [regDetails.un],
  //   function(err, rows) {
  //     if (err) throw err;

  //     // If not exists, enter details into the database
  //     if (!rows[0]) {
  //       const query = "INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)";
  //       connection.query(
  //         query,
  //         [regDetails.first, regDetails.last, regDetails.un, regDetails.pw],
  //         function(err) {
  //           if (err) throw err;
  //           done("success");
  //         }
  //       );
  //     } else {
  //       // Callback return call
  //       done(null);
  //     }
  //   }
  // );

  // New mongodb code
  try {
    const existingUser = await User.findOne({ username: regDetails.un }).exec();

    if (!existingUser) {
      const newUser = new User({
        firstname: regDetails.first,
        lastname: regDetails.last,
        username: regDetails.un,
        password: regDetails.pw,
      });

      await newUser.save();
      done("success");
    } else {
      console.log('User already exists');
      done(null);
    }
  } catch (err) {
    console.error('Error in registerUser:', err);
    done(err);
  }
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
    function () {
      console.log("hello connection"); // eslint-disable-line
    }
  );
  connection.connect();

  //return Configuration connection
  return connection;
};

async function loginUser(loginDetails, done) {
  // //Calling Configuration
  // let connection = configure();

  // //Retrieving login details from database
  // let query = "select * from users where username='" +
  //   loginDetails.un +
  //   "' && password='" +
  //   loginDetails.pw +
  //   "'";
  // connection.query(query, function(err, rows) {
  //   if (err) throw err;
  //   connection.end();

  //   //Checks if any usernames are returned with "loginDetails.un" name && "loginDetails.pw" password
  //   if (rows[0]) {
  //     done(err, rows[0]);
  //   } else {
  //     done(err, null);
  //   }
  // });

  // New mongodb code
  try {
    const user = await User.findOne({ username: loginDetails.un, password: loginDetails.pw }).exec();

    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  } catch (err) {
    done(err, null);
  }
};
function createQuizDataTable(connection) {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user_quiz_data (
            username VARCHAR(255),
            question_number INT,
            marked_answer VARCHAR(255),
            PRIMARY KEY (username, question_number)
        );`;

  connection.query(createTableQuery, (error, results) => {
    if (error) {
      console.error('Error creating user_quiz_data table:', error);
    } else {
      console.log('user_quiz_data table created successfully');
    }
  });
}


// New code starts to use mongoDB
function connectToMongoDB() {
  mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error :', err);
    console.log('Retrying to connect to MongoDB...');
    // Retry connection after a delay
    setTimeout(connectToMongoDB, 500); // Retry after 1 seconds
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Retrying to connect...');
    // Retry connection after a delay
    setTimeout(connectToMongoDB, 500); // Retry after 1 seconds
  });
}


connectToMongoDB();

let connect = configure();
createQuizDataTable(connect);

module.exports = {
  connection: connection,
  register: registerUser,
  login: loginUser,
};