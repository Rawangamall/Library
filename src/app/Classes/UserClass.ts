class UserClass {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  email: string;
  password: string;
  salary: number;
  image: string;

  constructor(firstName: string, lastName: string, phoneNumber: string,role: string,email: string,password: string,salary: number) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.phoneNumber = phoneNumber;
      this.role = role;
      this.email = email;
      this.password = password;
      this.salary = salary;
      this.image = "default.jpg";

    }  
  }
  
  export default UserClass;
  