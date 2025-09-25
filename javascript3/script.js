shopping = ["Bread", "Milk", "Eggs", "Apples", "Rice"]
console.log("Original Shopping List:", shopping)
shopping.push("Beans");
console.log("List after adding to the end:", shopping);
shopping.shift()
console.log("List after removing first item:", shopping);
console.log("Total number of items:", shopping.length)
for(let l=0; l < shopping.length; l++) {
    console.log(`Shopping List ${l + 1}:, ${shopping[l]}`);
}

function formatList(list) {
    for(let l=0; l < list.length; l++) {
    console.log(`Shopping List ${l + 1}:, ${list[l]}`);
    }
}

function getAverage(grades) {
    total= 0;
    console.log("Calculating Average Grade:");
    for (let grade of grades) {
        console.log("Adding grade:", grade);
        total += grade;

    let average = total / grades.length;
    console.log(`Total: ${total}, Average: ${average.toFixed(1)}`);
    }
}

function getHighest(grades) {
  let highest = grades[0];
  for (let grade of grades) {
    if (grade > highest) {
      highest = grade;
    }
  }
  console.log(highest);
}

function getLowest(grades) {
    let lowest = grades[0];
    for (let grade of grades) {
      if (grade < lowest) {
        lowest = grade;
      }
    }
    console.log(lowest);
}

function getPassRate(grades) {
    let passed = 0;
    for (let grade of grades) {
        if (grade >= 50) {
            passed = grades;
            passed++
        }
    }
//     console.log(getPassRate(grades) + "%);
}

function addMovie(movies, ratings) {
        movies.push()
        ratings.push()
        console.log(movies)
        console.log(ratings)
}

function getAverageRating(ratings) {
    total= 0;
    console.log("Calculating Average G:");
    for (let rating of ratings) {
        console.log("Adding grade:", rating);
        total += rating;

    let average = total / ratings.length;
    console.log(`Total: ${total}, Average: ${average.toFixed(1)}`);
    }

}
    