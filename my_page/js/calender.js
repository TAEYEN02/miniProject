document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const scheduleList = document.getElementById("schedule-list");
    const selectedDateElement = document.getElementById("selected-date");
    const scheduleInput = document.getElementById("schedule-input");

    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};

    function generateCalendar() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

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
            let hasSchedule = schedules[fullDate] ? "has-schedule" : "";

            calendarHTML += `<td class="calendar-day ${hasSchedule}" onclick="selectDate('${fullDate}')">${date}</td>`;

            if ((firstDay + date) % 7 === 0) {
                calendarHTML += "</tr><tr>";
            }
        }

        calendarHTML += "</tr></table>";
        calendar.innerHTML = calendarHTML;
    }

    window.selectDate = function (date) {
        selectedDateElement.innerText = date;
        scheduleList.innerHTML = "";

        if (schedules[date]) {
            schedules[date].forEach(item => {
                let li = document.createElement("li");
                li.innerText = item;
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
        generateCalendar();
    };

    generateCalendar();
});
