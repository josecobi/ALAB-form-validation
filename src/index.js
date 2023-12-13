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

  // const validateEmail = validateEmail()
  // if(validateEmail === false){
  //   evt.preventDefault();
  //   return false;
  // }

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
  let specialChars =/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;
  
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

