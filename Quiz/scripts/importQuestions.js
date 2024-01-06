const mongoose = require('mongoose');
const Question = require('../models/questions');
const fs = require('fs');
require('dotenv').config();
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Read questions from the JSON file
const questionsDataPath = path.resolve(__dirname, '../data/questions.json');
const questionsData = JSON.parse(fs.readFileSync(questionsDataPath, 'utf8'));

// Clear existing questions and insert new ones
Question.deleteMany({})
  .then(() => Question.insertMany(questionsData))
  .then(() => {
    console.log('Questions inserted successfully.');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error inserting questions:', error);
    mongoose.connection.close();
  });
