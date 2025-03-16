let candidateName = "";
let selectedPaper = "";
let responses = {};
let startedTime = "";
let timeLeft = 3 * 60 * 60; // 3 hours
let timerInterval;
let currentQuestion = 0;
let totalQuestions = 150; // Change to 150 for full test
let questionData = [];

document.getElementById("nextBtn").addEventListener("click", function () {
    startTest();
});

function startTest() {
    candidateName = document.getElementById("candidateName").value;
    selectedPaper = document.getElementById("paperSelect").value;

    if (candidateName === "") {
        alert("Please enter your name!");
        return;
    }
startedTime = new Date().toLocaleString();

    // Hide first page and show test page
    document.getElementById("startPage").style.display = "none";
    document.getElementById("testPage").style.display = "block";

    // Show the Question Navigation box

    loadQuestions(selectedPaper);
    startTimer();
}

function loadQuestions(paper) {
    for (let i = 1; i <= totalQuestions; i++) {
        questionData.push({
            imgSrc: `images/${paper}/q${i}.png`,
            number: i,
        });
    }
    showQuestion();
}


function loadQuestionNav() {
    const navContainer = document.getElementById("questionNav");
    navContainer.innerHTML = "";

    for (let i = 1; i <= totalQuestions; i++) {
        let qBox = document.createElement("div");
        qBox.classList.add("question-box");
        qBox.innerText = i;

        if (responses[i]) {
            qBox.classList.add("attempted"); // ✅ Attempted questions green ho jayenge
        }

        if (i === currentQuestion + 1) {
            qBox.classList.add("current"); // ✅ Current question blue ho jayega
        }

        qBox.onclick = function () {
            currentQuestion = i - 1;
            showQuestion();
        };

        navContainer.appendChild(qBox);
    }
}


function showQuestion() {
 loadQuestionNav();
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";

    let question = questionData[currentQuestion];

    let questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    questionDiv.innerHTML = `
        <img src="${question.imgSrc}" alt="Question ${question.number}" width="300"><br>
        <button class="option-btn" onclick="selectAnswer(${question.number}, 'A', this)" id="q${question.number}A">A</button>
        <button class="option-btn" onclick="selectAnswer(${question.number}, 'B', this)" id="q${question.number}B">B</button>
        <button class="option-btn" onclick="selectAnswer(${question.number}, 'C', this)" id="q${question.number}C">C</button>
        <button class="option-btn" onclick="selectAnswer(${question.number}, 'D', this)" id="q${question.number}D">D</button>
    `;

    container.appendChild(questionDiv);

    // ✅ Previous selected answer ko highlight karna
    if (responses[question.number]) {
        let selectedOption = responses[question.number];
        document.getElementById(`q${question.number}${selectedOption}`).classList.add("selected");
    }

    document.getElementById("prevBtn").style.display = currentQuestion === 0 ? "none" : "inline-block";
    document.getElementById("nextQBtn").style.display = currentQuestion === totalQuestions - 1 ? "none" : "inline-block";
    document.getElementById("submitBtn").style.display = currentQuestion === totalQuestions - 1 ? "inline-block" : "none";
}


function selectAnswer(questionNumber, option, button) {
    responses[questionNumber] = option;

    let parent = button.parentElement;
    let buttons = parent.getElementsByClassName("option-btn");
    for (let btn of buttons) {
        btn.classList.remove("selected");
    }
    button.classList.add("selected");
}

function nextQuestion() {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        showQuestion();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;
        document.getElementById("timer").innerText = `Time Left: ${hours}:${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

function submitTest() {
    clearInterval(timerInterval);

    const data = {
        name: candidateName,
        paper: selectedPaper,
        startedTime: startedTime,
        completedTime: new Date().toLocaleString(),
        responses: responses
    };

    fetch('/save-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.text())
      .then(data => {
          alert(data);
          window.location.href = "thankyou.html";
      })
      .catch(error => console.error('Error:', error));
}
