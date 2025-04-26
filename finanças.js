document.addEventListener('DOMContentLoaded', () => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let chart = null;

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Form elements
    const transactionForm = document.getElementById('transactionForm');
    const transactionsList = document.getElementById('transactionsList');

    // Initialize chart
    function initChart() {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        const monthlyData = getMonthlyData();

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthlyData.labels,
                datasets: [
                    {
                        label: 'Receitas',
                        data: monthlyData.incomes,
                        backgroundColor: 'rgba(39, 174, 96, 0.5)',
                        borderColor: 'rgba(39, 174, 96, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Despesas',
                        data: monthlyData.expenses,
                        backgroundColor: 'rgba(231, 76, 60, 0.5)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 500 // Smooth animation
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }

    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    transactionForm.addEventListener('submit', handleTransaction);

    // Initialize
    updateUI();
    initChart();

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update chart colors if chart exists
        if (window.currentChart) {
            updateChartColors();
        }
    }

    function updateChartColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#ecf0f1' : '#2c3e50';
        
        window.currentChart.options.scales.x.ticks.color = textColor;
        window.currentChart.options.scales.y.ticks.color = textColor;
        window.currentChart.options.plugins.legend.labels.color = textColor;
        window.currentChart.update();
    }

    // Update chart with new data
    function updateChart() {
        const monthlyData = getMonthlyData();
        
        if (chart) {
            chart.data.datasets[0].data = monthlyData.incomes;
            chart.data.datasets[1].data = monthlyData.expenses;
            chart.update('none'); // Update without animation for real-time feel
        }
    }

    function handleTransaction(e) {
        e.preventDefault();
        
        const transaction = {
            id: Date.now(),
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            type: document.getElementById('type').value,
            category: document.getElementById('category').value,
            date: new Date().toISOString().split('T')[0]
        };
        
        transactions.push(transaction);
        updateLocalStorage();
        updateUI();
        transactionForm.reset();
    }

    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function updateUI() {
        updateBalances();
        updateTransactionsList();
        updateChart(); // Update chart whenever UI updates
    }

    function updateBalances() {
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((total, t) => total + t.amount, 0);
            
        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((total, t) => total + t.amount, 0);
            
        const totalBalance = totalIncome - totalExpenses;
        
        document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('totalBalance').textContent = formatCurrency(totalBalance);
    }

    function updateTransactionsList() {
        transactionsList.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td class="${transaction.type}">${formatCurrency(transaction.amount)}</td>
                <td>
                    <button class="btn-delete" data-id="${transaction.id}">
                        Excluir
                    </button>
                </td>
            `;
            transactionsList.appendChild(row);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                deleteTransaction(id);
            });
        });
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    function deleteTransaction(id) {
        const index = transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            transactions.splice(index, 1);
            updateLocalStorage();
            updateUI();
        }
    }

    function getMonthlyData() {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const currentYear = new Date().getFullYear();
        
        let monthlyIncomes = new Array(12).fill(0);
        let monthlyExpenses = new Array(12).fill(0);

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            if (date.getFullYear() === currentYear) {
                const month = date.getMonth();
                if (transaction.type === 'income') {
                    monthlyIncomes[month] += transaction.amount;
                } else {
                    monthlyExpenses[month] += transaction.amount;
                }
            }
        });

        return {
            labels: months,
            incomes: monthlyIncomes,
            expenses: monthlyExpenses
        };
    }
});