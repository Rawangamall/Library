 class Borrower {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    email: string;
    password: string;
    wishlist: string[];
    image: string;
    constructor(firstName: string, lastName: string, phoneNumber: string,role: string,email: string,password: string,wishlist: Array<string>) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.phoneNumber = phoneNumber;
      this.role = "borrower";
      this.email = email;
      this.password = password;
      this.wishlist = [];
      this.image = "default.jpg";

    }  
  }
  
  export default Borrower