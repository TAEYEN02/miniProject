document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const expenseList = document.getElementById("expense-list-items");
    const expenseChartCanvas = document.getElementById("expense-chart");
    const modal = document.getElementById("expense-modal");
    const closeModal = document.querySelector(".close");
    const saveExpense = document.getElementById("save-expense");

    //일정 데이터를 로컬 스토리지에서 불러옴
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let homeSchedule = JSON.parse(localStorage.getItem("homeSchedule")) || {}; // home.html 일정 데이터
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDate = null;

    // 캘린더 생성 함수
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
        //날짜 채우기
        for (let date = 1; date <= lastDate; date++) {
            let fullDate = `${year}-${month + 1}-${date}`;
            let hasExpense = schedules[fullDate] && schedules[fullDate].expenses ? "has-expense" : "";
            let hasSchedule = homeSchedule[fullDate] ? "has-schedule" : ""; // 일정 표시
            
            let expenseHTML = "";
            if (schedules[fullDate] && schedules[fullDate].expenses) {
                schedules[fullDate].expenses.forEach(expense => {
                    expenseHTML += `<div class="expense-list">${expense.item}: ${expense.amount}원</div>`;
                });
            }

            calendarHTML += `<td class="calendar-day ${hasExpense} ${hasSchedule}" onclick="selectDate('${fullDate}')">${date}${expenseHTML}</td>`;
            
            if ((firstDay + date) % 7 === 0) {
                calendarHTML += "</tr><tr>";
            }
        }

        calendarHTML += "</tr></table>";
        calendar.innerHTML = calendarHTML;
        dateHeader.innerHTML = `<button onclick="changeMonth(-1)">◀</button> ${year}년 ${month + 1}월 <button onclick="changeMonth(1)">▶</button>`;
    }

    window.changeMonth = function (change) {
        currentMonth += change;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentYear, currentMonth);
    };

    // 가계부 수정 및 추가
    window.selectDate = function (date) {
        selectedDate = date;
        modal.style.display = "block";
        renderExpenseList(selectedDate);
    };

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    saveExpense.addEventListener("click", function () {
        let item = document.getElementById("expense-item").value;
        let amount = document.getElementById("expense-amount").value;

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

    // 가계부 항목 렌더링
    function renderExpenseList(date) {
        const expenses = schedules[date]?.expenses || [];
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const li = document.createElement("li");
            li.textContent = `${expense.item}: ${expense.amount}원`;
            expenseList.appendChild(li);
        });
        renderExpenseChart(expenses); // 그래프 업데이트
    }

    // 소비 내역 그래프 렌더링
    function renderExpenseChart(expenses) {
        const amounts = expenses.map(exp => parseInt(exp.amount));
        const totalAmount = amounts.reduce((a, b) => a + b, 0);
        const averageAmount = amounts.length > 0 ? totalAmount / amounts.length : 0;

        new Chart(expenseChartCanvas, {
            type: 'bar',
            data: {
                labels: ['Average'],
                datasets: [{
                    label: '평균 소비 금액',
                    data: [averageAmount],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // 캘린더와 연동되는 일정 업데이트
    window.addEventListener("load", function () {
        generateCalendar(currentYear, currentMonth);
    });
});
