// const calculatorScreen = document.querySelector('.calculator-screen');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equalSign = document.querySelector('.equal-sign');
const clearBtn = document.querySelector('.clear-btn');
const decimalBtn = document.getElementById('decimal');

const opScreen = document.getElementById('op');
const resultScreen = document.getElementById('result');

let currentInput = '';
let operator = null;
let firstOperand = null;
let opValue = '';
let resultValue = 0;

numbers.forEach(number => {
    number.addEventListener('click', () => {
        currentInput += number.value;
        // calculatorScreen.value = currentInput;
        updateOpScreen(number.value);
    });
});

decimalBtn.addEventListener('click', () => {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        // calculatorScreen.value = currentInput;
        updateOpScreen('.');
    }
});

operators.forEach(op => {
    op.addEventListener('click', () => {
        if (currentInput === '') return;
        if (firstOperand === null) {
            firstOperand = parseFloat(currentInput);
        }

        operator = op.value;
        currentInput = '';
        updateOpScreen(` ${op.value} `);
    });
});

equalSign.addEventListener('click', () => {

    console.log(currentInput, operator, firstOperand);
    if (currentInput === '' || operator === null || firstOperand === null) return;
    const secondOperand = parseFloat(currentInput);
    let result;
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            result = firstOperand / secondOperand;
            break;
    }

    console.log(result);
    // calculatorScreen.value = result;
    resultScreen.textContent = `= ${result}`;
    currentInput = result.toString();
    resultValue = result;
    operator = null;
    firstOperand = null;
    opValue = '';
});

clearBtn.addEventListener('click', () => {
    currentInput = '';
    operator = null;
    firstOperand = null;
    // calculatorScreen.value = '0';
});

function updateOpScreen(value) {
    if(resultValue !== 0) {
        if(!opValue.includes("ANS")) {
            opValue = "ANS" + opValue;
        }
    }
    opValue += value;
    opScreen.textContent = opValue;
}