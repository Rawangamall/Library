export class BookClass {
    title: string;
    author: string;
    availableQuantity: Number;
    shelfLocation: string;
    bookType: string;
    constructor(title: string,author: string ,availableQuantity: Number,shelfLocation: string){
       this.title =title;
        this.author =author;
        this.availableQuantity=availableQuantity;
        this.shelfLocation=shelfLocation;
        this.bookType="free";
    }
}

export class RentalBook extends BookClass {
    rentalFee: Number;
    constructor(title: string, author: string, availableQuantity: Number, shelfLocation: string, rentalFee: Number) {
        super(title, author, availableQuantity, shelfLocation);
        this.bookType="rental";
        this.rentalFee = rentalFee;
    }
}

