document.addEventListener('DOMContentLoaded', () => {
    fetch('/getQuestions') // Change the category as needed
        .then((response) => {
        console.log('Response:', response);
        return response.json();
        })
        .then((questionsFromServer) => {
            console.log(questionsFromServer);
            
            // Assign the fetched questions to the 'questions' variable
            questions = questionsFromServer.map((dbQuestion, index) => {
                return {
                    id: index + 1,
                    question: dbQuestion.question,
                    answer: dbQuestion.solutions,
                    options: [
                        dbQuestion.option1,
                        dbQuestion.option2,
                        dbQuestion.option3,
                        dbQuestion.option4,
                    ],
                };
            }); 
            show_analysis();
            
           
        })
        .catch((error) => {
            console.error('Error fetching questions:', error);
        });
});
let count=0;
function show_analysis(){
    if (count >= 0 && count < questions.length) {

    let question = document.getElementById("questions");
    let [first, second, third, fourth] = questions[count].options;
        question.innerHTML = `<div class="question"><h2>Q${
            count + 1
        }.${questions[count].question}</h2></div>

        <ul class="option_group">
        <li class="option">${first} </li>
        <li class="option">${second} </li>
        <li class="option">${third} </li>
        <li class="option">${fourth} </li>
        </ul>`;
    }
}
function next(){
    count++;
    show_analysis();
}
function previous(){
    count--;
    show_analysis();
}
function toggle_Active_analysis(){
     
}