
const table = document.getElementById("studentTable");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
let studentList = [

];

const nameInput = document.getElementById("nameInput");
const ageInput = document.getElementById("ageInput");
const enrolledInput = document.getElementById("enrolledInput");
const submitStudentButton = document.getElementById("submitStudentButton");



submitStudentButton.addEventListener("click", (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const age = ageInput.value;
    const isEnrolled = enrolledInput.checked;

    // if (name && !isNaN(age)) {
    studentList.push({
        name: name,
        age: age,
        isEnrolled: isEnrolled,
        courses: []
    });

    // Clear existing table rows
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    showStudents(studentList);
    nameInput.value = "";
    ageInput.value = "";
    enrolledInput.checked = false;
    // }
});


searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredStudents = studentList.filter(student => student.name.toLowerCase().includes(searchTerm));

    // Clear existing table rows
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    showStudents(filteredStudents);
});

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredStudents = studentList.filter(student => student.name.toLowerCase().includes(searchTerm));

    // Clear existing table rows
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    showStudents(filteredStudents);
});



showStudents(studentList);


function showStudents(students) {
    students.forEach(student => {

        const tr = document.createElement("tr");

        for (let index = 0; index < 3; index++) {
            const td = document.createElement("td");
            td.classList.add("border", "px-4", "py-2");
            if (index === 0) {
                td.innerText = student.name;
            } else if (index === 1) {
                td.innerText = student.age;
            } else if (index === 2) {
                td.innerText = student.isEnrolled ? "Yes" : "No";
            }
            tr.appendChild(td);
        }

        table.appendChild(tr);
    });
}


function studentsData() {
    
    return [
        {
            name: "Ethan",
            age: 25,
            isEnrolled: false,
            courses: ["Biology", "Chemistry"]
        }
        ,
        {
            name: "Sophia",
            age: 23,
            isEnrolled: true,
            courses: ["Math", "Physics"]
        },
        {
            name: "Noah",
            age: 24,
            isEnrolled: true,
            courses: ["English", "History"]
        },
        {
            name: "Olivia",
            age: 22,
            isEnrolled: false,
            courses: ["Art", "Music"]
        },
        {
            name: "Liam",
            age: 25,
            isEnrolled: true,
            courses: ["Computer Science", "Mathematics"]
        },
        {
            name: "Ava",
            age: 23,
            isEnrolled: true,
            courses: ["Psychology", "Sociology"]
        },
        {
            name: "Mason",
            age: 24,
            isEnrolled: false,
            courses: ["Economics", "Business"]
        },
        {
            name: "Isabella",
            age: 22,
            isEnrolled: true,
            courses: ["Literature", "Philosophy"]
        },
        {
            name: "Ethan2",
            age: 25,
            isEnrolled: true,
            courses: ["Physics", "Astronomy"]
        },
        {
            name: "Emma",
            age: 23,
            isEnrolled: false,
            courses: ["Geography", "Environmental Science"]
        },
        {
            name: "Benjamin",
            age: 24,
            isEnrolled: true,
            courses: ["Engineering", "Technology"]
        },
        {
            name: "Charlotte",
            age: 22,
            isEnrolled: true,
            courses: ["Medicine", "Biology"]
        },
        {
            name: "Lucas",
            age: 25,
            isEnrolled: false,
            courses: ["Law", "Politics"]
        },
        {
            name: "Amelia",
            age: 23,
            isEnrolled: true,
            courses: ["Dance", "Theater"]
        },
        {
            name: "Henry",
            age: 24,
            isEnrolled: true,
            courses: ["Nursing", "Health"]
        },
        {
            name: "Harper",
            age: 22,
            isEnrolled: false,
            courses: ["Nutrition", "Fitness"]
        },
        {
            name: "Alexander",
            age: 25,
            isEnrolled: true,
            courses: ["Geology", "Mineralogy"]
        },
        {
            name: "Evelyn",
            age: 23,
            isEnrolled: true,
            courses: ["Archaeology", "Anthropology"]
        },
        {
            name: "Michael",
            age: 24,
            isEnrolled: false,
            courses: ["Oceanography", "Marine Biology"]
        },
        {
            name: "Abigail",
            age: 22,
            isEnrolled: true,
            courses: ["Meteorology", "Climate Science"]
        },
        {
            name: "James",
            age: 25,
            isEnrolled: true,
            courses: ["Astronomy", "Astrophysics"]
        },
        {
            name: "Elizabeth",
            age: 23,
            isEnrolled: false,
            courses: ["Statistics", "Data Analysis"]
        },
        {
            name: "David",
            age: 24,
            isEnrolled: true,
            courses: ["Machine Learning", "AI"]
        },
        {
            name: "Mia",
            age: 22,
            isEnrolled: true,
            courses: ["Web Development", "UI/UX"]
        },
        {
            name: "Joseph",
            age: 25,
            isEnrolled: false,
            courses: ["Database Management", "SQL"]
        },
        {
            name: "Sofia",
            age: 23,
            isEnrolled: true,
            courses: ["Cloud Computing", "AWS"]
        },
        {
            name: "Thomas",
            age: 24,
            isEnrolled: true,
            courses: ["Cybersecurity", "Network Security"]
        },
        {
            name: "Ella",
            age: 22,
            isEnrolled: false,
            courses: ["Software Testing", "QA"]
        },
        {
            name: "Charles",
            age: 25,
            isEnrolled: true,
            courses: ["DevOps", "Docker"]
        },
        {
            name: "Scarlett",
            age: 23,
            isEnrolled: true,
            courses: ["Kubernetes", "Microservices"]
        },
        {
            name: "Christopher",
            age: 24,
            isEnrolled: false,
            courses: ["Game Development", "Unity"]
        },
        {
            name: "Victoria",
            age: 22,
            isEnrolled: true,
            courses: ["Mobile Development", "React Native"]
        },
        {
            name: "Daniel",
            age: 25,
            isEnrolled: true,
            courses: ["Full Stack Development", "MERN"]
        },
        {
            name: "Grace",
            age: 23,
            isEnrolled: false,
            courses: ["API Design", "REST"]
        },
        {
            name: "Matthew",
            age: 24,
            isEnrolled: true,
            courses: ["GraphQL", "Apollo"]
        },
        {
            name: "Chloe",
            age: 22,
            isEnrolled: true,
            courses: ["TypeScript", "JavaScript"]
        },
        {
            name: "Mark",
            age: 25,
            isEnrolled: false,
            courses: ["Python", "Django"]
        },
        {
            name: "Lily",
            age: 23,
            isEnrolled: true,
            courses: ["Flask", "FastAPI"]
        },
        {
            name: "Donald",
            age: 24,
            isEnrolled: true,
            courses: ["Java", "Spring Boot"]
        },
        {
            name: "Zoe",
            age: 22,
            isEnrolled: false,
            courses: ["C++", "C#"]
        },
        {
            name: "Steven",
            age: 25,
            isEnrolled: true,
            courses: ["Go", "Rust"]
        },
        {
            name: "Hannah",
            age: 23,
            isEnrolled: true,
            courses: ["Ruby", "Rails"]
        },
        {
            name: "Paul",
            age: 24,
            isEnrolled: false,
            courses: ["PHP", "Laravel"]
        },
        {
            name: "Nora",
            age: 22,
            isEnrolled: true,
            courses: ["Kotlin", "Android"]
        },
        {
            name: "Andrew",
            age: 25,
            isEnrolled: true,
            courses: ["Swift", "iOS"]
        },
        {
            name: "Penelope",
            age: 23,
            isEnrolled: false,
            courses: ["Objective-C", "macOS"]
        },
        {
            name: "Joshua",
            age: 24,
            isEnrolled: true,
            courses: ["Scala", "Spark"]
        },
        {
            name: "Aria",
            age: 22,
            isEnrolled: true,
            courses: ["Elixir", "Phoenix"]
        },
        {
            name: "Kevin",
            age: 25,
            isEnrolled: false,
            courses: ["Haskell", "Functional Programming"]
        },
        {
            name: "Lucy",
            age: 23,
            isEnrolled: true,
            courses: ["R", "Data Science"]
        },
        {
            name: "Brian",
            age: 24,
            isEnrolled: true,
            courses: ["MATLAB", "Simulation"]
        },
        {
            name: "Stella",
            age: 22,
            isEnrolled: false,
            courses: ["Blockchain", "Cryptocurrency"]
        },
        {
            name: "Edward",
            age: 25,
            isEnrolled: true,
            courses: ["Smart Contracts", "Solidity"]
        }
    ]
}