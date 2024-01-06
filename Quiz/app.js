const express = require("express");
const path = require('path');
const { connection } = require("./database.js");
const Question = require('./models/questions');
const User = require('./models/users');
const UserQuizData = require('./models/UserQuizData');
const middleware = require('./middleware/authorization.js');

// Import the script to import questions
require('./scripts/importQuestions');


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

    // connection.query(query, (error, results) => {
    //     if (error) {
    //         console.error('Error fetching questions:', error);
    //         res.status(500).json({ error: 'An error occurred while fetching questions from the server' });
    //     } else {
    //         const data = JSON.parse(JSON.stringify(results));
    //         console.log(data);
    //         res.status(200).json(data);
    //     }
    // });
    try {
        Question.find()
            .then(questions => {
                const data = JSON.parse(JSON.stringify(questions));
                res.status(200).json(data);
            })
            .catch(err => {
                console.log("An error occurred while fetching questions from the db:", err);
                res.status(500).json({ error: 'An error occurred while fetching questions from the server' });
            });
    } catch (err) {
        console.log("We could not complete /getQuestions");
    }
});
app.get('/getUserName', async(req, res) => {
    const sess = req.session;
    // if (sess.userDetails) {
    // const username = sess.userDetails.username;
    // const query = `SELECT firstname, lastname FROM users WHERE username = ?`;

    // connection.query(query, [username], (error, results) => {
    //     if (error) {
    //         console.error('Error fetching user data:', error);
    //         res.status(500).json({ error: 'An error occurred while fetching user data from the server' });
    //     } else {
    //         if (results.length > 0) {
    //             const userData = results[0];
    //             res.status(200).json(userData);
    //         } else {
    //             res.status(404).json({ error: 'User data not found' });
    //         }
    //     }
    // });

    // New mongodb code
    try {
        if (sess.userDetails) {
            const username = sess.userDetails.username;

            // Using MongoDB to find the user by username
            const user = await User.findOne({ username: username }, 'firstname lastname').exec();

            if (user) {
                // Extracting the required fields
                const userData = {
                    firstname: user.firstname,
                    lastname: user.lastname
                };

                res.status(200).json(userData);
            } else {
                res.status(404).json({ error: 'User data not found' });
            }
        } else {
            res.status(401).json({ error: 'User session not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'An error occurred while fetching user data from the server' });
    }
});



app.get('/final.html', middleware.requireAuth, (req, res) => {
    // Create the user's quiz data table (if not already created)
    const sess = req.session;
    if (sess.userDetails && sess.userDetails.username) {
        res.sendFile(path.join(__dirname, 'public', 'html', 'final.html'));
    } else {
        res.status(401).json({ error: 'User session not found' });
    }
});
app.post('/storeQuizData', express.json(), async (req, res) => {
    // console.log('Received data: here is ', req.body);
    // const sess = req.session;
    // if (sess.userDetails && sess.userDetails.username) {
    //     const username = sess.userDetails.username;
    //     const questionNumber = req.body.userAnswerData.questionNumber;
    //     const markedAnswer = req.body.userAnswerData.markedAnswer;
    //     console.log('The request body is', req.body);
    //     console.log('Received data:', questionNumber, markedAnswer);

    //     const query =
    //         `
    //         INSERT INTO user_quiz_data (username, question_number, marked_answer)
    //         VALUES (?, ?, ?)
    //         ON DUPLICATE KEY UPDATE marked_answer = ?;
    //     `

    //     connection.query(query, [username, questionNumber, markedAnswer, markedAnswer], (error, results) => {
    //         if (error) {
    //             console.error('Error storing user quiz data:', error);
    //             res.status(500).json({ error: 'An error occurred while storing user quiz data' });
    //         } else {
    //             console.log('User quiz data stored successfully');
    //             res.status(200).json({ message: 'User quiz data stored successfully' });
    //         }
    //     });
    // } else {
    //     res.status(401).json({ error: 'User session not found' });
    // }

    // New mongodb code
    try {
        const sess = req.session;
        if (sess.userDetails && sess.userDetails.username) {
            const username = sess.userDetails.username;
            const questionNumber = req.body.userAnswerData.questionNumber;
            const markedAnswer = req.body.userAnswerData.markedAnswer;

            // Using MongoDB to store user quiz data
            const filter = { username: username, question_number: questionNumber };
            const update = { markedAnswer: markedAnswer };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };

            // Insert or update user quiz data
            await UserQuizData.findOneAndUpdate(filter, update, options).exec();

            console.log('User quiz data stored successfully');

            // Optionally, fetch user answers if needed
            const userAnswers = await UserQuizData.find({ username: username }).exec();
            const transformedUserAnswers = userAnswers.map(data => ({
                questionNumber: data.question_number,
                markedAnswer: data.marked_answer
            }));

            console.log('Transformed user answers:', transformedUserAnswers);

            res.status(200).json({ message: 'User quiz data stored successfully' });
        } else {
            res.status(401).json({ error: 'User session not found' });
        }
    } catch (error) {
        console.error('Error storing user quiz data:', error);
        res.status(500).json({ error: 'An error occurred while storing user quiz data' });
    }
    
});
app.get('/getUserAnswers', async(req, res) => {
    /* const sess = req.session;
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
    */

    // New mongodb code
    try {
        const sess = req.session;
        if (sess.userDetails && sess.userDetails.username) {
            const username = sess.userDetails.username;

            // Using MongoDB to fetch user answers
            const userAnswers = await UserQuizData.find({ username: username }).exec();

            res.status(200).json({ userAnswers });
        } else {
            res.status(401).json({ error: 'User session not found' });
        }
    } catch (error) {
        console.error('Error fetching user answers:', error);
        res.status(500).json({ error: 'An error occurred while fetching user answers' });
    }
});

app.get('/getUserQuizData', async(req, res) => {
    /* const sess = req.session;
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
    */

    // New mongodb code
    try {
        const sess = req.session;
        if (sess.userDetails && sess.userDetails.username) {
            const username = sess.userDetails.username;

            // Using MongoDB to fetch user answers
            const userAnswers = await UserQuizData.find({ username: username }).exec();
            console.log('User answers ',userAnswers);
            const transformedUserAnswers = userAnswers.map(data => ({
                questionNumber: data.question_number,
                markedAnswer: data.marked_answer
            }));

            res.status(200).json(transformedUserAnswers);
        } else {
            res.status(401).json({ error: 'User session not found' });
        }
    } catch (error) {
        console.error('Error fetching user answers:', error);
        res.status(500).json({ error: 'An error occurred while fetching user answers' });
    }
});


// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404).send('Custom handling 404 - This page was not found');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Custom handling 500 - Server Error');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
