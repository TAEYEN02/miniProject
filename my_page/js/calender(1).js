document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const expenseList = document.getElementById("expense-list-items");
    const expenseChartCanvas = document.getElementById("expense-chart");
    const modal = document.getElementById("expense-modal");
    const closeModal = document.querySelector(".close");
    const saveExpense = document.getElementById("save-expense");

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
    }

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

   // 소비 내역 그래프 렌더링
function renderExpenseChart(expenses) {
    if (expenses.length === 0) {
        expenseChartCanvas.style.display = 'none'; // 소비 내역이 없으면 그래프를 숨깁니다.
        return;
    } else {
        expenseChartCanvas.style.display = 'block'; // 소비 내역이 있으면 그래프를 보이게 합니다.
    }

    const amounts = expenses.map(exp => parseInt(exp.amount));
    const totalAmount = amounts.reduce((a, b) => a + b, 0);
    const averageAmount = amounts.length > 0 ? totalAmount / amounts.length : 0;

    // 이전 그래프가 있을 경우 삭제
    if (expenseChartCanvas.chart) {
        expenseChartCanvas.chart.destroy();
    }

    // 새 그래프 생성
    expenseChartCanvas.chart = new Chart(expenseChartCanvas, {
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
