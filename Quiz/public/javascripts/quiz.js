

let user_name = sessionStorage.getItem("name");




let already_answered = [0, 0, 0];
let marked_answer = ["", "", ""];
let unanswerable = 0;
let question_count = 0;
let points = 0;
let timer_count = 500;
let questions = [];

let analysis_page = 0;


document.addEventListener('DOMContentLoaded', () => {
    fetch('/getQuestions') // Change the category as needed
        .then((response) => {
            console.log('Response:', response);
            return response.json();
        })
        .then((questionsFromServer) => {
            console.log(questionsFromServer);

            // Assign the fetched questions to the 'questions' variable
            // questions = questionsFromServer.map((dbQuestion, index) => {
            //     return {
            //         id: index + 1,
            //         question: dbQuestion.question,
            //         answer: dbQuestion.solutions,
            //         options: [
            //             dbQuestion.option1,
            //             dbQuestion.option2,
            //             dbQuestion.option3,
            //             dbQuestion.option4,
            //         ],
            //     };
            // });

            // Now using mongodb
            if (questionsFromServer.length > 0) {
                questions = questionsFromServer.map((dbQuestion, index) => {
                    return {
                        id: index + 1,
                        question: dbQuestion.question,
                        answer: dbQuestion.answer,
                        options: dbQuestion.options, // Use the existing options array
                    };
                });
            }
            
            
            if (analysis_page) {
                console.log("Now in Analysis page");
                show_analysis();
                
            }
            else {
                // console.log("This is where we are getting the questions ", questions);
                show(question_count, check_already_answered());
                timer(timer_count);
            }

        })
        .catch((error) => {
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


if (user_name) {
    let namespan = document.querySelector(".name");
    if (namespan) {
        namespan.textContent = user_name;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    show(question_count, check_already_answered());
    timer(timer_count);
    console.log("Questions ", questions);
});


function show(count, already_marked = 0) {
    // console.log("Marked answer    ", marked_answer);
    console.log("We are inside the show");
    console.log("Count is ", count);
    console.log("questions leght is ", questions.length);
    if (count >= 0 && count < questions.length) {
        console.log("We are inside the if in show");
        let question = document.getElementById("questions");
        let [first, second, third, fourth] = questions[count].options;
        console.log("The first option is ", first);
        question.innerHTML = `<div class="question"><h2>Q${count + 1
           }.${questions[count].question}</h2></div>
        <ul class="option_group">
        <li class="option">${first} </li>
        <li class="option">${second} </li>
        <li class="option">${third} </li>
        <li class="option">${fourth} </li>
        </ul>`;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, question]);

        question_count = count;
        toggleActive(already_marked);
    }
}

function toggleActive(already_marked = 0) {
    if (analysis_page)
        return;
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
    if (analysis_page)
        return;
    if (unanswerable) {
        // console.log("here");
        return;
    }
    let user_answer = document.querySelector("li.option.active");
    console.log("user_answer:", user_answer);

    user_answer = user_answer ? user_answer.textContent.trim() : marked_answer[question_count];
    console.log("user_answer trimmed:", user_answer);


    if (already_answered[question_count] === 0)
        already_answered[question_count] = 1;
    // console.log("Here");
    marked_answer[question_count] = user_answer;
    console.log("marked_answer after update:", marked_answer);
    const userAnswerData = {
        questionNumber: question_count, // Replace with the actual question number
        markedAnswer: marked_answer[question_count] // Replace with the actual marked answer
    };
    console.log('userAnswerData:', userAnswerData);

    // Send the user answer data to the server
    fetch('/storeQuizData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify({
        //     questionNumber: question_count,
        //     markedAnswer: marked_answer[question_count]
        // })
        body: JSON.stringify({
            userAnswerData
        })
    })


        .then(response => {
            // Check if the response status indicates success (2xx range)
            if (response=>response.json()) {
                console.log('User answer data successfully stored.');
            } else {
                console.error('Error storing user answer data. Status:', response.status);
            }
        })

        .catch(error => {
            console.log("Here is an error");
            console.error('Error storing user answer data:', error);
        });
    console.log("unanswerable:", unanswerable);


}

function timer_expired() {
    finish_test();
}
function finish_test() {
    calculate_score();
    analysis_page = 1;
    
    // Update the session to indicate that the user has completed the quiz
    fetch('/updateQuizCompletionFlag', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Redirect the user to the final page
        window.location.replace("final.html");
        console.log("Page reoladed");
    })
    .catch(error => {
        console.error('Error updating quiz completion flag:', error);
    });
}

function check_already_answered() {
    if (already_answered[question_count] == 1)
        return 1;
    return 0;
}
function next() {
    if (analysis_page == 1)
        return;
    if (question_count == questions.length - 1) {
        return;
    }
    if (unanswerable) {
        make_unanswerable();
        question_count++;
        show(question_count, check_already_answered(), unanswerable);
        return;
    }
    else {
        store_answer();
        question_count++;
        show(question_count, check_already_answered(), unanswerable);
    }

}
function previous() {
    if (analysis_page == 1)
        return;
    if (question_count == 0)
        return;
    if (unanswerable) {
        make_unanswerable();
        question_count--;
        show(question_count, check_already_answered());
        return;
    } else {
        store_answer();
        question_count--;
        show(question_count, check_already_answered());
    }

}
function finishQuiz() {
    if (question_count === questions.length - 1) {
        // Show a confirmation dialog before finishing the quiz
        const confirmFinish = confirm("Are you sure you want to finish the quiz?");
        if (confirmFinish) {
            store_answer();
            calculate_score();
            alert("Quiz Finished Successfully!");
            
            analysis_page = true;
            // Redirect to the final page
            window.location.href = "final.html";
        }
    } else {
        // If the quiz is not finished, navigate to the next question
        alert("Please go through all the questions and finish the quiz at last question");
    }
}

function calculate_score() {
    if (analysis_page)
        return;

    fetch('/getUserAnswers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const userAnswers = data.userAnswers;
        let points = 0;

        for (let i = 0; i < userAnswers.length; i++) {
            const userAnswer = userAnswers[i];
            const questionNumber = userAnswer.question_number;
            const markedAnswer = userAnswer.marked_answer;

            const correctAnswer = questions[questionNumber].answer; // Assuming questions array contains your question data

            if (markedAnswer === correctAnswer) {
                points += 10;
            }
        }

        sessionStorage.setItem("points", points);
    })
    .catch(error => {
        console.error('Error fetching user answers:', error);
    });
}


function clear_options() {
    marked_answer[question_count] = "";
    already_answered[question_count] = 0;
    let option = document.querySelectorAll("li.option");
    for (let i = 0; i < option.length; i++) {
        option[i].classList.remove("active");
    }
    show(question_count, check_already_answered());
}
function make_unanswerable() {
    let option = document.querySelectorAll("li.option");
    for (let i = 0; i < option.length; i++) {
        option[i].onclick = null;
        option[i].classList.add("disabled");
    }
}


function timer(duration) {
    if (analysis_page)
        return;
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
            unanswerable = 1;
            make_unanswerable();
            setTimeout(timer_expired, 5000);
        }
    }, 1000);
}


function toggle_Active_analysis() {
    let option = marked_answer[question_count];
    console.log("option: ", option);
    //Remove alerady selected options
    for (let i = 0; i < option.length; i++) {
        option[i].classList.remove("active"); // Remove the "active" class for all options
    }
    //Add active class to the marked option stored in option variable
    for (let i = 0; i < option.length; i++) {
        let optionText = option[i].textContent.trim();
        if (optionText === option) {
            option[i].classList.add("active");
        }
    }
}