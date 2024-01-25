let id: number = 100000;
let company: string = "Peaky";
let isWorking: boolean = false;

let ids: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["John", "Doe"];

let person: [number, string, boolean] = [1, "John", true];

enum direction {
    Up,
    Down, 
    Left, 
    Right
}

// function that takes two numbers, and returns a number
function add(x: number, y: number): number {
    return x + y;
}

let a: number = 10;
let b: number = 2;
let c: number = add(a, b);

console.log(c)

