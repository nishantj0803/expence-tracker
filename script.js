const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const weeklyTotalElement = document.getElementById('weekly-total');
const monthlyTotalElement = document.getElementById('monthly-total');
const yearlyTotalElement = document.getElementById('yearly-total');
const themeToggleButton = document.getElementById('theme-toggle');

let expenses = [];

// Event listener for theme toggle button
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark'); // Toggle the dark class on body
    // Change button text based on theme
    if (document.body.classList.contains('dark')) {
        themeToggleButton.textContent = 'Switch to Light Theme';
    } else {
        themeToggleButton.textContent = 'Switch to Dark Theme';
    }
});

// Event listener for form submission
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = new Date(document.getElementById('date').value);
    const description = document.getElementById('description').value;

    // Create expense object and add to expenses array
    const expense = { amount, category, date, description };
    expenses.push(expense);

    // Save to local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update the expense list display and totals
    displayExpenses();
    calculateTotals();
    expenseForm.reset(); // Clear the form inputs
});

function displayExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const expenseItem = document.createElement('div');
        expenseItem.innerHTML = `
            <p>${expense.date} - ${expense.category}: ${expense.amount}</p>
            <p>${expense.description}</p>
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(expenseItem);
    });
}

function calculateTotals() {
    const today = new Date();
    let weeklyTotal = 0;
    let monthlyTotal = 0;
    let yearlyTotal = 0;

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        
        // Total for the week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        if (expenseDate >= oneWeekAgo) {
            weeklyTotal += expense.amount;
        }

        // Total for the month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        if (expenseDate >= firstDayOfMonth) {
            monthlyTotal += expense.amount;
        }

        // Total for the year
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        if (expenseDate >= firstDayOfYear) {
            yearlyTotal += expense.amount;
        }
    });

    // Update total expenses display
    weeklyTotalElement.textContent = `Total This Week: ₹${weeklyTotal.toFixed(2)}`;
    monthlyTotalElement.textContent = `Total This Month: ₹${monthlyTotal.toFixed(2)}`;
    yearlyTotalElement.textContent = `Total This Year: ₹${yearlyTotal.toFixed(2)}`;
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    calculateTotals();
}

// Load saved expenses from local storage on page load
window.onload = function() {
    expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    displayExpenses();
    calculateTotals();
};
