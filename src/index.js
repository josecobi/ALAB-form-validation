//>>>>>>>>>>>>>>Validate Register Form <<<<<<<<<<<<<<<<<<
// Select elements by name and create variables
const regForm = document.querySelector("#registration");
const usernameField = regForm.elements["username"];
const emailField = regForm.elements["email"];
const passwordField = regForm.elements["password"];
const passwordCheckField = regForm.elements["passwordCheck"];
const errorDisplay = document.querySelector("#errorDisplay");
const registerBtn = document.querySelector("#regBtn");
const passwordError = document.querySelector(".passwordError");


//Variables for the password validation logic
const re12charError = document.querySelector(".re12charError");     
const reUpLowError = document.querySelector(".reUpLowError");     
const reDigError = document.querySelector(".reDigError");    
const reSpeCharError = document.querySelector(".reSpeCharError");    
const rePassError = document.querySelector(".rePassError");    
const UNameError = document.querySelector(".UNameError");
const repeatPassError = document.querySelector(".repeatPassError");     

// Regex veriables for password validation
const re12CharMin = /.{12,}/gm;
const reUpLowCase = /^(?=.*[a-z])(?=.*[A-Z])/gm;
const reDigit = /(?=.*\d)/gm;
const reSpecialChar = /(?=.*[@#&*()_.'\^$%#\-\+=[\]{};':"\\|,.<>\/?~])/gm;
const reIncludesPass = /(?!.*password)/gm;



// Add event listener to validate and submit the form
regForm.addEventListener("submit", validateRegForm);
// add event listener per https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event 
passwordField.addEventListener("input", displayPassRequirements);
passwordField.addEventListener("input", validatePassword);


function validateRegForm(evt){
  const validateName = validateUsername();
  if(validateName === false){
    evt.preventDefault();
    return false;
  }

  const validateEmailAddress = validateEmail();
  if(validateEmailAddress === false){
    evt.preventDefault();
    return false;
  }

  const validatePass = validatePassword();
  if(validatePass === false){
    evt.preventDefault();
    return false;
  }

  const validatePassCheck =  validatePasswordCheck();
  if(validatePassCheck === false){
    evt.preventDefault();
    return false;
  }
}

function validateUsername() {
  let nameVal = usernameField.value;
  
  // Make a copy of the username to work with it without changing the original value
  let nameCopy = nameVal.slice(0);
  // Create an array of characters from the username to iterate through it and check requirements
  const chars = nameCopy.split("");

  // Check for the lenght of the username provided by the user
  if(chars.length < 4){
    errorDisplay.innerHTML =
      "<span>The username must be at least four characters long</span>";
    errorDisplay.style.display = "block";
    usernameField.focus();
    return false;
  }
  
  
  let unique = [];
  chars.forEach((char) => {
    //if the character is not in unique append it to it
    if (!unique.includes(char)) {
      unique.push(char);
    }
    //if the character exists in unique remove it from it
    else(unique.pop(char));
  });

  // Check if the username contains at least 2 unique characters. If it doesn't, display feedback and return false.
  if (unique.length < 2) {
    errorDisplay.innerHTML =
      "<span>The username must contain at least two unique characters</span>";
    errorDisplay.style.display = "block";
    usernameField.focus();
    return false;
  }
  // Check if the username contains special characters. If so, display feedback and return false.
  let specialChars =/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~]/g;
  
  if(specialChars.test(nameVal) === true){
    errorDisplay.innerHTML =
      "<span>The username cannot contain any special characters or whitespace</span>";
    errorDisplay.style.display = "block";
    usernameField.focus();
    return false;
  }

  errorDisplay.style.display = "none";
  return nameVal;
}

function validateEmail(){
  let emailVal = emailField.value;
  // Make a copy of the email value to work with it without changing the original value
  let emailCopy = emailVal.slice(0);
  // Create an array of characters from the email to iterate through it and check requirements
  const chars = emailCopy.split("");

  //Get the index position of @ and . in the email address provided by the user
  let atPos = chars.indexOf("@");
  let dotPos = chars.lastIndexOf(".");

  if(!chars.includes("@") || !chars.includes(".") || atPos < 1 || (dotPos - atPos) < 2 || chars.includes(" ")){
    errorDisplay.innerHTML =
      "<span>Please, enter a valid email.</span>";
    errorDisplay.style.display = "block";
    emailField.focus();
    return false;
  }

  // Create Regex variable and check if the email provided contains 'example.com'. If so display error message.
  const re = /example\.com/;
  if (emailVal.endsWith("example.com") || re.test(emailVal)) {
    errorDisplay.innerHTML =
      '<span>The email must not be from the domain "example.com".</span>';
    errorDisplay.style.display = "block";
    emailField.focus();
    return false;
  }

  errorDisplay.style.display = "none";
  return emailVal;
}

function displayPassRequirements(){
    usernameField.addEventListener("change", validatePassword);
      // Show the password error
      passwordError.classList.remove('hide');
      // create variables and store regular  expressions in them then check condition for each one
      // hide the errors as the password meets each requirement. Easier for the user to keep track of the missing requirements
      // match any character and make sure there are at leat 12 chars
      




      if (re12CharMin.test(passwordField.value)){
        re12charError.classList.add('hide');
      }
      // at least 1 upper and 1 lower letter. "^" is the beginning of the string "?=..." Lookahead assertation. 
      if (reUpLowCase.test(passwordField.value)){
        reUpLowError.classList.add('hide');
      }
      else {
        reUpLowError.classList.remove('hide');
      }
      // at least one digit
      if (reDigit.test(passwordField.value)){
        reDigError.classList.add('hide');
      }
      else {
        reDigError.classList.remove('hide');
      }
      // at least one special char
      if (reSpecialChar.test(passwordField.value)){
        reSpeCharError.classList.add('hide');
      }
      else {
        reSpeCharError.classList.remove('hide');
      }
      // must not include the word 'password'
      if (reIncludesPass.test(passwordField.value)){
        rePassError.classList.add('hide');
      }
      else {
        rePassError.classList.remove('hide');
      }

      // check if the password includes the username
      if (passwordField.value.includes(usernameField.value)) {
        UNameError.classList.remove('hide');
      } else {
        UNameError.classList.add('hide');
      }

      validatePassword()
  }
  function validatePassword(){
    if (re12CharMin.test(passwordField.value) &&
        reUpLowCase.test(passwordField.value) &&
        reDigit.test(passwordField.value) &&
        reSpecialChar.test(passwordField.value) &&
        reIncludesPass.test(passwordField.value)
      ) {
        // Password meets all requirements
        passwordError.classList.add('hide');
        return true;
      }
   else {
      // Password does not have at least 12 characters
      re12charError.classList.remove('hide');
    }
    
    // If any of the conditions fail, focus on the password field and return false
    passwordField.focus();
    return false;
  }
  
function validatePasswordCheck(){
  console.log("check")
  if(passwordCheckField.value !== passwordField.value){
    
    errorDisplay.innerHTML =
      "<span>Both passwords must match.</span>";
    errorDisplay.style.display = "block";
    passwordCheckField.focus();
    return false;
  }
}
