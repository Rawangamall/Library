interface Borrower {
    update(bookId: string, isAvailable: boolean): void;
  }
  
// interface BookObservable {
//     availableQuantity: boolean;
//     observers: Borrower[];
  
//     addObserver(observer: Borrower): void;
//     removeObserver(observer: Borrower): void;
//     notifyObservers(isAvailable: boolean): void;
//   }
  
//   class BookObservable implements BookObservable {
//     public availableQuantity: boolean;
//      observers: Borrower[] = [];
  
//     constructor(public bookId: string) {
//       this.bookId = bookId;
//       this.availableQuantity = true;
//     }
  
//     addObserver(observer: Borrower): void {
//       this.observers.push(observer);
//     }
  
//     removeObserver(observer: Borrower): void {
//       this.observers = this.observers.filter(obs => obs !== observer);
//     }
  
//     notifyObservers(isAvailable: boolean): void {
//       for (const observer of this.observers) {
//         observer.update(this.bookId, isAvailable);
//       }
//     }
//   }
  
  class ObserverManager {
    private static instance: ObserverManager;
    private observers: Map<string, Set<Borrower>> = new Map();
  
    private constructor() {}
  
    static getInstance(): ObserverManager {
      if (!ObserverManager.instance) {
        ObserverManager.instance = new ObserverManager();
      }
      return ObserverManager.instance;
    }

    registerObserver(bookId: string, borrower: Borrower) {
      const observers = this.observers.get(bookId) || new Set();
      console.log(observers,"obs 43")
      observers.add(borrower);
      this.observers.set(bookId, observers);
      console.log(observers,"obs 46")

    }
  
    removeObserver(bookId: string, borrower: Borrower) {
      const observers = this.observers.get(bookId);
      if (observers) {
        observers.delete(borrower);
        if (observers.size === 0) {
          this.observers.delete(bookId);
        }
      }
    }
  
    notifyObservers(bookId: string, isAvailable: boolean) {
      const observers = this.observers.get(bookId);
      console.log(observers,"in notify")
      if (observers) {
        observers.forEach(observer => observer.update(bookId, isAvailable));
      }
    }
  }

  class Borrower implements Borrower {

    update(bookId:string, isAvailable: boolean): void {

        if (isAvailable) {
          console.log(`Notification: Book ${bookId} is now available!`);
        } else {
          console.log(`Notification: Book ${bookId} is currently out of stock.`);
        }
      }
    }
  
export default ObserverManager.getInstance();  //singleton obs instance
  
//still in work stage