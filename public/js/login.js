function switchForm(formId) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById(formId).style.display = 'block';
    var loginError = document.getElementById('loginError');
    var signupError = document.getElementById('signupError');
    
    if (loginError) {
        loginError.textContent = ''; // Clear login error message
    }
    if (signupError) {
        signupError.textContent = ''; // Clear signup error message
    }
}
