class BookClass {
    constructor(title,author ,availableQuantity,shelfLocation){
       this.title =title;
        this.author =author;
        this.availableQuantity=availableQuantity;
        this.shelfLocation=shelfLocation;
        this.bookType="free";
    }
}

class RentalBook extends BookClass {
    constructor(title, author, availableQuantity, shelfLocation, rentalFee) {
        super(title, author, availableQuantity, shelfLocation);
        this.bookType="rental";
        this.rentalFee = rentalFee;
    }
}

module.exports = {BookClass,RentalBook};
