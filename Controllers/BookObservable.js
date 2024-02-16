"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BookObservable {
    constructor(bookId) {
        this.bookId = bookId;
        this.observers = [];
        this.bookId = bookId;
        this.availableQuantity = true;
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notifyObservers(isAvailable) {
        for (const observer of this.observers) {
            observer.update(this.bookId, isAvailable);
        }
    }
}
class ObserverManager {
    constructor() {
        this.observers = new Map();
    }
    static getInstance() {
        if (!ObserverManager.instance) {
            ObserverManager.instance = new ObserverManager();
        }
        return ObserverManager.instance;
    }
    
    registerObserver(bookId, borrower) {
        const observers = this.observers.get(bookId) || new Set();
        console.log(observers, "obs 43");
        observers.add(borrower);
        this.observers.set(bookId, observers);
        console.log(observers, "obs 46");
    }
    removeObserver(bookId, borrower) {
        const observers = this.observers.get(bookId);
        if (observers) {
            observers.delete(borrower);
            if (observers.size === 0) {
                this.observers.delete(bookId);
            }
        }
    }
    notifyObservers(bookId, isAvailable) {
        const observers = this.observers.get(bookId);
        console.log(observers, "in notify");
        if (observers) {
            observers.forEach(observer => observer.update(bookId, isAvailable));
        }
    }
}

class Borrower {
    update(bookId, isAvailable) {
        console.log(this , "borrower");
        if (isAvailable) {
            console.log(`Notification: Book ${bookId} is now available!`);
        }
        else {
            console.log(`Notification: Book ${bookId} is currently out of stock.`);
        }
    }
}
exports.default = ObserverManager.getInstance(); //singleton obs instance
