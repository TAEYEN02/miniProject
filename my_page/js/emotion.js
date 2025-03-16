function toggleEmotionButtons() {
    const buttons = document.getElementById('emotion-buttons');
    buttons.style.display = (buttons.style.display === 'block') ? 'none' : 'block';
}

function changeEmotion(emotion) {
    const emotionImages = {
        joy: 'img/hello-joy.gif',
        angry: 'img/anger-walk-2.gif',
        bored: 'img/bored-ennui.gif',
        sad: 'img/apprehensive-sadness.gif',
        disgust: 'img/ew-disgust.gif',
        shy: 'img/shy-embarrassment.gif',
        scared : 'img/scared-fear.gif'
    };
    document.getElementById('emotion').src = emotionImages[emotion];
    document.getElementById('emotion-buttons').style.display = 'none';
}