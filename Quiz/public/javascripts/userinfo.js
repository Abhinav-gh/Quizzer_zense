let user_name= sessionStorage.getItem("name");
let user_points= sessionStorage.getItem("points");
console.log(user_name);
console.log(user_points);
document.querySelector("span.name").innerHTML=user_name;
document.querySelector("span.points").innerHTML=user_points;

function show_analysis_button(){
    const startButton = document.getElementById("analysis-button");
    startButton.classList.remove("hide-animation");
    startButton.classList.add("show-animation");
    startButton.style.pointerEvents = "auto";
}
setTimeout(show_analysis_button,3000);
// document.addEventListener("DOMContentLoaded", setTimeout(show_analysis_button, 3000));
