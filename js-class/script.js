const calculatorScreen = document.querySelector('.calculator-screen');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equalSign = document.querySelector('.equal-sign');
const clearBtn = document.querySelector('.clear-btn');
const decimalBtn = document.getElementById('decimal');

let currentInput = '';
let operator = null;
let firstOperand = null;

numbers.forEach(number => {
    number.addEventListener('click', () => {
        currentInput += number.value;
        calculatorScreen.value = currentInput;
    });
});

decimalBtn.addEventListener('click', () => {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        calculatorScreen.value = currentInput;
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
    calculatorScreen.value = result;
    currentInput = result.toString();
    operator = null;
    firstOperand = null;
});

clearBtn.addEventListener('click', () => {
    currentInput = '';
    operator = null;
    firstOperand = null;
    calculatorScreen.value = '0';
}); 