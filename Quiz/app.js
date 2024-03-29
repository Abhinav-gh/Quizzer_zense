const express = require("express");

const path = require('path');
const { connection } = require("./database.js");
const middleware = require('./middleware/authorization.js');

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
app.get('/quiz.html', middleware.requireAuth, (req, res) => {
    const sess = req.session;
    if (sess.userDetails && sess.userDetails.username) {
        const username = sess.userDetails.username;
        
        // Check if the user's quiz data exists in the database
        const query = 'SELECT * FROM user_quiz_data WHERE username = ?';
        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Error checking user quiz data:', error);
                res.status(500).json({ error: 'An error occurred while checking user quiz data' });
            } else {
                // If quiz data exists, redirect to the final page
                if (results.length > 0) {
                    res.redirect('/final.html');
                } else {
                    // If quiz data doesn't exist, render the quiz page
                    res.sendFile(path.join(__dirname, 'public', 'html', 'quiz.html'));
                }
            }
        });
    } else {
        res.status(401).json({ error: 'User session not found' });
    }
});

app.get('/analysis.html', middleware.requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'analysis.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});
app.get('/home.html', middleware.requireAuth, (req, res) => {
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



app.get('/final.html', middleware.requireAuth,(req, res) => {
    // Create the user's quiz data table (if not already created)
    const sess = req.session;
    if (sess.userDetails && sess.userDetails.username) {
        res.sendFile(path.join(__dirname, 'public', 'html', 'final.html'));
    } else {
        res.status(401).json({ error: 'User session not found' });
    }
});
app.post('/storeQuizData', express.json(), (req, res) => {
    console.log('Received data: here is ', req.body);
    const sess = req.session;
    if (sess.userDetails && sess.userDetails.username) {
        const username = sess.userDetails.username;
        const questionNumber = req.body.userAnswerData.questionNumber;
        const markedAnswer = req.body.userAnswerData.markedAnswer;
        console.log('The request body is', req.body);
        console.log('Received data:', questionNumber, markedAnswer);

        const query = `
            INSERT INTO user_quiz_data (username, question_number, marked_answer)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE marked_answer = ?;
        `

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
app.get('/getUserAnswers', (req, res) => {
    const sess = req.session;
    if (sess.userDetails && sess.userDetails.username) {
        const username = sess.userDetails.username;
        const query = 'SELECT * FROM user_quiz_data WHERE username = ?';

        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Error fetching user answers:', error);
                res.status(500).json({ error: 'An error occurred while fetching user answers' });
            } else {
                const userAnswers = JSON.parse(JSON.stringify(results));
                res.status(200).json({ userAnswers });
            }
        });
    } else {
        res.status(401).json({ error: 'User session not found' });
    }
});

app.get('/getUserQuizData', (req, res) => {
    const sess = req.session;
    if (sess.userDetails && sess.userDetails.username) {
        const username = sess.userDetails.username;
        
        const query = `
            SELECT question_number, marked_answer
            FROM user_quiz_data
            WHERE username = ?`;
        
        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Error fetching user quiz data:', error);
                res.status(500).json({ error: 'An error occurred while fetching user quiz data' });
            } else {
                const userQuizData = results.map(row => ({
                    questionNumber: row.question_number,
                    markedAnswer: row.marked_answer
                }));
                res.status(200).json(userQuizData);
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
