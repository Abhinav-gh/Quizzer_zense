const express = require("express");
const path = require('path');
const Database = require("./database.js");

const app = express();
const port = process.env.PORT || 3003;
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'));
});
app.get('/quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'quiz.html'));
});
app.get('/final.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'final.html'));
});
app.get("/getQuestions", (req, res) => {
    const category = req.query.category;
    
    console.log("Request received to fetch questions for category:", category);
  
    Database.questionsFromDB(category, (err, questions) => {
      if (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ error: "An error occurred while fetching questions from the server" });
      } else {
        console.log("Questions fetched successfully:", questions);
        res.json(questions);
      }
    });
  });
  
// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404);
    res.render('404-This is not found');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500 -Server Error');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});