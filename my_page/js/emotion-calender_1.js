document.addEventListener("DOMContentLoaded", function () {
    const emotionCalendar = document.getElementById("emotion-calendar");
    const emotionSelectedDate = document.getElementById("selected-date");
    const emotionImage = document.getElementById("emotion-image");
    const emotionButtons = document.getElementById("emotion-buttons");

    let emotions = JSON.parse(localStorage.getItem("emotions")) || {};
    const emotionImages = {
        joy: 'img/hello-joy.gif',
        angry: 'img/anger-walk-2.gif',
        bored: 'img/bored-ennui.gif',
        sad: 'img/apprehensive-sadness.gif',
        disgust: 'img/ew-disgust.gif',
        shy: 'img/shy-embarrassment.gif',
        scared: 'img/scared-fear.gif'
    };

    let currentDate = new Date();

    // 이전 월로 이동
    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateEmotionCalendar();  // 달력 갱신
    }

    // 다음 월로 이동
    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateEmotionCalendar();  // 달력 갱신
    }

    // 감정 캘린더 생성 함수
    function generateEmotionCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        let firstDay = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();

        let calendarHTML = "<div class='calendar-header'>";
        calendarHTML += `<span id="month-name">${currentDate.toLocaleString('default', { month: 'long' })} ${year}</span>`;
        calendarHTML += "</div><table><tr>";

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
            let emotionImageUrl = emotions[fullDate] || "img/default.png";  // 기본 이미지로 설정

            calendarHTML += `<td class="calendar-day" onclick="selectEmotionDate('${fullDate}')">
                                <div class="emotion-img" style="background-image: url(${emotionImageUrl});"></div>
                                ${date}
                              </td>`;

            if ((firstDay + date) % 7 === 0) {
                calendarHTML += "</tr><tr>";
            }
        }

        calendarHTML += "</tr></table>";
        emotionCalendar.innerHTML = calendarHTML;
    }

    // 날짜 선택 시 감정 이미지와 버튼 표시
    window.selectEmotionDate = function (date) {
        emotionSelectedDate.innerText = date;
        emotionImage.style.display = "block";  // 감정 이미지 표시
        emotionButtons.style.display = "block";  // 감정 버튼 표시
        emotionImage.src = emotions[date] || "img/default.png";  // 선택된 날짜의 감정 이미지 바로 표시
    };

    // 감정 선택 시 해당 날짜에 이미지 저장하고 캘린더 갱신
    window.changeEmotion = function (emotion) {
        let selectedDate = emotionSelectedDate.innerText;
        if (!selectedDate) return;  // 날짜가 선택되지 않았을 경우 처리

        let emotionImageUrl = emotionImages[emotion] || "img/default.png";  // 선택한 감정 이미지

        // 감정 저장
        emotions[selectedDate] = emotionImageUrl;
        localStorage.setItem("emotions", JSON.stringify(emotions));

        // 감정 이미지 업데이트
        emotionImage.src = emotionImageUrl;

        // 감정 캘린더 갱신
        generateEmotionCalendar();
        emotionButtons.style.display = "none";  // 감정 버튼 숨기기
    };

    // 초기 달력 생성
    generateEmotionCalendar();  
});
