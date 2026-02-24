var toggle = document.getElementById('menu-toggle');
var sideBar = document.getElementById('side-bar');
sideBar.style.left = '-250px';

toggle.addEventListener('click', toggleMenu);

function toggleMenu() {
    var position = sideBar.style.left;
    if(position === '0px') {
        sideBar.style.left = '-250px';
    } else {
        sideBar.style.left = '0px';
    }
}

const table = document.getElementById("produceTable");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProduce = produceData().filter(student => student.name.toLowerCase().includes(searchTerm));

    // Clear existing table rows
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    showProduce(filteredProduce);
});

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProduce = produceData().filter(produce => produce.name.toLowerCase().includes(searchTerm));

     // Clear existing table rows
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    showProduce(filteredProduce);
});

showProduce(produceData());


function showProduce(produce) {
    produce.forEach(produce => {

        const tr = document.createElement("tr");

        for (let index = 0; index < 3; index++) {
            const td = document.createElement("td");
            if (index === 0) {
                td.innerText = produce.name;
            } else if (index === 1) {
                td.innerText = produce.quantity;
            } else if (index === 2) {
                td.innerText = produce.price ;
            }
            tr.appendChild(td);
        }

         table.appendChild(tr);
    });
}

function produceData() {
    return [
        {
            name: "tomatoes",
            quantity: 10,
            price: ["2000"]
        }
        ,
        {
            name: "carrots",
            quantity: 10,
            price: ["5000"]
        },
        {
            name: "onions",
            quantity: 10,
            price: ["3000"]
        },
        {
            name: "garlic",
            quantity: 10,
            price: ["4000"]
        },
        {
            name: "bellpeppers",
            quantity: 10,
            price: ["6000"]
        },
        {
            name: "potatoes",
            quantity: 10,
            price: ["5000"]
        },
        {
            name: "cabbage",
            quantity:"1",
            price: ["3000"]
        },
        {
            name: "spinach",
            quantity: "bunch",
            price: ["3000"]
        },
        {
            name: "broccoli",
            quantity: "10",
            price: ["8000"]
        },
    ]
}   

//Loop

// For loop
for (let i = 1; i <= 10; i++) {
    console.log(i);
}

// for (let i = 0; i < produce.length; i++) {
//     console.log("name:" + produce[i].name + " quantity:" + produce[i].quantity + "price:" + produce[i].price );
// }

// Foreach loop
// produce.forEach(produce => {
//     console.log("name:" + produce.name + " quantity:" + produce.quantity + " price:" + produce.price);
// });


//Events
// document.getElementById("searchBtn").addEventListener("click", function() {
//     let value = document.getElementById("searchInput").value;
//     document.getElementById("result").textContent = "You searched for: " + value;
// });

        




 