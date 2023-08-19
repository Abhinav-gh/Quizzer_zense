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


module.exports = connection;
