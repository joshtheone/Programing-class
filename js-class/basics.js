// ops
// +
// -
// *
// /
// = -- equaly to name = "johnson"
// == -- equaly value number == "1" // true
// === -- equaly value and type -- name === "johnson" // true
// !== -- not equaly to

let number = 10;
// console.log(number !== 10); // true

// ++ -- increment and decrement

// number--;
// console.log(number);

// += -- addition assignment

number += 5; // number = number + 5
console.log(number); // 15


// Valiables
const name = "Johnson";
const age = 30;
const isStudent = false;

// Arrays [index]
const fruits = ["Apple", "Banana", "Orange", "Grapes"];
// console.log(fruits[0]); // Apple
// console.log(fruits[1]); // Banana
// console.log(fruits[2]); // Orange
// console.log(fruits[3]); // Grapes

// Objects {key: value}
const student1 = {
    name: "Alice",
    age: 22,
    isEnrolled: true,
    courses: ["Math", "Science", "History"]
}

const student2 = {
    name: "Bob",
    age: 24,
    isEnrolled: false,
    courses: ["Physics", "Science", "Biology"]
}

const student3 = {
    name: "Charlie",
    age: 21,
    isEnrolled: true,
    courses: ["Math", "Art"]
}

const student4 = {
    name: "Diana",
    age: 23,
    isEnrolled: true,
    courses: ["History", "Science"]
}

const student5 = {
    name: "Ethan",
    age: 25,
    isEnrolled: false,
    courses: ["Biology", "Chemistry"]
}


const students = [student1, student2, student3, student4, student5];


// Conditions

// If-else
if (student2.isEnrolled) {
    console.log(`${student2.name} is enrolled in the following courses: ${student2.courses.join(', ')}`);
} else {
    console.log(`${student2.name} is not enrolled in any courses.`);
}

if (student2.courses.includes("Math")) {
    console.log(`${student2.name} is enrolled in Math.`);
} else if (student2.courses.includes("Science")) {
    console.log(`${student2.name} is enrolled in Science.`);
} else {
    console.log(`${student2.name} is not enrolled in any of the specified courses.`);
}

// Switch-case

const course = "Science";
switch (course) {
    case "Math":
        console.log(`${student1.name} is enrolled in Math.`);
        break;
    case "Science":
        console.log(`${student1.name} is enrolled in Science.`);
        break;
    default:
        console.log(`${student1.name} is not enrolled in any of the specified courses.`);
}

// Loops

// For loop
for (let i = 1; i <= 10; i++) {
    console.log(i);
}

// for (let i = 0; i < students.length; i++) {
//     console.log("name:" + students[i].name + " age:" + students[i].age + " isEnrolled:" + students[i].isEnrolled);
// }

// Foreach loop
students.forEach(student => {
    console.log("name:" + student.name + " age:" + student.age + " isEnrolled:" + student.isEnrolled);
});
// while loop
let count = 1;
while (count <= 10) {
    console.log(count);
    count++;
}

// Functions
function greet(name) {
    return `Hello, ${name}!`;
}
console.log(greet("Johnson")); // Hello, Johnson!

function add(a, b) {
    return a + b;
}
console.log(add(5, 10)); // 15

function isEven(num) {
    return num % 2 === 0;
} 

// Events