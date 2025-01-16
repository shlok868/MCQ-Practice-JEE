const urlParams = new URLSearchParams(window.location.search);
const folderName = urlParams.get('folder');
let test=folderName;
let questionsFolder = `data/${test}/`;
let totalQuestions = 0;
let currentQuestion = 0;
let answers = [];
let answerKey = {}; // Load this from your JSON file
let submitted = false; // Track if the quiz has been submitted
let timer; // Add this line
let timeRemaining = 10; // Add this line (time in seconds, e.g., 10 minutes)

document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions();
    startTimer();
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
        submitted = true; // Mark as submitted
        updateSidePanel();
        clearInterval(timer); // Update side panel to show incorrect answers
    });

    document.getElementById('question-select').addEventListener('change', (event) => {
        saveAnswer();
        currentQuestion = parseInt(event.target.value);
        loadQuestion(currentQuestion);
    });
});

function fetchQuestions() {
    fetch(`${test}.json`)
        .then(response => response.json())
        .then(data => {
            totalQuestions = data.length;
            answers = Array(totalQuestions).fill(null);
            populateQuestionSelect();
            populateSidePanel();
            loadQuestion(currentQuestion);
        });
}

function populateQuestionSelect() {
    const questionSelect = document.getElementById('question-select');
    for (let i = 0; i < totalQuestions; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Question ${i + 1}`;
        questionSelect.appendChild(option);
    }
}

function populateSidePanel() {
    const sidePanel = document.getElementById('side-panel');
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
        })
        .catch(error => {
            console.error('Error loading image:', error);
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
    updateSidePanel(); // Ensure the side panel is updated after checking results
}

// Load the answer key from the JSON file
fetch(`data/${test}ans.json`)
    .then(response => response.json())
    .then(data => {
        answerKey = data;
    });
    function startTimer() {
        timer = setInterval(() => {
            timeRemaining--;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            document.getElementById('time').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            //if (timeRemaining <= 0) {
            //    clearInterval(timer);
            //    document.getElementById('submit-btn').click(); // Automatically submit the quiz
            //}
        }, 1000);
    }