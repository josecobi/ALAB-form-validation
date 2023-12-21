// Select elements and create variables for the registration form
const regForm = document.querySelector("#registration");
const usernameField = regForm.elements["username"];
const emailField = regForm.elements["email"];
const passwordField = regForm.elements["password"];
const passwordCheckField = regForm.elements["passwordCheck"];
const errorDisplay = document.querySelector("#errorDisplay");
const registerBtn = document.querySelector("#regBtn");
const checkboxTerms = document.querySelector(".checkboxTerms");

// Select elements and create variables for the login form
const loginForm = document.querySelector("#login");
const usernameFieldLogin = loginForm.elements["username"];
const passwordFieldLogin = loginForm.elements["password"];

// Add event listener to validate and submit the form
regForm.addEventListener("submit", validateRegForm);

function displayErrorMessage(messages) {
 
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
  const existingUserData = JSON.parse(localStorage.getItem("userData")) || [];
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

function validateEmail() {
  let emailVal = emailField.value;
  // Make a copy of the email value to work with it without changing the original value
  let emailCopy = emailVal.slice(0);
  // Create an array of characters from the email to iterate through it and check requirements
  const chars = emailCopy.split("");

  // Get the index position of @ and . in the email address provided by the user
  let atPos = chars.indexOf("@");
  let dotPos = chars.lastIndexOf(".");

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

  errorDisplay.style.display = "none";
  return emailVal;
}

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

function validateCheckbox() {
  if (checkboxTerms.checked){
    return true;
  }
  else {
    checkboxTerms.focus();
    return false;
  }
}
