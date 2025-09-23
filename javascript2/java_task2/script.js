function getGrade() {
            let score = prompt("Enter your grade");

            if (score >= 100) {
                console.log("Score:", score," -> Outstanding! Grade: A+");
            } else if (score >= 90) {
                console.log("Score:", score," -> Grade: A");
            } else if (score >= 80) {
                console.log("Score:", score," -> Grade: B");
            } else if (score >= 70) {
                console.log("Score:", score," -> Grade: C");
            } else if (score >= 60) {
                console.log("Score:", score," -> Grade: D");
            } else {
                console.log("Score:", score," -> Grade: F");
            }
                }

        function calculatePrice() {
            let price = prompt("Enter the price of goods");
            let customerType = prompt("Are you a student, senior or employee");
            let isFirstPurchase = confirm("Is this your first purchase?");

            function calculateDiscount(){
                let discount = 0;

            if (customerType === "student") {
               const discountPercentage = isFirstPurchase.toLowerCase() === 'yes' ? 15 : 10;
                discountedPrice =
                 Number(price) - (discountPercentage / 100) * Number(price);
            } else if (customerType === "senior") {
                const discountPercentage = isFirstPurchase.toLowerCase() === 'yes' ? 20 : 15;
                discountedPrice =
                Number(price) - (discountPercentage / 100) * Number(price);
            }else if (customerType === "employee") {
                const discountPercentage = isFirstPurchase.toLowerCase() === 'yes' ? 25 : 20;
                 discountedPrice =
                 Number(price) - (discountPercentage / 100) * Number(price);
            }

            return `Discounted price is ${discountedPrice}`
            }

                console.log(calculatePrice())
                }

        function weatherAdvice() {
           let temperature = prompt("What is the temperature in your area");
            let isRaining = confirm("Is it raining?");

             if (temperature <= 32 && isRaining) {
                console.log("Freezing rain! Stay inside!");  
             } else if (temperature <= 32) {
                console.log("Very cold, wear a heavy coat.");  
             } else if (temperature >=32) {
                console.log("Chilly, bring a jacket.");
             } else if (temperature <= 60) {
                console.log("Nice weather!");
             } else if (temperature > 80) 
                console.log("It's hot, stay hydrated!")

            isRaining? "Bring an umbrella" : "No umbrella needed";
        }

        function atm() {
            let balance = Number(prompt("Enter your balance:"))
            let action = prompt("Do you want to withdraw or deposit?")
            let amount = prompt("Enter amount to withdraw or deposit:")

                if (action === "withdraw") {
                    if (amount > 500) {
                    console.log(`Withdrawal limit exceeded. You can only withdraw up to 500 at once.`);
                    }
                    if (amount > balance) {
                    console.log(`Insufficient funds. Your balance is ${balance}.`);
                    }
                    balance -= amount;
                    console.log(`Withdrawal successful. New balance: ${balance}`);
                    } 
        
            else if (action === "deposit") {
                balance += amount;
                console.log(`Deposit successful. New balance: ${balance}`);
            } 
            else {
                console.log(`Invalid action. Please choose "withdraw" or "deposit"`);
            }
            }

        function personalAssistant() {
            let hour = prompt("Enter time in hours");
            let weather = prompt("Is it a sunny, cloudy or rainy day?");
            let dayType = prompt("is it a workday, weekend, holiday?");
            
            let message = "";


            if (hour >= 5 && hour < 12) {
                message += "Good morning! ";
            } else if (hour >= 12 && hour < 18) {
                message += "Good afternoon! ";
            } else if (hour >= 18 && hour < 22) {
                message += "Good evening! ";
            } else {
                message += "It's late, you should get some rest. ";
            }

            if (dayType === "workday") {
                if (hour >= 9 && hour <= 17) {
                message += "Focus on your tasks. ";
                message += weather === "rainy" ? "Don't forget your umbrella! " : "A short walk could refresh you. ";
                } else {
                message += "Try to relax after work. ";
                }
                } else if (dayType === "weekend") {
                    message += "Enjoy your weekend! ";
                    message += weather === "sunny" ? "Perfect time for outdoor activities. " : "Maybe watch a movie indoors. ";
                } else if (dayType === "holiday") {
                    message += "Happy holiday! ";
                    message += (weather === "rainy" || weather === "cloudy") 
                    ? "Cozy up with a book or some tea. " 
                    : "Great day to celebrate outside. ";
                }

                
                if (dayType === "workday" && (hour < 9 || hour > 17)) {
                    message += "Remember to maintain work-life balance.";
                }

                console.log(message.trim());
            }

        
