document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const scheduleList = document.getElementById("schedule-list");
    const selectedDateElement = document.getElementById("selected-date");
    const scheduleInput = document.getElementById("schedule-input");
    const dateHeader = document.querySelector("#date-content h3");

    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    function generateCalendar(year, month) {
        let firstDay = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();

        let calendarHTML = "<table><tr>";

        // 요일 헤더 
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        days.forEach(day => {
            calendarHTML += `<th>${day}</th>`;
        });
        calendarHTML += "</tr><tr>";

        // 첫 주 빈 칸 채우기
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += "<td></td>";
        }

        // 날짜 채우기
        for (let date = 1; date <= lastDate; date++) {
            let fullDate = `${year}-${month + 1}-${date}`;
            let hasSchedule = schedules[fullDate] && schedules[fullDate].length > 0 ? "has-schedule" : "";

            calendarHTML += `<td class="calendar-day ${hasSchedule}" onclick="selectDate('${fullDate}')">${date}</td>`;


            
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
        selectedDateElement.innerText = date;
        scheduleList.innerHTML = "";

        if (schedules[date]) {
            schedules[date].forEach((item, index) => {
                let li = document.createElement("li");
                li.innerText = item;

                let deleteButton = document.createElement("button");
                deleteButton.innerText = "❌";
                deleteButton.onclick = function () { 
                    removeSchedule(date, index);
                };

                li.appendChild(deleteButton);
                scheduleList.appendChild(li);
            });
        }
    };

    window.addSchedule = function () {
        let date = selectedDateElement.innerText;
        let newSchedule = scheduleInput.value.trim();
        if (!date || !newSchedule) return;

        if (!schedules[date]) {
            schedules[date] = [];
        }

        schedules[date].push(newSchedule);
        localStorage.setItem("schedules", JSON.stringify(schedules));

        selectDate(date);
        scheduleInput.value = "";
        generateCalendar(currentYear, currentMonth);
    };

    window.removeSchedule = function (date, index) {
        if (schedules[date]) {
            schedules[date].splice(index, 1);
            
            if (schedules[date].length === 0) {
                delete schedules[date];
            }
            localStorage.setItem("schedules", JSON.stringify(schedules));

            selectDate(date);
            generateCalendar(currentYear, currentMonth);
        }
    };

    generateCalendar(currentYear, currentMonth);
});
