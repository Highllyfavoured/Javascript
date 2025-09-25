// Practice Exercise 1
let movie = {
    title: "Graced",
    director: "Chosen Sarah",
    releaseYear: 2030,
    rating: 7,

    // method to get Summary
    getSummary: function() {
        console.log(`${this.title} (${this.releaseYear}), directed by ${this.director}, rated ${this.rating}/10`);
    }
};
    movie.getSummary()

    movie.isWatched = true;
    console.log("Updated Movie List:", movie)
    
    
    let movies = [
    {
        title: "Highly Favoured",
        director: "Favour Tabitha",
        releaseYear: 2025,
        rating: 10
    },
    {
        title: "Inception",
        director: "Christopher Nolan",
        releaseYear: 2010,
        rating: 9
    },
    {
        title: "Lord of the Ring",
        director: "Adam Abraham",
        releaseYear: 2022,
        rating: 6
    }

];

    let highRatings = []
    for (let movie of movies) {
        if (movie.rating >= 8) {
            highRatings.push(movie)
        }
    } 
    console.log("High rating (>= 8):");
    for (let movie of highRatings) {
        console.log(` ${movie.title}: ${movie.rating}`)
    }


// Practice Exercise Two
let cartItem = {
    name: "Rice",
    price: 2000,
    quantity: 2,

    // Method to get Total
    getTotal: function() {
        return this.price * this.quantity
    }
};
cartItem.getTotal()

let cart = [
    {
      name: "Beans",
      price: 1500,
      quantity: 5,  
    getTotal: function() {
        return this.price * this.quantity
    }
    },
    {
      name: "Goldemore",
      price: 3000,
      quantity: 3,  
      getTotal: function() {
        return this.price * this.quantity
    }
    },
    {
      name: "Milk",
      price: 2900,
      quantity: 4,  
      getTotal: function() {
        return this.price * this.quantity
    }
    }
]

function getCartTotal(cart) {
    let total = 0
    for(let item of cart) {
        total += item.getTotal()
    }
    return total 
    
}
     console.log(`Sum up of the total for all items is: ${getCartTotal(cart)}`)


// Practice Exercise Three

let member = {
    name: "Favour",
    membershipType: "premium",
    borrowedBooks: ['Ada is good', 'Legend of the seeker', 'Lighthouse squad'],

    borrowBook: function() {
        book = "I love You"
       this.borrowedBooks.push(book)
       return `added book ${book}. items in members ${member}`;
    },
}
    member.borrowBook()

