//>>>>>>>>>>>>>>LOGIC FOR THE REGISTRATION FORM
// Select elements and create variables for the registration form
const regForm = document.querySelector("#registration");
const usernameField = regForm.elements["username"];
const emailField = regForm.elements["email"];
const passwordField = regForm.elements["password"];
const passwordCheckField = regForm.elements["passwordCheck"];
const errorDisplay = document.querySelector("#errorDisplay");
const registerBtn = document.querySelector("#regBtn");
const checkboxTerms = document.querySelector(".checkboxTerms");
const existingUserData = JSON.parse(localStorage.getItem("userData")) || [];


// Add event listener to validate and submit the form
regForm.addEventListener("submit", validateRegForm);
// declare function to display errors
function displayErrorMessage(messages) {
  // Modify the inner HTML to display a list of messages
  let errorMessageHTML = '<ul>';
  messages.forEach(message => {
    errorMessageHTML += `<li>${message}</li>`;
  });
  errorMessageHTML += '</ul>';

  errorDisplay.innerHTML = errorMessageHTML;
  errorDisplay.style.display = "block";
}

function validateRegForm(evt) {
  console.log("pwd: ", passwordField.value, "chckpwd: ", passwordCheckField.value);
  const validateName = validateUsername();
  if (validateName === false) {
    evt.preventDefault();
    return false;
  }

  const validateEmailAddress = validateEmail();
  if (validateEmailAddress === false) {
    evt.preventDefault();
    return false;
  }

  const validatePass = validatePassword();
  if(validatePass === false){
    evt.preventDefault();
    return false;
  }

  const validatePassCheck = validatePasswordCheck();
  if (validatePassCheck === false) {
    evt.preventDefault();
    return false;
  }

  const isCheckboxChecked = validateCheckbox();
  if (!isCheckboxChecked) {
    evt.preventDefault();
    return false;
  }
 
  if (validateName && validateEmailAddress && validatePass && validatePassCheck && isCheckboxChecked) {
    // if all validations pass, store the user data in localStorage
    // check if the user provided already exists
    if(storeUserData()){
        // clear form fields
        clearFormFields();
    }

    //prevent form submission
    evt.preventDefault();
  } else {
    // Prevent the form submission if validation fails
    evt.preventDefault();
    return false;
  }
}

function storeUserData() {
  // Retrieve existing user data from localStorage
  let usenarmeTaken = false;
  let emailTaken = false;
  
  console.log(existingUserData);
  // Create a new user object
  const newUser = {
    username: usernameField.value.toLowerCase(),
    email: emailField.value.toLowerCase(),
    password: passwordField.value,
  };

  // Add the new user to the existing user data
  for(let existingUser of existingUserData){
    if (existingUser.username === newUser.username){
      let errorUsernameTaken = ["Username already exists."];
      displayErrorMessage(errorUsernameTaken);
      usernameField.focus();
      usenarmeTaken = true;
    }
    else if (existingUser.email === newUser.email){
      let errorEmailTaken = ["Email already in use."];
      displayErrorMessage(errorEmailTaken);
      emailField.focus();
      emailTaken = true;
    }
  }
  if(usenarmeTaken === false && emailTaken === false){
    existingUserData.push(newUser);

  // Store the updated user data back in localStorage
  localStorage.setItem("userData", JSON.stringify(existingUserData));
  console.log("New user stored");
   // show success message 
   alert("Registration successful!");
  
  return true;
  }
  else{
    return false;
  }
}

function clearFormFields() {
  // Clear all form fields
  usernameField.value = "";
  emailField.value = "";
  passwordField.value = "";
  passwordCheckField.value = "";
  checkboxTerms.checked = false;
}


function validateUsername() {
  let nameVal = usernameField.value;

  // Make a copy of the username to work with it without changing the original value
  let nameCopy = nameVal.slice(0);
  // Create an array of characters from the username to iterate through it and check requirements
  const chars = nameCopy.split("");

  // Check for the length of the username provided by the user
  if (nameVal === "") {
    let nameErrMessage = ["The username must be at least four characters long"];
    displayErrorMessage(nameErrMessage);
    usernameField.focus();
    return false;
  }
  //Create an empty array to store the unique chars from the username provided
  let unique = [];
  chars.forEach((char) => {
    // If the character is not in unique, append it to it
    if (!unique.includes(char)) {
      unique.push(char);
    }
    // If the character exists in unique, remove it from it
    else unique.pop(char);
  });

  // Check if the username contains at least 2 unique characters.
  if (unique.length < 2) {
    let uniqueErrMessage = ["The username must contain at least two unique characters"]
    displayErrorMessage(uniqueErrMessage);
    usernameField.focus();
    return false;
  }
  // Check if the username contains special characters.
  let specialChars = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~]/g;

  if (specialChars.test(nameVal) === true) {
    let specCharErrMessage = ["The username cannot contain any special characters or whitespace"];
    displayErrorMessage(specCharErrMessage);
    usernameField.focus();
    return false;
  }

  errorDisplay.style.display = "none";
  return nameVal;
}

// Declare a function to validate email
function validateEmail() {
  let emailVal = emailField.value;
  // Make a copy of the email value to work with it without changing the original value
  let emailCopy = emailVal.slice(0);
  // Create an array of characters from the email to iterate through it and check requirements
  const chars = emailCopy.split("");

  // Get the index position of @ and . in the email address provided by the user
  let atPos = chars.indexOf("@");
  let dotPos = chars.lastIndexOf(".");
  //Check if they are in the right position in the email address
  if (!chars.includes("@") || !chars.includes(".") || atPos < 1 || (dotPos - atPos) < 2 || chars.includes(" ")) {
    let emailErrmessage = ["Please, enter a valid email."]
    displayErrorMessage(emailErrmessage);
    emailField.focus();
    return false;
  }

  // Create Regex variable and check if the email provided contains 'example.com'.
  const re = /example\.com/;
  if (emailVal.endsWith("example.com") || re.test(emailVal)) {
    let exampleErrMessage = ['The email must not be from the domain "example.com".']
    displayErrorMessage(exampleErrMessage);
    emailField.focus();
    return false;
  }
  // hide the error message
  errorDisplay.style.display = "none";
  return emailVal;
}

// Declare a function to validate the password
function validatePassword() {
  let rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&*()_.'^$%#\-\+=[\]{};':"\\|,.<>\/?~])(?!.*password).{12,}$/gm;
  if (rePass.test(passwordField.value)) {
    // Password meets all requirements
    return true;
  }

  // If any of the conditions fail, focus on the password field and return false
  let passErrMessage = ["Passwords must be at least 12 characters long", "Passwords must have at least one uppercase and one lowercase letter", "Passwords must contain at least one number", "Passwords must contain at least one special character", "Passwords cannot contain the word 'password' (uppercase, lowercase, or mixed)", "Passwords cannot contain the username"];
  displayErrorMessage(passErrMessage );
  passwordField.focus();
  return false;
}

// Declare a function to check if both passwords match
function validatePasswordCheck() {
  if (passwordCheckField.value === passwordField.value) {
    console.log("pwd: ", passwordField.value, "chckpwd: ", passwordCheckField.value);
    return true;
  }
  else {
    let passCheckErrMessage = ["Both passwords must match."];
    displayErrorMessage(passCheckErrMessage);
    passwordCheckField.focus();
    return false;
  }
}

// Declare a function to make sure the user checked the box for the terms
function validateCheckbox() {
  if (checkboxTerms.checked){
    return true;
  }
  else {
    checkboxTerms.focus();
    return false;
  }
}


//>>>>>>>>>>>>>>>>>>>>>>>>LOGIC FOR THE LOGIN FORM<<<<<<<<<<<<<<<<<<
// Select elements and create variables for the login form
const loginForm = document.querySelector("#login");
const usernameFieldLogin = loginForm.elements["username"];
const passwordFieldLogin = loginForm.elements["password"];
const checkBoxKeepLogged = loginForm.elements["persist"];


loginForm.addEventListener("submit", login);

// Declare function to validate username
function login(evt) {

    let namePassMatch = false;

    if(!nameNotBlankLogin() || !passNotBlankLogin()){
      evt.preventDefault();
      return false;
    }

    // Check the userrname and password match
    for(let user of existingUserData){
        if(user.username ===  usernameFieldLogin.value.toLowerCase() && user.password === passwordFieldLogin.value){
            namePassMatch = true;
        }
        else {
            namePassMatch = false;
        }
    }
    if(namePassMatch){
        if(checkBoxKeepLogged.checked){
          alert("Login successful! You will be kept logged in.");
          return true;
        }
        else{
          alert("Login successful!");
          return true;
        }
    }
    // if username and password don't match diplsay error 
    else {
        evt.preventDefault();
        let loginErrMessage = ["Invalid username or password. Please try again."]
        displayErrorMessage(loginErrMessage);
        return false;
    }
}


// Check the username is not blank
function nameNotBlankLogin(){
  const nameValLogin = usernameFieldLogin.value;
  //if blank display error and return false
    if (nameValLogin === "") {
        let nameErrMessage = ["The username cannot be blank"];
        displayErrorMessage(nameErrMessage);
        usernameFieldLogin.focus();
        return false;
    }
    else{
        return true;
    }
}


// Check the password is not blank
function passNotBlankLogin(){
  const passValLogin = passwordFieldLogin.value;
  //if blank display error and return false
    if (passValLogin === "") {
        let passErrMessage = ["The password cannot be blank"];
        displayErrorMessage(passErrMessage);
        passwordFieldLogin.focus();
        return false;
    }
    else{
        return true;
    }
}
