$(document).ready(function() {
    // Attach the submit event handler to the form
    $("#form").submit(function(event) {
      // Get the values of the username and password fields
      var username = $("input[name='un']").val();
      var password = $("input[name='pw']").val();
  
      // Check if the fields are not empty
      if (username.trim() === "") {
        alert("Kindly fill out username field. We can't know who you are without it.");
        event.preventDefault(); // Prevent the form from submitting
      }
      if (password.trim() === ""){
        alert("Kindly fill out the password field also. You can't sign in without it.");
        event.preventDefault();
      }
    });
  
    // Toggle the login form
    $("#toggle-login").click(function() {
      $("#login").toggle();
    });
  });
  