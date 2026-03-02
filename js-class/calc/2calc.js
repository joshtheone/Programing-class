// BODMAS-capable calculator using shunting-yard (to RPN) and RPN evaluation
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const parens = document.querySelectorAll('.paren');
const equalSign = document.querySelector('.equal-sign');
const clearBtn = document.querySelector('.clear-btn');
const decimalBtn = document.getElementById('decimal');
const delBtn = document.getElementById('del');
const percentBtn = document.getElementById('percent');
const plusminusBtn = document.getElementById('plusminus');

const opScreen = document.getElementById('op');
const resultScreen = document.getElementById('result');
const historyEl = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clear-history');

let expr = '';
let history = [];

function updateDisplay() {
    opScreen.textContent = expr || '0';
    resultScreen.textContent = '';
}

function saveHistory() {
    try { localStorage.setItem('calc_history', JSON.stringify(history)); } catch (e) { }
}

function loadHistory() {
    try {
        const raw = localStorage.getItem('calc_history');
        if (raw) history = JSON.parse(raw).slice(0, 50);
    } catch (e) { history = []; }
}

function renderHistory() {
    if (!historyEl) return;
    historyEl.innerHTML = '';
    for (let i = history.length - 1; i >= 0; i--) {
        const it = history[i];
        const div = document.createElement('div');
        div.className = 'py-0.5 cursor-pointer hover:underline';
        div.textContent = `${it.expr} = ${it.result}`;
        div.addEventListener('click', () => {
            expr = it.expr;
            updateDisplay();
            resultScreen.textContent = `= ${it.result}`;
        });
        historyEl.appendChild(div);
    }
}

function appendNumber(v) {
    if (expr === '' || /[+\-*/^\(\s]$/.test(expr)) expr += v;
    else expr += v;
    updateDisplay();
}

function appendOperator(op) {
    expr = expr.trim();
    if (expr === '' && op === '-') { expr = '-'; updateDisplay(); return; }
    if (expr === '') return;
    if (/[+\-*/^]$/.test(expr)) {
        expr = expr.slice(0, -1) + op;
    } else {
        expr += ' ' + op + ' ';
    }
    updateDisplay();
}

function appendParen(p) {
    // '(' can be appended after operator or at start. ')' only if there's unmatched '('
    if (p === '(') {
        if (expr === '' || /[+\-*/^\(\s]$/.test(expr)) expr += p;
        else expr += ' ' + p + ' ';
    } else {
        expr = expr.trim();
        expr += ' ' + p + ' ';
    }
    updateDisplay();
}

numbers.forEach(b => b.addEventListener('click', () => appendNumber(b.value)));
operators.forEach(b => b.addEventListener('click', () => appendOperator(b.value)));
parens.forEach(b => b.addEventListener('click', () => appendParen(b.value)));

decimalBtn.addEventListener('click', () => {
    const parts = expr.split(/\s+/);
    const last = parts[parts.length - 1] || '';
    if (!last.includes('.')) {
        if (last === '' || /[+\-*/^\(]/.test(last)) expr += '0.';
        else expr += '.';
        updateDisplay();
    }
});

clearBtn.addEventListener('click', () => { expr = ''; updateDisplay(); resultScreen.textContent = ''; });

delBtn.addEventListener('click', () => {
    if (!expr) return;
    if (expr.endsWith(' ')) expr = expr.slice(0, -3);
    else expr = expr.slice(0, -1);
    updateDisplay();
});

percentBtn.addEventListener('click', () => {
    // treat percent as postfix operator: convert last number to percent when evaluated
    expr = expr.trim();
    if (expr === '') return;
    // if last token is a number, append % directly
    const parts = expr.split(/\s+/);
    const last = parts[parts.length - 1];
    if (last && !isNaN(last) && !last.includes('%')) expr += '%';
    updateDisplay();
});

plusminusBtn.addEventListener('click', () => {
    // toggle sign of last number token
    const parts = expr.split(/\s+/);
    const last = parts.pop() || '';
    if (last === '') return;
    if (!isNaN(last)) {
        const toggled = String(parseFloat(last) * -1);
        parts.push(toggled);
        expr = parts.join(' ');
        updateDisplay();
    } else {
        // if last is operator, do nothing
        parts.push(last);
    }
});

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        saveHistory();
        renderHistory();
    });
}

// load and render history at startup
loadHistory();
renderHistory();

equalSign.addEventListener('click', () => {
    try {
        const tokens = tokenize(expr);
        const rpn = toRPN(tokens);
        const val = evalRPN(rpn);
        resultScreen.textContent = `= ${val}`;
        // push to history and persist
        history.push({ expr: expr || String(val), result: val });
        if (history.length > 50) history.shift();
        saveHistory();
        renderHistory();
        expr = String(val);
        updateDisplay();
    } catch (e) {
        resultScreen.textContent = 'Error';
    }
});

function tokenize(s) {
    s = (s || '').trim();
    if (s === '') return [];
    const tokens = [];
    let i = 0;
    while (i < s.length) {
        const ch = s[i];
        if (ch === ' ') { i++; continue; }
        if ((ch >= '0' && ch <= '9') || ch === '.') {
            let num = ch; i++;
            while (i < s.length && ((s[i] >= '0' && s[i] <= '9') || s[i] === '.')) num += s[i++];
            tokens.push(num);
            continue;
        }
        if (ch === '+' || ch === '*' || ch === '/' || ch === '^') { tokens.push(ch); i++; continue; }
        if (ch === '-') {
            const prev = tokens.length ? tokens[tokens.length - 1] : null;
            if (!prev || prev === '+' || prev === '-' || prev === '*' || prev === '/' || prev === '^' || prev === '(') {
                // unary minus -> read number
                let num = '-'; i++;
                while (i < s.length && ((s[i] >= '0' && s[i] <= '9') || s[i] === '.')) num += s[i++];
                if (num === '-') tokens.push('-'); else tokens.push(num);
            } else { tokens.push('-'); i++; }
            continue;
        }
        if (ch === '(' || ch === ')') { tokens.push(ch); i++; continue; }
        if (ch === '%') { tokens.push('%'); i++; continue; }
        throw new Error('Invalid char');
    }
    return tokens;
}

function toRPN(tokens) {
    const out = [];
    const ops = [];
    const prec = { '+': 2, '-': 2, '*': 3, '/': 3, '^': 4 };
    const assoc = { '+': 'left', '-': 'left', '*': 'left', '/': 'left', '^': 'right' };
    tokens.forEach(tok => {
        if (!isNaN(tok)) out.push(tok);
        else if (tok === '%') {
            out.push(tok); // postfix unary percent -> send to output
        } else if (tok === '(') {
            ops.push(tok);
        } else if (tok === ')') {
            while (ops.length && ops[ops.length - 1] !== '(') out.push(ops.pop());
            if (ops.length && ops[ops.length - 1] === '(') ops.pop();
            else throw new Error('Mismatched parentheses');
        } else if (tok in prec) {
            while (ops.length && (ops[ops.length - 1] in prec) && ((assoc[tok] === 'left' && prec[ops[ops.length - 1]] >= prec[tok]) || (assoc[tok] === 'right' && prec[ops[ops.length - 1]] > prec[tok]))) {
                out.push(ops.pop());
            }
            ops.push(tok);
        } else throw new Error('Unknown token');
    });
    while (ops.length) {
        const op = ops.pop();
        if (op === '(' || op === ')') throw new Error('Mismatched parentheses');
        out.push(op);
    }
    return out;
}

function evalRPN(rpn) {
    const stack = [];
    rpn.forEach(tok => {
        if (!isNaN(tok)) stack.push(parseFloat(tok));
        else if (tok === '%') {
            const a = stack.pop();
            if (a === undefined) throw new Error('Invalid');
            stack.push(a / 100);
        } else {
            const b = stack.pop();
            const a = stack.pop();
            if (a === undefined || b === undefined) throw new Error('Invalid');
            let res;
            if (tok === '+') res = a + b;
            else if (tok === '-') res = a - b;
            else if (tok === '*') res = a * b;
            else if (tok === '/') {
                if (b === 0) throw new Error('Div by zero');
                res = a / b;
            } else if (tok === '^') {
                res = Math.pow(a, b);
            }
            stack.push(res);
        }
    });
    if (stack.length !== 1) throw new Error('Invalid eval');
    return stack[0];
}

updateDisplay();