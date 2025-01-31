// Selecting progress bar and progress text elements
const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

// Function to update progress bar based on time remaining
const progress = (value) => {
  const percentage = (value / time) * 100; // Calculate percentage
  progressBar.style.width = `${percentage}%`; // Update progress bar width
  progressText.innerHTML = `${value}`; // Display time remaining
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
let questions = [], // Array to store quiz questions
  time = 30, // Default time per question
  score = 0, // Player's score
  currentQuestion, // Track current question number
  timer; // Timer variable

// Function to start the quiz
const startQuiz = () => {
  const num = numQuestions.value, // Get number of questions from input
    cat = category.value, // Get selected category
    diff = difficulty.value; // Get selected difficulty level

  loadingAnimation(); // Show loading animation

  // API URL to fetch questions based on user selection
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

  // Fetch questions from API
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results; // Store fetched questions
      setTimeout(() => {
        startScreen.classList.add("hide"); // Hide start screen
        quiz.classList.remove("hide"); // Show quiz screen
        currentQuestion = 1; // Set current question to first one
        showQuestion(questions[0]); // Display first question
      }, 1000);
    });
};

// Event listener to start quiz when the start button is clicked
startBtn.addEventListener("click", startQuiz);

// Function to display a question
const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper");

  questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question; // Display question text

  // Create an array with correct and incorrect answers
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];

  answersWrapper.innerHTML = ""; // Clear previous answers
  answers.sort(() => Math.random() - 0.5); // Shuffle answers

  // Display each answer as a selectable option
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

  // Display question number
  questionNumber.innerHTML = ` Question <span class="current">${questions.indexOf(question) + 1
    }</span>
    <span class="total">/${questions.length}</span>`;

  // Add event listener to each answer option
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected"); // Remove previous selection
        });
        answer.classList.add("selected"); // Highlight selected answer
        submitBtn.disabled = false; // Enable submit button
      }
    });
  });

  // Set time for the question and start countdown
  time = timePerQuestion.value;
  startTimer(time);
};

// Function to start the countdown timer
const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAdudio("asset/countdown.mp3"); // Play warning sound at 3 seconds
    }
    if (time >= 0) {
      progress(time); // Update progress bar
      time--;
    } else {
      checkAnswer(); // Automatically check answer if time runs out
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

// Event listener for submit button
submitBtn.addEventListener("click", () => {
  checkAnswer();
});

// Event listener for next button
nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block"; // Show submit button
  nextBtn.style.display = "none"; // Hide next button
});

// Function to check selected answer
const checkAnswer = () => {
  clearInterval(timer); // Stop the timer
  const selectedAnswer = document.querySelector(".answer.selected");

  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;

    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++; // Increase score if answer is correct
      selectedAnswer.classList.add("correct"); // Highlight correct answer
    } else {
      selectedAnswer.classList.add("wrong"); // Highlight wrong answer
      // Show correct answer
      document.querySelectorAll(".answer").forEach((answer) => {
        if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
          answer.classList.add("correct");
        }
      });
    }
  } else {
    // If no answer is selected, show the correct one
    document.querySelectorAll(".answer").forEach((answer) => {
      if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
        answer.classList.add("correct");
      }
    });
  }

  // Mark all answers as checked to prevent multiple selections
  document.querySelectorAll(".answer").forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none"; // Hide submit button
  nextBtn.style.display = "block"; // Show next button
};

// Function to move to the next question
const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]); // Show next question
  } else {
    showScore(); // Show final score if all questions are answered
  }
};

// Selecting end screen elements
const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

// Function to display final score
const showScore = () => {
  endScreen.classList.remove("hide"); // Show end screen
  quiz.classList.add("hide"); // Hide quiz section
  finalScore.innerHTML = score; // Display final score
  totalScore.innerHTML = `/ ${questions.length}`; // Display total questions
};

// Restart quiz when restart button is clicked
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload(); // Reload the page to restart quiz
});

// Function to play audio
const playAdudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};
