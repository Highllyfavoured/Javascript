function functionPattern() {
    function isStrongPassword() {
    let password = prompt("Enter a Password")
    if (password.length < 8) {
        return "Password too short! Must be at least 8 characters.";
    } else if (/\d/.test(password)) {
        return "Password must contain a number"
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Password must contain a special number";
    } else {
        return "Password looks good!";
    }
}
    console.log(isStrongPassword())
    console.log(functionPattern())
}