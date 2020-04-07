//Collecting required DOM elements
const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

//Shows input errors message
function showError(input, message){
    const formControl = input.parentElement;
    formControl.className = 'form-control error';
    const small = formControl.querySelector('small');
    small.innerText = message;
}

//to output the field name with an uppercase at the beggigning of error message
function getFieldName(input){
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

//Show success outline
function showSuccess(input){
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

//to validate the email
function validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//check required fields
function checkRequired(inputArr){
    inputArr.forEach(function(input){
        if (input.value.trim() === ''){
            showError(input, `${getFieldName(input)} is required`);
        }else{
            showSuccess(input);
        }
    });
}


//event listeners

//on submitting the form
form.addEventListener('submit', function(e){
    e.preventDefault();

    //Good way
    checkRequired([username,email, password, password2]);

    // Bad way
    // //Validating username
    // if (username.value === ''){
    //     showError(username, 'Username is required');
    // }else{
    //     showSuccess(username);
    // }

    // //Validating email
    // if (email.value === ''){
    //     showError(email, 'Email is required');
    // }else if(!validateEmail(email)){
    //     showError(email, 'Email is not valid');
    // }else{
    //     showSuccess(email);
    // }

    // //Validating passowrd
    // if (password.value === ''){
    //     showError(password, 'Username is required');
    // }else{
    //     showSuccess(password);
    // }

    // //Validating password2
    // if (password2.value === ''){
    //     showError(password2, 'Username is required');
    // }else{
    //     showSuccess(password);
    // }
});
