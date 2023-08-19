

let user_name= sessionStorage.getItem("name");


  
  
let already_answered=[0,0,0];
let marked_answer=["","",""];
let unanswerable=0;
let question_count=0;
let points=0;
let timer_count=500;
let questions=[];

document.addEventListener('DOMContentLoaded', () => {
    fetch('/getQuestions') // Change the category as needed
        .then((response) => response.json())
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
            console.log(questions);
            show(question_count, check_already_answered());
            timer(timer_count);
           
        })
        .catch((error) => {
            console.error('Error fetching questions:', error);
        });
});


if(user_name){
    let namespan=document.querySelector(".name");
    if(namespan){
        namespan.textContent=user_name;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    show(question_count, check_already_answered());
    timer(timer_count);
    console.log("Questions ", questions);
  });    


  function show(count, already_marked = 0) {
    console.log("Marked answer    ", marked_answer);
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
        question_count = count;
        
        toggleActive(already_marked);
    }
}

function toggleActive(already_marked = 0) {
    console.log("already marked ", already_marked);
    let option = document.querySelectorAll("li.option");
    console.log("option: ", option);

    for (let i = 0; i < option.length; i++) {
        option[i].classList.remove("active"); // Remove the "active" class for all options
    }

    if (already_marked == 1) {
        let markedAnswer = marked_answer[question_count].trim();
        for (let i = 0; i < option.length; i++) {
            let optionText = option[i].textContent.trim();
            if (optionText === markedAnswer) {
                
                option[i].classList.add("active");
            }
        }
    }

    for (let i = 0; i < option.length; i++) {
        option[i].onclick = function () {
            for (let i = 0; i < option.length; i++) {
                if (option[i].classList.contains("active")) {
                    option[i].classList.remove("active");
                }
            }
            option[i].classList.add("active");
            marked_answer[question_count] = option[i].textContent.trim();
            already_answered[question_count] = 1;
        };
    }
}
function store_answer() {
    console.log("unanswerable:", unanswerable);
    if(unanswerable){
        console.log("here");
        return;
    }
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

function timer_expired(){
    finish_test();
}
function finish_test(){
    calculate_score();
    location.href="final.html";
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
    if(unanswerable){
        make_unanswerable();
        question_count++;
        show(question_count,check_already_answered(),unanswerable);
        return;
    }
    else{
        store_answer();
        question_count++;
        show(question_count,check_already_answered(),unanswerable);
    }
    
}
function previous(){
    if(question_count==0)
        return;
    if(unanswerable){
        make_unanswerable();
        question_count--;
        show(question_count,check_already_answered());
        return;
    } else{
        store_answer();
        question_count--;
        show(question_count,check_already_answered());
    }
    
}
function calculate_score(){
    points=0;
    for(let i=0;i<questions.length;i++)
        if(marked_answer[i]== questions[i].answer)
            points+=10;
    sessionStorage.setItem("points",points);
    
}
function clear_options(){
    marked_answer[question_count]="";
    already_answered[question_count]=0;
    let option = document.querySelectorAll("li.option");
    for (let i = 0; i < option.length; i++) {
        option[i].classList.remove("active"); 
    }
    show(question_count,check_already_answered());
}
function make_unanswerable() {
    let option = document.querySelectorAll("li.option");
    for (let i = 0; i < option.length; i++) {
        option[i].onclick = null;
        option[i].classList.add("disabled");
    }
}


function timer(duration){
    let now = new Date().getTime();
        let deadline = now + duration * 10e2;

        // To call defined function every second
        let x = setInterval(function () {
            // Getting current time in required format
            now = new Date().getTime();  // Update the current time

            // Calculating the difference
            let t = deadline - now;

            // Getting value of days, hours, minutes, seconds
            let days = Math.floor(t / (1000 * 60 * 60 * 24));
            let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((t % (1000 * 60)) / 1000);

            // Output the remaining time
            let countdownDisplay = document.getElementById("counter");
            if (t >= 0) {
                countdownDisplay.innerHTML =
                    `${days}d ${hours}h ${minutes}m ${seconds}s`;
            } else {
                clearInterval(x);
                countdownDisplay.innerHTML = "EXPIRED";
                countdownDisplay.classList.add("countdown-expired");
                unanswerable=1;
                make_unanswerable();
                setTimeout(timer_expired, 5000);
            }
        }, 1000);
}

