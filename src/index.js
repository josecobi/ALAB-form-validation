//>>>>>>>>>>>>>>Validate Register Form <<<<<<<<<<<<<<<<<<
// Select elements by name and create variables
const regForm = document.querySelector("#registration");
const usernameField = regForm.elements["username"];
const emailField = regForm.elements["email"];
const passwordField = regForm.elements["password"];
const passwordCheckField = regForm.elements["passwordCheck"];
const errorDisplay = document.querySelector("#errorDisplay");
const registerBtn = document.querySelector("#regBtn");
console.log(usernameField.value);

regForm.addEventListener("submit", validateRegForm);

function validateRegForm(evt){
  const validateName = validateUsername()
  if(validateName === false){
    evt.preventDefault();
    return false;
  }

  const validateEmailAddress = validateEmail()
  if(validateEmailAddress === false){
    evt.preventDefault();
    return false;
  }

  return true;
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

function validatePassword(){
  let passwordVal = passwordField.value;

  let passwordCopy = passwordVal.slice(0);
  // Create an array of characters from the username to iterate through it and check requirements
  const chars = passwordCopy.split("");

  // Check for the lenght of the username provided by the user
  if(chars.length < 12){
    errorDisplay.innerHTML =
      "<span>Password must be at least 12 characters long</span>";
    errorDisplay.style.display = "block";
    passwordField.focus();
    return false;
  }

  
}