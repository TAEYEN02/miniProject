document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const expenseList = document.getElementById("expense-list-items");
    const expenseChartCanvas = document.getElementById("expense-chart");
    const modal = document.getElementById("expense-modal");
    const closeModal = document.querySelector(".close");
    const saveExpense = document.getElementById("save-expense");
    const expenseItemSelect = document.getElementById("expense-item");
    const expenseAmountInput = document.getElementById("expense-amount");

    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDate = null;

    function generateCalendar(year, month) {
        let firstDay = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();
        let calendarHTML = "<table><tr>";
        
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        days.forEach(day => {
            calendarHTML += `<th>${day}</th>`;
        });
        calendarHTML += "</tr><tr>";

        for (let i = 0; i < firstDay; i++) {
            calendarHTML += "<td></td>";
        }
        
        for (let date = 1; date <= lastDate; date++) {
            let fullDate = `${year}-${month + 1}-${date}`;
            let hasExpense = schedules[fullDate] ? "has-expense" : "";
            calendarHTML += `<td class="calendar-day ${hasExpense}" onclick="selectDate('${fullDate}')">${date}</td>`;
            
            if ((firstDay + date) % 7 === 0) {
                calendarHTML += "</tr><tr>";
            }
        }

        calendarHTML += "</tr></table>";
        calendar.innerHTML = calendarHTML;
    }

    window.selectDate = function (date) {
        selectedDate = date;
        modal.style.display = "block";
        renderExpenseList(selectedDate);
    };

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    saveExpense.addEventListener("click", function () {
        let item = expenseItemSelect.value;
        let amount = expenseAmountInput.value;

        if (!item || !amount) {
            alert("항목과 금액을 입력해주세요!");
            return;
        }

        if (!schedules[selectedDate]) {
            schedules[selectedDate] = { expenses: [] };
        }

        schedules[selectedDate].expenses.push({ item, amount });
        localStorage.setItem("schedules", JSON.stringify(schedules));
        modal.style.display = "none";
        generateCalendar(currentYear, currentMonth);
        renderExpenseList(selectedDate);
    });

    function renderExpenseList(date) {
        const expenses = schedules[date]?.expenses || [];
        expenseList.innerHTML = "";
        expenses.forEach((expense, index) => {
            const li = document.createElement("li");
            li.textContent = `${expense.item}: ${expense.amount}원`;
            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "삭제";
            deleteBtn.onclick = function () {
                schedules[date].expenses.splice(index, 1);
                if (schedules[date].expenses.length === 0) delete schedules[date];
                localStorage.setItem("schedules", JSON.stringify(schedules));
                renderExpenseList(date);
                generateCalendar(currentYear, currentMonth);
            };

            li.appendChild(deleteBtn);
            expenseList.appendChild(li);
        });
        renderExpenseChart(expenses);
    }

    function renderExpenseChart(expenses) {
        const amounts = expenses.map(exp => parseInt(exp.amount));
        const labels = expenses.map(exp => exp.item);
        
        new Chart(expenseChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '소비 금액',
                    data: amounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    window.addEventListener("load", function () {
        generateCalendar(currentYear, currentMonth);
    });
});
