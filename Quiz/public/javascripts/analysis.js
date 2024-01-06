let markedAnswers = {};
let questions = []; 
let points = 0;

document.addEventListener('DOMContentLoaded', () => {
    
    fetch('/getQuestions') // Change the category as needed
        .then((response) => {
        console.log('Response:', response);
        return response.json();
        })
        .then((questionsFromServer) => {
            console.log('Questions from server:',questionsFromServer);
            
            // Assign the fetched questions to the 'questions' variable
            questions = questionsFromServer.map((dbQuestion, index) => {
                    return {
                        id: index + 1,
                        question: dbQuestion.question,
                        answer: dbQuestion.answer,
                        options: dbQuestion.options, // Use the existing options array
                    };
                }); 
            for (let i = 1; i <= questions.length; i++) {
                markedAnswers[i] = [];
            }
            fetch('/getUserQuizData')
            .then(response => response.json())
            .then(userQuizData => {
                if (Array.isArray(userQuizData)) {
                    userQuizData.forEach(data => {
                        console.log(data.questionNumber, data.markedAnswer, "These are here");
                        markedAnswers[data.questionNumber]=(data.markedAnswer );
                        console.log(data);
                    });
                    
                    console.log('Marked answers:', markedAnswers);

                    // Call the show_analysis function here or in any other relevant place
                    show_analysis();
                } else {
                    console.error('Invalid user quiz data format:', userQuizData);
                }
            })
            .catch(error => {
                console.error('Error fetching user quiz data:', error);
            });
    })
    .catch(error => {
        console.error('Error fetching questions:', error);
    });
    fetch('/getUserName')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(userData => {
            console.log('User data:', userData);
            const firstName = userData.firstname;
            const lastName = userData.lastname;

        const welcomeMessage = document.querySelector('.quiz_user h4 span.name');
        welcomeMessage.textContent = `${firstName} ${lastName}`;

        // Add a class to the welcome message to style it
        welcomeMessage.classList.add('user-name');
        })
        .catch(error => {
            console.error('Error fetching username:', error);
        });
});
let count=0;
function show_attempt_status(attempted, correct) {
    const attemptStatusElement = document.getElementById('attempt-status');
    if (attempted) {
        attemptStatusElement.innerHTML = `
        <div class="attempt-status-box ${correct ? 'attempted' : 'not-attempted'}">
            ${correct ? 'Attempted & Correct' : 'Attempted & Incorrect'}
        </div>`;
    } else {
        attemptStatusElement.innerHTML = `
        <div class="attempt-status-box not-attempted">
            Not Attempted
        </div>`;
    }
}
function show_analysis(isprevious){
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
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, question]);
    }

    const attempted = markedAnswers[count].length > 0;
    const correct = questions[count].answer === markedAnswers[count];
    show_attempt_status(attempted, correct);
    toggle_Active_analysis(isprevious);

}

function next(){
    let isprevious=false;
    if(count<questions.length-1)
        count++;
    else if(count==questions.length-1){
        points=0;
        count=0;
    }
    show_analysis(isprevious);

}
function previous(){
    let isprevious=true;
    if(count>0)
        count--;
    else if(count==0){
        count=questions.length-1;
        points=0;
    }
        show_analysis(isprevious);
}
function toggle_Active_analysis(isprevious=false){
     //Code for marking to active option comes here.
     let option = document.querySelectorAll("li.option");
    console.log("option: ", option);

    for (let i = 0; i < option.length; i++) {
        option[i].classList.remove("active"); // Remove the "active" class for all options
    }
    let marked_option=markedAnswers[count];
    console.log(marked_option);
    for (let i = 0; i < option.length; i++) {
        let optionText = option[i].textContent.trim();
        if (optionText === marked_option) {

            option[i].classList.add("active");
        }
    }
    let solution=questions[count].answer;
    console.log(solution);
    for (let i = 0; i < option.length; i++) {
        let optionText = option[i].textContent.trim();
        if (optionText === solution) {
            if(option[i].classList.contains("active") && !isprevious){
                option[i].classList.remove("active");
                option[i].classList.add("correct");
                points+=10;
            }
            
            option[i].classList.add("correct");
            updatePointsDisplay();

        }
    }

}
function goToHomePage() {
    window.location.href = "home.html";
}

// Update the points display function
function updatePointsDisplay() {
    const pointsElement = document.getElementById('points');
    pointsElement.textContent = points;
}