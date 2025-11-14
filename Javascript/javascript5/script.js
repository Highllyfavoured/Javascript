// Practice Exercise One
function changeColor() {
    document.getElementById('paragraph').style.color = "green";
    document.getElementById('paragraph').style.backgroundColor = "black";
}

// Practice Exercise Two
function writeText() {
    let text = document.getElementById('inputName').value;
    let char = text.length
}

// Practice Exercise Three
function simple() {
    let userName = document.getElementById('nameInput').value;
    let passWord = document.getElementById('nameInput').value;

    passWord = Number(passWord);

    if (userName === "" && passWord === 0) {
        document.getElementById('greeting').textContent = "Please fill in all fields";
        return;
    }

    let greeting = `Welcome, ${userName}!`
    document.getElementById('greeting').textContent = greeting;
    document.getElementById('greeting').textContent = `${userName} login successful`;
}