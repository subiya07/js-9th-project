// Selecting progress bar and progress text elements
const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

// Function to update progress bar based on time remaining
const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
  console.log(`Progress updated: ${value}s left (${percentage.toFixed(2)}%)`);
};

// Selecting necessary elements for quiz functionality
const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

// Declaring global variables
let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;

// Function to start the quiz
const startQuiz = () => {
  const num = numQuestions.value,
    cat = category.value,
    diff = difficulty.value;

  console.log(`Starting quiz with ${num} questions in ${cat} category at ${diff} difficulty`);
  loadingAnimation();

  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      console.log("Fetched questions:", questions);
      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[0]);
      }, 1000);
    });
};

startBtn.addEventListener("click", startQuiz);

// Function to display a question
const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper");

  questionNumber = document.querySelector(".number");

  console.log(`Showing Question ${questions.indexOf(question) + 1}: ${question.question}`);

  questionText.innerHTML = question.question;

  const answers = [...question.incorrect_answers, question.correct_answer.toString()];
  answers.sort(() => Math.random() - 0.5);

  answersWrapper.innerHTML = "";

  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox">
          <i class="fas fa-check"></i>
        </span>
      </div>
    `;
  });

  questionNumber.innerHTML = ` Question <span class="current">${questions.indexOf(question) + 1
    }</span> <span class="total">/${questions.length}</span>`;

  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
        console.log(`Selected answer: ${answer.querySelector(".text").innerHTML}`);
      }
    });
  });

  time = timePerQuestion.value;
  startTimer(time);
};

// Function to start the countdown timer
const startTimer = (time) => {
  console.log(`Starting timer: ${time}s`);
  timer = setInterval(() => {
    if (time === 3) {
      playAdudio("asset/countdown.mp3");
    }
    if (time >= 0) {
      progress(time);
      time--;
    } else {
      console.log("Time's up!");
      checkAnswer();
    }
  }, 1000);
};

// Function to display loading animation
const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};

// Selecting submit and next buttons
const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
  console.log("Submit button clicked");
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  console.log("Next button clicked");
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

// Function to check selected answer
const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");

  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    const correctAnswer = questions[currentQuestion - 1].correct_answer;

    console.log(`User selected: ${answer}`);
    console.log(`Correct answer: ${correctAnswer}`);

    if (answer === correctAnswer) {
      score++;
      selectedAnswer.classList.add("correct");
      console.log("Correct answer! Score: ", score);
    } else {
      selectedAnswer.classList.add("wrong");
      console.log("Wrong answer!");

      document.querySelectorAll(".answer").forEach((answer) => {
        if (answer.querySelector(".text").innerHTML === correctAnswer) {
          answer.classList.add("correct");
        }
      });
    }
  } else {
    console.log("No answer selected. Showing correct one.");
    const correctAnswer = questions[currentQuestion - 1].correct_answer;
    document.querySelectorAll(".answer").forEach((answer) => {
      if (answer.querySelector(".text").innerHTML === correctAnswer) {
        answer.classList.add("correct");
      }
    });
  }

  document.querySelectorAll(".answer").forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

// Function to move to the next question
const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    console.log(`Moving to question ${currentQuestion}`);
    showQuestion(questions[currentQuestion - 1]);
  } else {
    console.log("Quiz completed.");
    showScore();
  }
};

// Selecting end screen elements
const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

// Function to display final score
const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/ ${questions.length}`;
  console.log(`Final Score: ${score} / ${questions.length}`);
};

// Restart quiz when restart button is clicked
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  console.log("Quiz restarted");
  window.location.reload();
});

// Function to play audio
const playAdudio = (src) => {
  console.log("Playing audio:", src);
  const audio = new Audio(src);
  audio.play();
};
