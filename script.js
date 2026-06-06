/* ==================================================
   CodSoft Calculator
   Professional Internship Project
   Author: Your Name
================================================== */

// ======================================
// DOM ELEMENTS
// ======================================

const display = document.getElementById("display");
const historyList = document.getElementById("historyList");

const buttons = document.querySelectorAll(".btn, .equal");

// ======================================
// VARIABLES
// ======================================

let currentInput = "";
let history = [];

const MAX_HISTORY = 10;

// ======================================
// DISPLAY FUNCTIONS
// ======================================

function updateDisplay(value) {
    display.textContent = value || "0";
}

// ======================================
// UTILITY FUNCTIONS
// ======================================

function isOperator(char) {
    return ["+", "-", "*", "/", "%"].includes(char);
}

function getLastNumber() {
    const parts = currentInput.split(/[+\-*/%]/);
    return parts[parts.length - 1];
}

// ======================================
// DECIMAL VALIDATION
// ======================================

function canAddDecimal() {
    const lastNumber = getLastNumber();
    return !lastNumber.includes(".");
}

// ======================================
// HISTORY FUNCTIONS
// ======================================

function addToHistory(expression, result) {

    const historyRecord = `
        <strong>${expression}</strong>
        <span>= ${result}</span>
    `;

    history.unshift(historyRecord);

    if (history.length > MAX_HISTORY) {
        history.pop();
    }

    renderHistory();
}

function renderHistory() {

    historyList.innerHTML = "";

    history.forEach(item => {

        const li = document.createElement("li");

        li.innerHTML = item;

        historyList.appendChild(li);
    });
}

// ======================================
// CLEAR DISPLAY
// ======================================

function clearDisplay() {
    currentInput = "";
    updateDisplay("0");
}

// ======================================
// DELETE LAST CHARACTER
// ======================================

function deleteLastCharacter() {

    currentInput = currentInput.slice(0, -1);

    updateDisplay(currentInput);
}

// ======================================
// APPEND INPUT
// ======================================

function appendValue(value) {

    // Prevent multiple decimals
    if (value === ".") {

        if (!canAddDecimal()) {
            return;
        }
    }

    const lastChar = currentInput.slice(-1);

    // Replace repeated operators
    if (
        isOperator(lastChar) &&
        isOperator(value)
    ) {

        currentInput =
            currentInput.slice(0, -1) + value;

        updateDisplay(currentInput);

        return;
    }

    currentInput += value;

    updateDisplay(currentInput);
}

// ======================================
// DIVISION BY ZERO CHECK
// ======================================

function hasDivisionByZero(expression) {

    return /\/0(?!\.)/.test(expression);
}

// ======================================
// CALCULATE RESULT
// ======================================

function calculateResult() {

    try {

        if (!currentInput) return;

        // Remove ending operator
        if (
            isOperator(
                currentInput[currentInput.length - 1]
            )
        ) {

            currentInput =
                currentInput.slice(0, -1);
        }

        if (!currentInput) {
            updateDisplay("0");
            return;
        }

        // Division by zero
        if (
            hasDivisionByZero(currentInput)
        ) {

            throw new Error(
                "Cannot divide by zero"
            );
        }

        // Convert percentage
        let expression =
            currentInput.replace(
                /(\d+)%/g,
                "($1/100)"
            );

        let result = eval(expression);

        if (
            result === Infinity ||
            result === -Infinity
        ) {

            throw new Error(
                "Cannot divide by zero"
            );
        }

        if (Number.isNaN(result)) {

            throw new Error(
                "Invalid Expression"
            );
        }

        // Limit long decimals
        if (
            typeof result === "number"
        ) {

            result =
                parseFloat(
                    result.toFixed(10)
                );
        }

        addToHistory(
            currentInput,
            result
        );

        currentInput =
            result.toString();

        updateDisplay(currentInput);

    } catch (error) {

        updateDisplay(
            error.message ||
            "Invalid Expression"
        );

        currentInput = "";
    }
}

// ======================================
// BUTTON CLICK EVENTS
// ======================================

buttons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const value =
                button.dataset.value;

            switch (value) {

                case "C":
                    clearDisplay();
                    break;

                case "⌫":
                    deleteLastCharacter();
                    break;

                case "=":
                    calculateResult();
                    break;

                default:
                    appendValue(value);
            }
        }
    );
});

// ======================================
// KEYBOARD SUPPORT
// ======================================

document.addEventListener(
    "keydown",
    event => {

        const key = event.key;

        // Numbers
        if (
            /^[0-9]$/.test(key)
        ) {

            appendValue(key);
            return;
        }

        // Operators
        if (
            ["+", "-", "*", "/", "%"]
            .includes(key)
        ) {

            appendValue(key);
            return;
        }

        // Decimal
        if (key === ".") {

            appendValue(".");
            return;
        }

        // Enter
        if (key === "Enter") {

            event.preventDefault();

            calculateResult();

            return;
        }

        // Backspace
        if (key === "Backspace") {

            deleteLastCharacter();

            return;
        }

        // Delete
        if (key === "Delete") {

            clearDisplay();

            return;
        }

        // Escape
        if (key === "Escape") {

            clearDisplay();

            return;
        }
    }
);

// ======================================
// HISTORY CLICK TO REUSE CALCULATION
// ======================================

historyList.addEventListener(
    "click",
    function (event) {

        const clickedItem =
            event.target.closest("li");

        if (!clickedItem) return;

        const expression =
            clickedItem
                .querySelector("strong")
                .textContent;

        currentInput = expression;

        updateDisplay(currentInput);
    }
);

// ======================================
// STARTUP ANIMATION
// ======================================

window.addEventListener(
    "load",
    () => {

        display.style.opacity = "0";

        setTimeout(() => {

            display.style.transition =
                "0.5s ease";

            display.style.opacity = "1";

        }, 100);
    }
);

// ======================================
// INITIAL DISPLAY
// ======================================

updateDisplay("0");