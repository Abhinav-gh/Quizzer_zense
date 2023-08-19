const express = require("express");
const path = require('path');
const Database = require("./database.js");

const app = express();
const port = process.env.PORT || 3003;
const connection = Database;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'));
});

app.get('/quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'quiz.html'));
});

app.get('/getQuestions', (req, res) => {
    const query = 'SELECT * FROM questions';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching questions:', error);
            res.status(500).json({ error: 'An error occurred while fetching questions from the server' });
        } else {
            const data = JSON.parse(JSON.stringify(results));
            console.log(data);
            res.status(200).json(data);
        }
    });
});

app.get('/final.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'final.html'));
});

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404).send('404 - This page was not found');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('500 - Server Error');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
