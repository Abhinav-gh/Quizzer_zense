let user_name= sessionStorage.getItem("name");
console.log(user_name);
let questions = [
    {
        id:1,
        question : "What is the capital of India?",
        answer: "New Delhi",
        options : [
            "Bhopal",
            "Amritsar",
            "New Delhi",
            "Mumbai"
        ]
    },
    {
        id:2,
        question : " What is the full form of RAM?",
        answer :"Random Access Memory",
        options : [
            "Random Access Memory",
            "Randomely Access Memory",
            "Run Aceapt Memory",
            "None of these"
        ],
    },
    {
        id:3,
        question: "Who wrote the play 'Hamlet'?",
        answer: "William Shakespeare",
        options: [
            "William Wordsworth",
            "John Milton",
            "William Shakespeare",
            "Charles Dickens",
        ],
    },
];
let already_answered=[0,0,0];
let marked_answer=["","",""];

let question_count=-1;
let points=0;

document.addEventListener("DOMContentLoaded", () => {
    show(question_count, check_already_answered());
  });    


function show(count,already_marked=0) {
    console.log("Marked answer    " , marked_answer);
    if (count >= 0 && count < questions.length) {

        let question = document.getElementById("questions");
        let [first, second, third, fourth] = questions[count].options; 
        question.innerHTML = `<div class="question"><h2>Q${count + 1}.${questions[count].question}</h2></div>

        <ul class="option_group">
        <li class="option">${first} </li>
        <li class="option">${second} </li>
        <li class="option">${third} </li>
        <li class="option">${fourth} </li>
        </ul>`;
        question_count = count;
        toggleActive(already_marked);
    }
}
function toggleActive(already_marked=0){
    console.log("already marked ", already_marked);
    let option= document.querySelectorAll("li.option");
    console.log("option: ", option );
    if (already_marked == 1) {
        for(let i=0;i<option.length;i++){
            let optionText = option[i].textContent.trim();
            let markedAnswer = marked_answer[question_count].trim();
            if (optionText === markedAnswer) {
                console.log("Inside option active");
                option[i].classList.add("active");
            }
        }
    }
    for(let i=0;i<option.length;i++)
    {
        option[i].onclick = function(){
            for(let i=0;i<option.length;i++){
                if(option[i].classList.contains("active")){
                    option[i].classList.remove("active");
                }
            }
            option[i].classList.add("active");
        };
    }
}
function store_answer() {
    let user_answer = document.querySelector("li.option.active");
    console.log("user_answer:", user_answer);

    user_answer = user_answer ? user_answer.textContent.trim() : marked_answer[question_count];
    console.log("user_answer trimmed:", user_answer);

    
        if (already_answered[question_count] === 0)
            already_answered[question_count] = 1;
        console.log("Here");
        marked_answer[question_count] = user_answer;
        console.log("marked_answer after update:", marked_answer);
    
}


function check_already_answered(){
    if(already_answered[question_count]==1)
        return 1;
    return 0;
}
function next(){
    if(question_count==questions.length-1){
        calculate_score();
        location.href="final.html";
    }
    question_count++;
    store_answer();
    show(question_count,check_already_answered());
    
}
function previous(){
    if(question_count==0)
        return;
    question_count--;
    store_answer();
    show(question_count,check_already_answered());
    
}
function calculate_score(){
    points=0;
    for(let i=0;i<questions.length;i++)
        if(marked_answer[i]== questions[i].answer)
            points+=10;
    sessionStorage.setItem("points",points);
    
}
