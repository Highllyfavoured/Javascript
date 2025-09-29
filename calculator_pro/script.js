/*
  Calculator script:
   - Keeps an expression string
   - Appends values safely (prevents weird operator sequences)
   - Converts infix -> RPN (shunting-yard) and evaluates RPN
   - Keyboard support
*/

const resultEl = document.getElementById('result');
const historyEl = document.getElementById('history');
const buttons = document.querySelectorAll('.buttons button');

let expression = '';    // current expression shown in the display (in JS-friendly operators: * and /)

function updateDisplay() {
  resultEl.textContent = expression || '0';
}

// small helpers
const isOperator = ch => ['+','-','*','/'].includes(ch);

// Append value with simple validation (no double operators, only one dot per number, etc.)
function appendValue(val) {
  if (val === undefined) return;
  // handle operator insertion rules
  if (isOperator(val)) {
    const last = expression.slice(-1);
    if (expression === '' && val !== '-') {
      // don't start with + * / — allow unary minus by typing '-'
      return;
    }
    if (isOperator(last)) {
      // replace last operator (e.g., user presses + then -)
      expression = expression.slice(0,-1) + val;
      updateDisplay();
      return;
    }
  }

  if (val === '.') {
    // prevent more than one decimal point in current number
    const lastOpIdx = Math.max(
      expression.lastIndexOf('+'),
      expression.lastIndexOf('-'),
      expression.lastIndexOf('*'),
      expression.lastIndexOf('/')
    );
    const currentNumber = expression.slice(lastOpIdx + 1);
    if (currentNumber.includes('.')) return;
    if (currentNumber === '') {
      // start decimal with 0.
      expression += '0';
    }
  }

  expression += val;
  updateDisplay();
}

// clear, backspace
function clearAll() {
  expression = '';
  historyEl.textContent = '';
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

// Evaluate expression using a safe parser (shunting-yard -> RPN -> eval)
function evaluateExpression(expr) {
  // Replace fancy chars if any
  expr = expr.replace(/\u00D7/g, '*').replace(/\u00F7/g, '/'); // just in case
  // Tokenize
  const tokens = tokenize(expr);
  const rpn = toRPN(tokens);
  const value = evalRPN(rpn);
  return formatNumber(value);
}

function calculate() {
  if (!expression) return;
  try {
    const displayedExpr = expression;
    const result = evaluateExpression(expression);
    historyEl.textContent = displayedExpr + ' =';
    expression = String(result);
    updateDisplay();
  } catch (err) {
    resultEl.textContent = 'Error';
    console.error(err);
    expression = '';
    setTimeout(updateDisplay, 1000);
  }
}

/* ========== Tokenizer ========== 
   Turns: "3+4*2/(1-5)"  -> ["3","+","4","*","2","/","(","1","-","5",")"]
   Also handles unary minus (e.g. "-3" or "2 * -3") and "-(3+2)".
*/
function tokenize(s){
  s = s.replace(/\s+/g,'');
  const tokens = [];
  for (let i = 0; i < s.length; ) {
    const ch = s[i];

    // Parentheses
    if (ch === '(' || ch === ')') {
      tokens.push(ch);
      i++;
      continue;
    }

    // Operators
    if (/[\+\-\*\/]/.test(ch)) {
      // handle unary minus:
      if (ch === '-' && (i === 0 || /[\+\-\*\/\(]/.test(s[i-1]))) {
        // if next is '(' -> convert "-(" into "0", "-", "(" so evaluator handles it:
        if (s[i+1] === '(') {
          tokens.push('0');
          tokens.push('-');
          i++;
          continue;
        }
        // else parse negative number like -3.14
        let j = i + 1;
        let num = '-';
        let dotCount = 0;
        while (j < s.length && /[0-9.]/.test(s[j])) {
          if (s[j] === '.') dotCount++;
          if (dotCount > 1) throw new Error('Invalid number with multiple dots');
          num += s[j++];
        }
        if (num === '-') {
          // standalone '-' (no number after) — treat as minus operator
          tokens.push('-');
          i++;
        } else {
          tokens.push(num);
          i = j;
        }
        continue;
      } else {
        // binary operator
        tokens.push(ch);
        i++;
        continue;
      }
    }

    // Number (digits + optional dot)
    if (/[0-9.]/.test(ch)) {
      let j = i;
      let num = '';
      let dotCount = 0;
      while (j < s.length && /[0-9.]/.test(s[j])) {
        if (s[j] === '.') dotCount++;
        if (dotCount > 1) throw new Error('Invalid number with multiple dots');
        num += s[j++];
      }
      tokens.push(num);
      i = j;
      continue;
    }

    throw new Error('Invalid character in expression: ' + ch);
  }
  return tokens;
}

/* ========== Infix -> RPN (Shunting-yard) ========== */
function toRPN(tokens) {
  const out = [];
  const ops = [];
  const prec = { '+':1, '-':1, '*':2, '/':2 };
  for (const t of tokens) {
    if (/^[-]?\d+(\.\d+)?$/.test(t)) {
      out.push(t);
    } else if (t in prec) {
      while (ops.length && (ops[ops.length-1] in prec) &&
             prec[ops[ops.length-1]] >= prec[t]) {
        out.push(ops.pop());
      }
      ops.push(t);
    } else if (t === '(') {
      ops.push(t);
    } else if (t === ')') {
      while (ops.length && ops[ops.length-1] !== '(') {
        out.push(ops.pop());
      }
      if (!ops.length) throw new Error('Mismatched parentheses');
      ops.pop(); // pop '('
    } else {
      throw new Error('Unknown token ' + t);
    }
  }
  while (ops.length) {
    const op = ops.pop();
    if (op === '(' || op === ')') throw new Error('Mismatched parentheses');
    out.push(op);
  }
  return out;
}

/* ========== Evaluate RPN ========== */
function evalRPN(rpn) {
  const stack = [];
  for (const t of rpn) {
    if (/^[-]?\d+(\.\d+)?$/.test(t)) {
      stack.push(parseFloat(t));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Invalid expression');
      let res;
      if (t === '+') res = a + b;
      else if (t === '-') res = a - b;
      else if (t === '*') res = a * b;
      else if (t === '/') {
        if (b === 0) throw new Error('Division by zero');
        res = a / b;
      } else throw new Error('Unknown operator ' + t);
      stack.push(res);
    }
  }
  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}

/* Format number to avoid long floating artifacts; keep up to 10 decimals and trim trailing zeros */
function formatNumber(n) {
  if (!isFinite(n)) throw new Error('Math error');
  // If integer -> show integer
  if (Math.abs(Math.round(n) - n) < 1e-12) return String(Math.round(n));
  // else round to 10 decimals safely
  const s = Number.parseFloat(n.toFixed(10)).toString();
  return s;
}

/* ========== Attach button listeners ========== */
buttons.forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const val = btn.dataset.value;
    const action = btn.dataset.action;
    if (action === 'clear') { clearAll(); return; }
    if (action === 'backspace') { backspace(); return; }
    if (action === 'equals') { calculate(); return; }
    if (val !== undefined) appendValue(val);
  });
});

/* ========== Keyboard support ========== */
document.addEventListener('keydown', (e) => {
  const k = e.key;
  if (/^[0-9]$/.test(k)) { appendValue(k); return; }
  if (k === '.' ) { appendValue('.'); return; }
  if (k === 'Enter' || k === '=') { e.preventDefault(); calculate(); return; }
  if (k === 'Backspace') { backspace(); return; }
  if (k === 'Escape') { clearAll(); return; }
  if (k === '+' || k === '-' || k === '*' || k === '/') { appendValue(k); return; }
  if (k === '(' || k === ')') { appendValue(k); return; }
  // support 'x' or 'X' as multiply
  if (k === 'x' || k === 'X') { appendValue('*'); return; }
});