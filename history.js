// Get Elements
const incomeList = document.getElementById("income-list");
const expenseList = document.getElementById("expense-list");
const clearHistoryBtn = document.getElementById("clear-history");

// Retrieve transactions from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Display Transactions
function displayTransactions() {
    incomeList.innerHTML = "";
    expenseList.innerHTML = "";

    transactions.forEach((transaction) => {
        const li = document.createElement("li");
        li.textContent = `${transaction.text}: ₹${Math.abs(transaction.amount).toFixed(2)}`;

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = () => deleteTransaction(transaction.id);

        li.appendChild(deleteBtn);

        if (transaction.amount > 0) {
            li.classList.add("plus");
            incomeList.appendChild(li);
        } else {
            li.classList.add("minus");
            expenseList.appendChild(li);
        }
    });
}

// Delete Single Transaction
function deleteTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateLocalStorage();
    displayTransactions();
}

// Clear All Transactions
function clearHistory() {
    if (confirm("Are you sure you want to clear the transaction history?")) {
        transactions = [];
        localStorage.removeItem("transactions"); // Clear from localStorage
        displayTransactions(); // Update UI
    }
}

// Update Local Storage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize
displayTransactions();

// Event Listeners
clearHistoryBtn.addEventListener("click", clearHistory);
