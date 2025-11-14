function calOperation() {
    let num1 = prompt("Enter the First Number") || 8;
    let num2 = prompt("Enter the Second Number") || 3;

    let addition = num1 + num2;
    let subtraction = num2 - num2;
    let multiplication = num1 * num2;
    let division = num1 / num2;
    let remainder = num1 % num2;
    let exponentiation = num1 ** num2;

    let average = (num1 + num2) / 2;

    console.log(`--- Simple Calculator ---`)
    console.log(`Addition:${addition = num1 + num2}`)
    console.log(`Subtraction:${subtraction = num2 - num2}`)
    console.log(`Multiplication:${multiplication = num1 * num2}`)
    console.log(`Division:${division = num1 / num2}`)
    console.log(`Remainder:${remainder = num1 % num2}`)
    console.log(`Exponentiation:${exponentiation = num1 ** num2}`)
    console.log(`Average:${average = (num1 + num2) / 2}`)
    console.log(`Is Num1 greater than Num2?${isNum1Greater = num1 > num2}`)
    console.log(`Between 8 and 3, the larger number is 8`)
}