document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
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

    generateCalendar(currentYear, currentMonth);
});
