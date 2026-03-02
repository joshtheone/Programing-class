const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equalSign = document.querySelector(".equal-sign");
const clearBtn = document.querySelector(".clear-btn");
const decimalBtn = document.getElementById("decimal");
const deleteBtn = document.getElementById("delete");

const scientificButtons = document.querySelectorAll(".science-btn[data-action]");
const openParenBtn = document.getElementById("open-paren");
const closeParenBtn = document.getElementById("close-paren");
const angleToggleBtn = document.getElementById("angle-toggle");

const opScreen = document.getElementById("op");
const resultScreen = document.getElementById("result");

const OP_PRECEDENCE = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "%": 2,
  "^": 3,
};

const RIGHT_ASSOCIATIVE_OPS = new Set(["^"]);

let currentInput = "0";
let expressionTokens = [];
let awaitingNextNumber = false;
let justEvaluated = false;
let angleMode = "DEG";

clearAll();
updateAngleToggle();

numbers.forEach((number) => {
  number.addEventListener("click", () => {
    appendNumber(number.value);
  });
});

decimalBtn.addEventListener("click", appendDecimal);

operators.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.value === "+/-") {
      toggleSign();
      return;
    }

    setOperator(button.value);
  });
});

scientificButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleScientificAction(button.dataset.action);
  });
});

if (openParenBtn) {
  openParenBtn.addEventListener("click", insertOpenParen);
}

if (closeParenBtn) {
  closeParenBtn.addEventListener("click", insertCloseParen);
}

if (angleToggleBtn) {
  angleToggleBtn.addEventListener("click", toggleAngleMode);
}

equalSign.addEventListener("click", evaluate);
clearBtn.addEventListener("click", clearAll);
deleteBtn.addEventListener("click", deleteLast);

function appendNumber(value) {
  if (currentInput === "Error") {
    clearAll();
  }

  if (justEvaluated && expressionTokens.length === 0) {
    currentInput = value;
    justEvaluated = false;
    opScreen.textContent = "";
    renderResult();
    return;
  }

  if (awaitingNextNumber) {
    if (shouldImplicitMultiplyOnNextValue()) {
      expressionTokens.push("*");
    }
    currentInput = value;
    awaitingNextNumber = false;
  } else if (currentInput === "0") {
    currentInput = value;
  } else if (currentInput === "-0") {
    currentInput = `-${value}`;
  } else {
    currentInput += value;
  }

  justEvaluated = false;
  updateExpressionScreen();
  renderResult();
}

function appendDecimal() {
  if (currentInput === "Error") {
    clearAll();
  }

  if (justEvaluated && expressionTokens.length === 0) {
    currentInput = "0.";
    justEvaluated = false;
    opScreen.textContent = "";
    renderResult();
    return;
  }

  if (awaitingNextNumber) {
    if (shouldImplicitMultiplyOnNextValue()) {
      expressionTokens.push("*");
    }
    currentInput = "0.";
    awaitingNextNumber = false;
    justEvaluated = false;
    updateExpressionScreen();
    renderResult();
    return;
  }

  if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  justEvaluated = false;
  updateExpressionScreen();
  renderResult();
}

function setOperator(nextOperator) {
  if (currentInput === "Error") {
    return;
  }

  if (justEvaluated && expressionTokens.length === 0) {
    justEvaluated = false;
  }

  if (expressionTokens.length === 0 && currentInput === "0" && nextOperator === "-") {
    currentInput = "-0";
    updateExpressionScreen();
    renderResult();
    return;
  }

  if (awaitingNextNumber) {
    const lastIndex = expressionTokens.length - 1;
    const lastToken = expressionTokens[lastIndex];

    if (lastToken === "(" && nextOperator === "-") {
      currentInput = "-0";
      awaitingNextNumber = false;
      updateExpressionScreen();
      renderResult();
      return;
    }

    if (lastIndex >= 0 && isOperator(lastToken)) {
      expressionTokens[lastIndex] = nextOperator;
    } else if (lastToken !== "(") {
      expressionTokens.push(nextOperator);
    }

    updateExpressionScreen();
    renderResult();
    return;
  }

  expressionTokens.push(currentInput);
  expressionTokens.push(nextOperator);
  awaitingNextNumber = true;
  justEvaluated = false;

  updateExpressionScreen();
  renderResult();
}

function evaluate() {
  if (currentInput === "Error") {
    return;
  }

  if (awaitingNextNumber && expressionTokens.length > 0 && isOperator(expressionTokens[expressionTokens.length - 1])) {
    expressionTokens.pop();
    awaitingNextNumber = false;
  }

  let tokens = awaitingNextNumber ? [...expressionTokens] : [...expressionTokens, currentInput];

  if (tokens.length === 0) {
    opScreen.textContent = `${currentInput} =`;
    justEvaluated = true;
    renderResult();
    return;
  }

  const parenBalance = getParenBalance(tokens);
  if (parenBalance < 0) {
    showError();
    return;
  }

  for (let i = 0; i < parenBalance; i += 1) {
    tokens.push(")");
  }

  const result = evaluateExpression(tokens);
  if (result === null) {
    showError();
    return;
  }

  opScreen.textContent = `${tokens.join(" ")} =`;
  currentInput = formatNumber(result);
  expressionTokens = [];
  awaitingNextNumber = false;
  justEvaluated = true;
  renderResult();
}

function toggleSign() {
  if (currentInput === "Error") {
    return;
  }

  if (awaitingNextNumber) {
    currentInput = "-0";
    awaitingNextNumber = false;
  } else if (currentInput.startsWith("-")) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = `-${currentInput}`;
  }

  if (justEvaluated && expressionTokens.length === 0) {
    justEvaluated = false;
    opScreen.textContent = "";
  }

  updateExpressionScreen();
  renderResult();
}

function deleteLast() {
  if (currentInput === "Error") {
    clearAll();
    return;
  }

  if (justEvaluated && expressionTokens.length === 0) {
    justEvaluated = false;
    opScreen.textContent = "";
  }

  if (awaitingNextNumber) {
    if (expressionTokens.length === 0) {
      awaitingNextNumber = false;
      return;
    }

    const removed = expressionTokens.pop();

    if (isOperator(removed) && expressionTokens.length > 0 && isNumericToken(expressionTokens[expressionTokens.length - 1])) {
      currentInput = expressionTokens.pop();
      awaitingNextNumber = false;
    } else {
      currentInput = "0";
      awaitingNextNumber = expressionTokens.length > 0;
    }

    updateExpressionScreen();
    renderResult();
    return;
  }

  if (currentInput.length <= 1 || currentInput === "-0") {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "-") {
      currentInput = "0";
    }
  }

  updateExpressionScreen();
  renderResult();
}

function insertOpenParen() {
  if (currentInput === "Error") {
    clearAll();
  }

  if (justEvaluated && expressionTokens.length === 0) {
    justEvaluated = false;
    opScreen.textContent = "";
    currentInput = "0";
  }

  if (awaitingNextNumber) {
    if (shouldImplicitMultiplyOnNextValue()) {
      expressionTokens.push("*");
    }
    expressionTokens.push("(");
  } else if (expressionTokens.length === 0 && currentInput === "0") {
    expressionTokens.push("(");
  } else {
    expressionTokens.push(currentInput);
    expressionTokens.push("*");
    expressionTokens.push("(");
  }

  awaitingNextNumber = true;
  currentInput = "0";
  updateExpressionScreen();
  renderResult();
}

function insertCloseParen() {
  if (currentInput === "Error") {
    return;
  }

  if (getParenBalance(expressionTokens) <= 0) {
    return;
  }

  if (awaitingNextNumber) {
    const lastToken = expressionTokens[expressionTokens.length - 1];
    if (lastToken === "(" || isOperator(lastToken)) {
      return;
    }
  }

  if (!awaitingNextNumber) {
    expressionTokens.push(currentInput);
  }

  expressionTokens.push(")");
  awaitingNextNumber = true;
  justEvaluated = false;
  updateExpressionScreen();
  renderResult();
}

function handleScientificAction(action) {
  if (!action || currentInput === "Error") {
    return;
  }

  if (awaitingNextNumber) {
    const lastToken = expressionTokens[expressionTokens.length - 1];
    if (lastToken === ")") {
      const collapsedValue = evaluateTokensWithAutoClose(expressionTokens);
      if (collapsedValue === null) {
        showError();
        return;
      }
      currentInput = formatNumber(collapsedValue);
      expressionTokens = [];
    } else {
      currentInput = "0";
    }
    awaitingNextNumber = false;
  }

  if (action === "const-pi") {
    insertConstant(Math.PI);
    return;
  }

  if (action === "const-e") {
    insertConstant(Math.E);
    return;
  }

  const value = Number(currentInput);
  if (!Number.isFinite(value)) {
    showError();
    return;
  }

  let result = null;

  switch (action) {
    case "square":
      result = value ** 2;
      break;
    case "sqrt":
      if (value < 0) {
        showError();
        return;
      }
      result = Math.sqrt(value);
      break;
    case "reciprocal":
      if (value === 0) {
        showError();
        return;
      }
      result = 1 / value;
      break;
    case "sin":
      result = Math.sin(toRadians(value));
      break;
    case "cos":
      result = Math.cos(toRadians(value));
      break;
    case "tan":
      result = Math.tan(toRadians(value));
      break;
    case "ln":
      if (value <= 0) {
        showError();
        return;
      }
      result = Math.log(value);
      break;
    case "log":
      if (value <= 0) {
        showError();
        return;
      }
      result = Math.log10(value);
      break;
    default:
      return;
  }

  if (!Number.isFinite(result)) {
    showError();
    return;
  }

  currentInput = formatNumber(result);
  awaitingNextNumber = false;
  justEvaluated = false;
  updateExpressionScreen();
  renderResult();
}

function insertConstant(value) {
  const constantValue = formatNumber(value);

  if (justEvaluated && expressionTokens.length === 0) {
    justEvaluated = false;
    opScreen.textContent = "";
  }

  if (awaitingNextNumber) {
    if (shouldImplicitMultiplyOnNextValue()) {
      expressionTokens.push("*");
    }
    currentInput = constantValue;
    awaitingNextNumber = false;
  } else if ((currentInput === "0" || currentInput === "-0") && expressionTokens.length === 0) {
    currentInput = currentInput.startsWith("-") ? formatNumber(-value) : constantValue;
  } else {
    expressionTokens.push(currentInput);
    expressionTokens.push("*");
    currentInput = constantValue;
  }

  updateExpressionScreen();
  renderResult();
}

function toggleAngleMode() {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  updateAngleToggle();
}

function updateAngleToggle() {
  if (angleToggleBtn) {
    angleToggleBtn.textContent = angleMode;
  }
}

function clearAll() {
  currentInput = "0";
  expressionTokens = [];
  awaitingNextNumber = false;
  justEvaluated = false;
  opScreen.textContent = "";
  renderResult();
}

function evaluateExpression(tokens) {
  const outputQueue = [];
  const operatorStack = [];

  for (const token of tokens) {
    if (isNumericToken(token)) {
      outputQueue.push(token);
      continue;
    }

    if (isOperator(token)) {
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];

        if (!isOperator(top)) {
          break;
        }

        const tokenPrecedence = OP_PRECEDENCE[token];
        const topPrecedence = OP_PRECEDENCE[top];
        const shouldPop = RIGHT_ASSOCIATIVE_OPS.has(token)
          ? tokenPrecedence < topPrecedence
          : tokenPrecedence <= topPrecedence;

        if (!shouldPop) {
          break;
        }

        outputQueue.push(operatorStack.pop());
      }

      operatorStack.push(token);
      continue;
    }

    if (token === "(") {
      operatorStack.push(token);
      continue;
    }

    if (token === ")") {
      let foundLeftParen = false;

      while (operatorStack.length > 0) {
        const top = operatorStack.pop();
        if (top === "(") {
          foundLeftParen = true;
          break;
        }
        outputQueue.push(top);
      }

      if (!foundLeftParen) {
        return null;
      }
      continue;
    }

    return null;
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop();
    if (top === "(" || top === ")") {
      return null;
    }
    outputQueue.push(top);
  }

  return evaluateRpn(outputQueue);
}

function evaluateRpn(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (isNumericToken(token)) {
      stack.push(Number(token));
      continue;
    }

    if (!isOperator(token) || stack.length < 2) {
      return null;
    }

    const rightValue = stack.pop();
    const leftValue = stack.pop();
    const result = calculate(leftValue, rightValue, token);

    if (result === null || !Number.isFinite(result)) {
      return null;
    }

    stack.push(result);
  }

  if (stack.length !== 1 || !Number.isFinite(stack[0])) {
    return null;
  }

  return stack[0];
}

function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? null : a / b;
    case "%":
      return b === 0 ? null : a % b;
    case "^":
      return a ** b;
    default:
      return null;
  }
}

function updateExpressionScreen() {
  if (expressionTokens.length === 0) {
    if (!justEvaluated) {
      opScreen.textContent = "";
    }
    return;
  }

  if (awaitingNextNumber) {
    opScreen.textContent = expressionTokens.join(" ");
    return;
  }

  opScreen.textContent = [...expressionTokens, currentInput].join(" ");
}

function renderResult() {
  resultScreen.textContent = currentInput;
}

function showError() {
  currentInput = "Error";
  expressionTokens = [];
  awaitingNextNumber = false;
  justEvaluated = false;
  opScreen.textContent = "";
  renderResult();
}

function isOperator(value) {
  return value === "+" || value === "-" || value === "*" || value === "/" || value === "%" || value === "^";
}

function isNumericToken(value) {
  if (value === undefined || value === null || value === "" || isOperator(value) || value === "(" || value === ")") {
    return false;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue);
}

function getParenBalance(tokens) {
  let balance = 0;

  for (const token of tokens) {
    if (token === "(") {
      balance += 1;
    } else if (token === ")") {
      balance -= 1;
    }
  }

  return balance;
}

function shouldImplicitMultiplyOnNextValue() {
  return awaitingNextNumber && expressionTokens.length > 0 && expressionTokens[expressionTokens.length - 1] === ")";
}

function evaluateTokensWithAutoClose(tokens) {
  const candidateTokens = [...tokens];
  const balance = getParenBalance(candidateTokens);

  if (balance < 0) {
    return null;
  }

  for (let i = 0; i < balance; i += 1) {
    candidateTokens.push(")");
  }

  return evaluateExpression(candidateTokens);
}

function toRadians(value) {
  return angleMode === "DEG" ? (value * Math.PI) / 180 : value;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded = Math.round((value + Number.EPSILON) * 1e12) / 1e12;
  const normalized = Object.is(rounded, -0) ? 0 : rounded;
  return Number(normalized.toString()).toString();
}
