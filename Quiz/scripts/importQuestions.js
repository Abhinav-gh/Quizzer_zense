const mongoose = require('mongoose');
const Question = require('./models/questions');
const fs = require('fs');
require('dotenv').config();


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Read questions from the JSON file
const questionsData = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

// Insert questions into MongoDB
Question.insertMany(questionsData)
  .then(() => {
    console.log('Questions inserted successfully.');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error inserting questions:', error);
    mongoose.connection.close();
  });
