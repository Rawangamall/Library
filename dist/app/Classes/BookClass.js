"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalBook = exports.BookClass = void 0;
class BookClass {
    constructor(title, author, availableQuantity, shelfLocation, sales) {
        this.title = title;
        this.author = author;
        this.availableQuantity = availableQuantity;
        this.shelfLocation = shelfLocation;
        this.bookType = "free";
        this.sales = sales;
    }
}
exports.BookClass = BookClass;
class RentalBook extends BookClass {
    constructor(title, author, availableQuantity, shelfLocation, rentalFee, sales) {
        super(title, author, availableQuantity, shelfLocation, sales);
        this.bookType = "rental";
        this.rentalFee = rentalFee;
    }
}
exports.RentalBook = RentalBook;
