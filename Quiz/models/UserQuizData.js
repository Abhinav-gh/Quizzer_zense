const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserQuizDataSchema = new Schema({
    username : {type: String, required: true, unique: true},
    question_number: {type: Number, required: true, unique: true},
    marked_answer: {type: String, required: true},
}, {timestamps : true});

const UserQuizData = mongoose.model('UserQuizData', UserQuizDataSchema);

module.exports = UserQuizData;

