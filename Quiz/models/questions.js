const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question_number: {type: Number, required: true, unique: true},
    question: {type: String, required: true},
    answer: {type: String, required: true},
    options: {type: Array, required: true}
}, {timestamp : true});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

