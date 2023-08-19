const mysql = require("mysql2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "thisroot",
    database: "quizdb",
    port: 3306,
});
connection.connect((err) =>{
    if(err){
        console.log(err)
        return
    }
    console.log('Database connected');
})


Database.getQuestions = function (category, done) {
  const connection = this.configure();
  category = category.toLowerCase();
  const query =
    "SELECT question, option1, option2, option3, option4, solutions FROM questions WHERE category = ? ORDER BY RAND() LIMIT 10";

  connection.query(query, [category], function (err, rows) {
    if (err) {
      done(err, null);
    } else {
      connection.end();
      done(null, rows);
    }
  });
};

module.exports = connection;
