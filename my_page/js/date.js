document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const dateHeader = document.querySelector("#date-content h3");
    const modal = document.getElementById("expense-modal");
    const closeModal = document.querySelector(".close");
    const saveExpense = document.getElementById("save-expense");

    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDate = null;

    function generateCalendar(year, month) {
        let firstDay = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();
        let calendarHTML = "<table><tr>";
        
        //요일헤더
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        days.forEach(day => {
            calendarHTML += `<th>${day}</th>`;
        });
        calendarHTML += "</tr><tr>";

        //첫 주 빈칸 채우기
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += "<td></td>";
        }

        //날짜 채우기
        for (let date = 1; date <= lastDate; date++) {
            let fullDate = `${year}-${month + 1}-${date}`;
            let hasExpense = schedules[fullDate] && schedules[fullDate].expenses && schedules[fullDate].expenses.length > 0 ? "has-expense" : "";
            let expenseHTML = "";

            if (schedules[fullDate] && schedules[fullDate].expenses) {
                schedules[fullDate].expenses.forEach(expense => {
                    expenseHTML += `<div class="expense-list">${expense.item}: ${expense.amount}원</div>`;
                });
            }

            calendarHTML += `<td class="calendar-day ${hasExpense}" onclick="selectDate('${fullDate}')">${date}${expenseHTML}</td>`;
            
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

    window.selectDate = function (date) {
        selectedDate = date;
        modal.style.display = "block";
    };

    closeModal.addEventListener("click", function (e) {
        if (e.target === modal || e.target === closeModal) {
            modal.style.display = "none";
        }
    });

    saveExpense.addEventListener("click", function () {
        let item = document.getElementById("expense-item").value;
        let amount = document.getElementById("expense-amount").value;

        if (!item || !amount) {
            alert("항목과 금액을 입력해주세요!");
            return;
        }

        if (!schedules[selectedDate]) {
            schedules[selectedDate] = { expenses: [] };  // 빈 배열로 초기화
        }

        schedules[selectedDate].expenses.push({ item, amount });
        localStorage.setItem("schedules", JSON.stringify(schedules));

        modal.style.display = "none";
        generateCalendar(currentYear, currentMonth);
    });

    generateCalendar(currentYear, currentMonth);
});
