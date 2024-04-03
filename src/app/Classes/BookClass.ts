export class BookClass {
    title: string;
    author: string;
    availableQuantity: Number;
    shelfLocation: string;
    bookType: string;
    sales:number
    constructor(title: string,author: string ,availableQuantity: Number,shelfLocation: string , sales:number){
       this.title =title;
        this.author =author;
        this.availableQuantity=availableQuantity;
        this.shelfLocation=shelfLocation;
        this.bookType="free";
        this.sales = sales;
    }
}

export class RentalBook extends BookClass {
    rentalFee: Number;
    constructor(title: string, author: string, availableQuantity: Number, shelfLocation: string, rentalFee: Number,sales:number) {
        super(title, author, availableQuantity, shelfLocation,sales);
        this.bookType="rental";
        this.rentalFee = rentalFee;
    }
}

