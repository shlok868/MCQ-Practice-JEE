const urlParams = new URLSearchParams(window.location.search);
const folderName = urlParams.get('folder');
let test = folderName; // e.g., "chemistry/redox"
let questionsFolder = `data/${test}/`;
let totalQuestions = 0;
let currentQuestion = 0;
let answers = [];
let answerKey = {}; // Loaded from ans.json
let submitted = false;


let customTimer = {
    totalSeconds: 600,
    remaining: 600,
    interval: null,
    running: false,
    laps: []
};

document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions();
    
    document.getElementById('next-btn').addEventListener('click', () => {
        saveAnswer();
        if (currentQuestion < totalQuestions - 1) {
            currentQuestion++;
            loadQuestion(currentQuestion);
        }
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        saveAnswer();
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion(currentQuestion);
        }
    });

    document.getElementById('submit-btn').addEventListener('click', () => {
        saveAnswer();
        checkResults();
        submitted = true;
        updateSidePanel();
        clearInterval(timer);
    });

    document.getElementById('question-select').addEventListener('change', (event) => {
        saveAnswer();
        currentQuestion = parseInt(event.target.value);
        loadQuestion(currentQuestion);
    });

    document.getElementById('save-btn').addEventListener('click', () => {
        fetch('/save-answers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ testPath: test, answers })
        })
        .then(res => res.json())
        .then(data => {
            alert('Answers saved!');
        });
    });

    document.getElementById('load-btn').addEventListener('click', () => {
        fetch(`/load-answers?testPath=${encodeURIComponent(test)}`)
            .then(res => res.json())
            .then(saved => {
                if (Array.isArray(saved) && saved.length === totalQuestions) {
                    answers = saved;
                    loadQuestion(currentQuestion);
                    updateSidePanel();
                    alert('Answers loaded!');
                } else {
                    alert('No saved answers found.');
                }
            });
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        fetch('/clear-answers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ testPath: test, totalQuestions })
        })
        .then(res => res.json())
        .then(data => {
            answers = Array(totalQuestions).fill(null);
            loadQuestion(currentQuestion);
            updateSidePanel();
            alert('Saved answers cleared!');
        });
    });

    // Timer event listeners
    document.getElementById('timer-set').addEventListener('click', setCustomTimer);
    document.getElementById('timer-start').addEventListener('click', startCustomTimer);
    document.getElementById('timer-pause').addEventListener('click', pauseCustomTimer);
    document.getElementById('timer-stop').addEventListener('click', stopCustomTimer);
    document.getElementById('timer-lap').addEventListener('click', lapCustomTimer);
});

// Make the timer window draggable
(function() {
    const timerWindow = document.getElementById('custom-timer-window');
    const header = document.getElementById('custom-timer-header');
    let offsetX = 0, offsetY = 0, isDown = false;

    header.addEventListener('mousedown', function(e) {
        isDown = true;
        offsetX = e.clientX - timerWindow.offsetLeft;
        offsetY = e.clientY - timerWindow.offsetTop;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        timerWindow.style.left = (e.clientX - offsetX) + 'px';
        timerWindow.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', function() {
        isDown = false;
        document.body.style.userSelect = '';
    });
})();

function fetchQuestions() {
    fetch(`data/${test}/ans.json`)
        .then(response => response.json())
        .then(data => {
            answerKey = data;
            totalQuestions = Object.keys(answerKey).length;
            answers = Array(totalQuestions).fill(null);
            populateQuestionSelect();
            populateSidePanel();
            loadQuestion(currentQuestion);
        });
}

function populateQuestionSelect() {
    const questionSelect = document.getElementById('question-select');
    questionSelect.innerHTML = '';
    for (let i = 0; i < totalQuestions; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Question ${i + 1}`;
        questionSelect.appendChild(option);
    }
}

function populateSidePanel() {
    const sidePanel = document.getElementById('side-panel');
    sidePanel.innerHTML = '';
    for (let i = 0; i < totalQuestions; i++) {
        const button = document.createElement('button');
        button.textContent = i + 1;
        button.classList.add('question-button');
        button.addEventListener('click', () => {
            saveAnswer();
            currentQuestion = i;
            loadQuestion(currentQuestion);
        });
        sidePanel.appendChild(button);
    }
    updateSidePanel();
}

function loadQuestion(index) {
    const questionImage = document.getElementById('question-image');
    const imagePath = `${questionsFolder}q${index + 1}.png`;

    // Check if the image exists
    fetch(imagePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Image not found');
            }
            return response.blob();
        })
        .then(blob => {
            questionImage.src = URL.createObjectURL(blob);
            questionImage.alt = '';
        })
        .catch(error => {
            console.error('Error loading image:', error);
            questionImage.src = '';
            questionImage.alt = 'Image not found';
        });

    const options = document.getElementsByName('option');
    options.forEach(option => option.checked = false);

    if (answers[index] !== null) {
        options.forEach(option => {
            if (option.value === answers[index].toString()) {
                option.checked = true;
            }
        });
    }

    document.getElementById('question-status').textContent = `Question ${index + 1}/${totalQuestions}`;
    document.getElementById('answered-status').textContent = `Answered: ${answers.filter(a => a !== null).length}`;
    document.getElementById('question-select').value = index;

    updateSidePanel();
}

function saveAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        answers[currentQuestion] = parseInt(selectedOption.value);
    }
}

function updateSidePanel() {
    const buttons = document.querySelectorAll('.question-button');
    buttons.forEach((button, index) => {
        if (answers[index] !== null) {
            if (submitted && answers[index] !== answerKey[(index + 1).toString()]) {
                button.style.backgroundColor = 'red';
            } else {
                button.style.backgroundColor = 'green';
            }
        } else {
            button.style.backgroundColor = 'white';
        }
    });
}

function checkResults() {
    let score = 0;
    answers.forEach((answer, index) => {
        if (answer === answerKey[(index + 1).toString()]) {
            score++;
        }
    });
    document.getElementById('result').textContent = `You scored ${score} out of ${totalQuestions}`;
    updateSidePanel();
}



function updateTimerDisplay() {
    const min = Math.floor(customTimer.remaining / 60);
    const sec = customTimer.remaining % 60;
    document.getElementById('timer-display').textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function setCustomTimer() {
    const min = parseInt(document.getElementById('timer-minutes').value) || 0;
    const sec = parseInt(document.getElementById('timer-seconds').value) || 0;
    customTimer.totalSeconds = min * 60 + sec;
    customTimer.remaining = customTimer.totalSeconds;
    customTimer.laps = [];
    document.getElementById('timer-laps').innerHTML = '';
    updateTimerDisplay();
}

function startCustomTimer() {
    if (customTimer.running) return;
    customTimer.running = true;
    customTimer.interval = setInterval(() => {
        if (customTimer.remaining > 0) {
            customTimer.remaining--;
            updateTimerDisplay();
        } else {
            stopCustomTimer();
        }
    }, 1000);
}

function pauseCustomTimer() {
    if (customTimer.running) {
        clearInterval(customTimer.interval);
        customTimer.running = false;
    }
}

function stopCustomTimer() {
    clearInterval(customTimer.interval);
    customTimer.running = false;
    customTimer.remaining = customTimer.totalSeconds;
    updateTimerDisplay();
}

function lapCustomTimer() {
    const min = Math.floor(customTimer.remaining / 60);
    const sec = customTimer.remaining % 60;
    const lapTime = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    customTimer.laps.push(lapTime);
    const lapList = document.getElementById('timer-laps');
    const li = document.createElement('li');
    li.textContent = `Lap ${customTimer.laps.length}: ${lapTime}`;
    lapList.appendChild(li);
}

// Initialize display
updateTimerDisplay();