class Borrower {
    constructor(firstName, lastName, phoneNumber,role,email,password,wishlist) {
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
  
  module.exports = Borrower;
  