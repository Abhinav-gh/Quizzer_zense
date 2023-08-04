

function hideButton(event) {

    event.preventDefault();
    const nameInput=document.getElementById("name");
    const nameInputValue=document.getElementById("name").value;
    sessionStorage.setItem("name",nameInputValue);
    
    const submittion_input=document.getElementById("submit_button");

    if(nameInputValue!=""){
    
        submittion_input.classList.add("hide-animation");
        nameInput.disabled=true;
        submittion_input.style.pointerEvents="none";
        setTimeout(function() {
            submittion_input.style.display = "none";
            showQuizRules();

        }, 300); // Duration of the animation in milliseconds
    }
    
}
function showQuizRules() {
    const quizRulesSection = document.getElementById("quiz-rules");
    quizRulesSection.style.display = "block"; // Show the quiz rules section
    const quizRules = quizRulesSection.querySelectorAll(".custom-paragraph");
    for (let i = 0; i < quizRules.length; i++) {
      quizRules[i].classList.add("fade-in-animation");
    }
    setTimeout(show_start_button, 3000);
  }
function show_start_button() {
    const startButton= document.getElementById("start-button");
    startButton.classList.remove("hide-animation");
    startButton.classList.add("show-animation");
    startButton.style.pointerEvents = "auto";
}
