// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Retrieve username from query or localStorage
let username = getQueryParam("username");

if (username) {
    // Save username in localStorage to persist it across pages
    localStorage.setItem("username", username);
} else {
    // Get username from localStorage if it exists
    username = localStorage.getItem("username");
}

// Update welcome message
const welcomeMessage = document.getElementById("welcomeMessage");
if (username) {
    welcomeMessage.innerText = `Welcome, ${username}!`;
} else {
    welcomeMessage.innerText = "Welcome!";
}

// Get Elements
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

// Retrieve transactions from localStorage
const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

// Add Transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "" || type.value === "") {
        alert("Please enter a valid transaction name, amount, and type.");
        return;
    }

    let enteredAmount = parseFloat(amount.value);
    if (isNaN(enteredAmount) || enteredAmount <= 0) {
        alert("Please enter a valid amount greater than zero.");
        return;
    }

    // Ensure expense is always stored as a negative value
    if (type.value === "expense") {
        enteredAmount = -Math.abs(enteredAmount);
    }

    const transaction = {
        id: generateID(),
        text: text.value,
        amount: enteredAmount,
        type: type.value
    };

    transactions.push(transaction);
    updateValues();
    updateLocalStorage();

    // Clear input fields after transaction is added
    text.value = "";
    amount.value = "";
    type.value = ""; // Reset the type selection
}

// Generate Random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Update Balance, Income, and Expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `+₹${income}`;
    money_minus.innerText = `-₹${expense}`;

    // Save balance to localStorage for syncing
    localStorage.setItem("balance", total);
}

// Update Local Storage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Sync Balance and Transactions from Local Storage
function syncBalance() {
    const storedBalance = localStorage.getItem("balance");
    if (storedBalance !== null) {
        balance.innerText = `₹${parseFloat(storedBalance).toFixed(2)}`;
    }
}

// Initialize App
function Init() {
    syncBalance();
    updateValues();
}

Init();

// Event Listener for Form Submission
form.addEventListener("submit", addTransaction);
