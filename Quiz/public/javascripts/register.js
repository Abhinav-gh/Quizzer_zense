$(document).ready(function() {
    // Attach the submit event handler to the form
    $("#form").submit(function(event) {
        var password = $("input[name='pw']").val();
        var confirm_password = $("input[name='cpw']").val();
        if(password.trim()===""){
            alert("Kindly change your password so that it contains at least 8 character.");
            event.preventDefault();
        }
        //Check if there is space in password
        if(password.indexOf(' ') >= 0){
            alert("Kindly change your password so that it does not contain any space.");
            event.preventDefault();
        }
        if(password!=confirm_password){
            alert("Passwords do not match");
            event.preventDefault();
        }
        
    });
});

$("#toggle-register").click(function() {
    $("#Register").toggle();
  });
  