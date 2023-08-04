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
let marked_answer=[];

let question_count=0;
let points=0;

document.addEventListener("DOMContentLoaded", show(question_count));
    


function show(count) {
    let question = document.getElementById("questions");
    let [first, second, third, fourth] = questions[count].options; 
    question.innerHTML = `<div class="question"><h2>Q${count + 1}.${questions[count].question}</h2></div>

      <ul class="option_group">
      <li class="option">${first} </li>
      <li class="option">${second} </li>
      <li class="option">${third} </li>
      <li class="option">${fourth} </li>
      </ul>`;
    toggleActive();
  }
function toggleActive(){
    let option= document.querySelectorAll( "li.option");
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
function next(){
    let user_answer=document.querySelector("li.option.active");
    user_answer = user_answer.textContent.trim();
    marked_answer.push(user_answer);
    
    if(user_answer == questions[question_count].answer){
        console.log("Here");
        points=points+10;
        sessionStorage.setItem("points",points);
    }
    if(question_count==questions.length-1){
        location.href="final.html";
    }
    question_count++;
    console.log(points);
    console.log(question_count);
    show(question_count);
}
