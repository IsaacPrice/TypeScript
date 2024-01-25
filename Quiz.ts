import * as readline from 'readline'; 

enum Answer {
    A,
    B,
    C, 
    D
}

// Create all of the questions for the quiz
let questions: Array<[String, String, String, String, String, Answer]> = [];
questions.push(["What is the Capital of Utah?", "Montreal", "Indianapolis", "Salt Lake City", "New York", Answer.C]);
questions.push(["Which planet is known as the Red Planet?", "Mars", "Venus", "Jupiter", "Saturn", Answer.A]);
questions.push(["What is the largest mammal in the world?", "Elephant", "Lion", "Blue Whale", "Giraffe", Answer.C]);
questions.push(["Who is the author of 'Harry Potter' book series?", "J.K. Rowling", "Stephen King", "George Orwell", "Dan Brown", Answer.A]);
questions.push(["In which year did Christopher Columbus discover America?", "1492", "1620", "1776", "1865", Answer.A])
questions.push(["What is the chemical symbol for gold?", "Au", "Ag", "Fe", "Hg", Answer.A])

//let choice: string = "A";
const rl = readline.createInterface({ 
    input: process.stdin,
    output: process.stdout
});

// TODO: fix this somehow so that the input actually works and doesn't just skip over the answers
function askQuestion (question: [String, String, String, String, String, Answer]): boolean {
    // Print out the question information
    console.log(question[0]);
    console.log("A. " + question[1]);
    console.log("B. " + question[2]);
    console.log("C. " + question[3]);
    console.log("D. " + question[4]);

    // get the users answer
    let choiceEnum: Answer = Answer.A;
    rl.question("Answer: ", (choice) => {
        switch (choice) {
            case "A": {
                choiceEnum = Answer.A;
                break;
            }
            case "B": {
                choiceEnum = Answer.B;
                break;
            }
            case "C": {
                choiceEnum = Answer.C;
                break;
            }
            case "D": {
                choiceEnum = Answer.D;
                break;
            }
            default: {
                choiceEnum = Answer.A;
                break;
            }
        }
        rl.close();
    });

    console.log(choiceEnum);
    return choiceEnum === question[5];
}

// Ask all of the questions
questions.forEach((question) => askQuestion(question));