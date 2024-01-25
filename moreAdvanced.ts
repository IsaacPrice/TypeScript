// Means that the variables can be either a number or a string
let mixedType: number | string;
mixedType = 5; // Ok
mixedType = "5"; // Ok

// An interface is basically a struct but in typescript
interface BusinessPartner {
    name: string;
    credit: number;
}
  
interface Contact {
    email: string;
    phone: string;
}

// an intersection just combines both interfaces
type Customer = BusinessPartner & Contact;

// using the intersected type
let newCustomer: Customer = {
    name: "Company Inc.",
    credit: 100000,
    email: "contact@companyinc.com",
    phone: "1234567890"
};

// Type guards basically let you check the types
function betterAdd(a: number | string, b: number | string) {
    if (typeof a === "number" && typeof b === "number") {
        return a + b;
    }
    if (typeof a === "string" && typeof b === "string") {
        return a.concat(b);
    }
    throw new Error("Types must be the same.")
}

// Add two numbers together
let num1: number = 10;
let num2: number = 49;
let num3 = betterAdd(num1, num2); 
console.log(typeof num3 + " : " + num3);

// Add two string together
let string1: string = "40";
let string2: string = "2";
let string3 = betterAdd(string1, string2); 
console.log(typeof string3 + " : " + string3);

// Part of a class
interface IUser {
    id: number,
    username: string
}

// function kind of
const getUser = (user: IUser) => {
    console.log(user.username);
}

let newPerson: IUser = {
    id: 8129487,
    username: "emanresu"
};

// Create a class
class User implements IUser {
    constructor(public id: number, public username: string) {}
}

const newUser = new User(1, "John");
getUser(newUser);

function getArray<T>(items: T[]): T[] {
    return new Array<T>().concat(items);
}

let numArray = getArray([1, 2, 3, 4]);
let stringArray = getArray(["John", "Hello"]);

