function run () {
let firstName = "Favour";
let lastName = "Olaosebikan";
let age = 20;
let schoolName = "FUNAAB";
let grade = "A";
let isGraduated = "true";

 // Calculate future age
    const futureAge = age + 1;

    let fullName = `${firstName}  ${lastName}`;
    
    // Create formatted display
console.log(`---Student Profile---`)
console.log(`Full Name:${fullName}`)
console.log(`Current Age:${age} years old`)
console.log(`School Name:${schoolName}`)
console.log(`Student Status:${isGraduated ? 'Yes, I have graduated' : 'No, I have not graduated'}`)
console.log(`Fun Fact: Full Name has ${firstName.length + lastName.length} letters total`)
console.log(`Grade A:${grade}`)
console.log(`futureAge:${futureAge}`)
console.log(`Uppercase: ${fullName.toUpperCase()}`)
console.log(`Lowercase: ${schoolName.toLowerCase()}`)
console.log(`Trimmed:${grade.trim()}`)        
}