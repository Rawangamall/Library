"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserClass {
    constructor(firstName, lastName, phoneNumber, role, email, password, salary) {
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
exports.default = UserClass;
