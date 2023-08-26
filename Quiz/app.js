const express = require("express");
const path = require('path');
const { connection } = require("./database.js");


const app = express();
const port = process.env.PORT || 3000;
// let routes = require("./routes/index");

const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./routes/index');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'SECRETSESSION', resave: false, saveUninitialized: true }));
app.use('/', router); // Mount your router on the root path
// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'register.html'));
});
app.get('/quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'quiz.html'));
});
app.get('/analysis.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'analysis.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'));
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
app.get('/getUserName', (req, res) => {
    const sess = req.session;
    if (sess.userDetails) {
        const username = sess.userDetails.username;
        const query = `SELECT firstname, lastname FROM users WHERE username = ?`;
        
        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Error fetching user data:', error);
                res.status(500).json({ error: 'An error occurred while fetching user data from the server' });
            } else {
                if (results.length > 0) {
                    const userData = results[0];
                    res.status(200).json(userData);
                } else {
                    res.status(404).json({ error: 'User data not found' });
                }
            }
        });
    } else {
        res.status(401).json({ error: 'User session not found' });
    }
});



app.get('/final.html', (req, res) => {
    // Create the user's quiz data table (if not already created)
    const sess = req.session;
    if (sess.userDetails && sess.userDetails.username) {
        const username = sess.userDetails.username;
        const query = `
            CREATE TABLE IF NOT EXISTS user_quiz_data (
                username VARCHAR(255) PRIMARY KEY,
                question_number INT NOT NULL,
                marked_answer VARCHAR(255)
            )`;
        
        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Error creating user_quiz_data table:', error);
                res.status(500).send('An error occurred while creating user_quiz_data table');
            } else {
                // Display the final score page
                res.sendFile(path.join(__dirname, 'public', 'html', 'final.html'));
            }
        });
    } else {
        res.status(401).json({ error: 'User session not found' });
    }
});
app.post('/storeQuizData', (req, res) => {
    const sess = req.session;
    if (sess.userDetails && sess.userDetails.username) {
        const username = sess.userDetails.username;
        const { questionNumber, markedAnswer } = req.body;
        console.log('Received data:', req.body);

        const query = `
            INSERT INTO user_quiz_data (username, question_number, marked_answer)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE marked_answer = ?`;
        
        connection.query(query, [username, questionNumber, markedAnswer, markedAnswer], (error, results) => {
            if (error) {
                console.error('Error storing user quiz data:', error);
                res.status(500).json({ error: 'An error occurred while storing user quiz data' });
            } else {
                console.log('User quiz data stored successfully');
                res.status(200).json({ message: 'User quiz data stored successfully' });
            }
        });
    } else {
        res.status(401).json({ error: 'User session not found' });
    }
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
