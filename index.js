const express = require('express');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
  secret: 'kids-quiz-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Quiz questions for kids
const questions = [
  {
    id: 1,
    question: "What color is the sky on a sunny day? ☀️",
    options: ["Red", "Blue", "Green", "Yellow"],
    answer: 1
  },
  {
    id: 2,
    question: "How many legs does a dog have? 🐕",
    options: ["2", "4", "6", "8"],
    answer: 1
  },
  {
    id: 3,
    question: "What sound does a cat make? 🐱",
    options: ["Woof", "Moo", "Meow", "Quack"],
    answer: 2
  },
  {
    id: 4,
    question: "What is 2 + 2? 🔢",
    options: ["3", "4", "5", "6"],
    answer: 1
  },
  {
    id: 5,
    question: "Which fruit is yellow? 🍌",
    options: ["Apple", "Banana", "Strawberry", "Grape"],
    answer: 1
  },
  {
    id: 6,
    question: "What do bees make? 🐝",
    options: ["Milk", "Honey", "Bread", "Cheese"],
    answer: 1
  },
  {
    id: 7,
    question: "How many days are in a week? 📅",
    options: ["5", "6", "7", "8"],
    answer: 2
  },
  {
    id: 8,
    question: "What is the biggest animal in the ocean? 🌊",
    options: ["Shark", "Dolphin", "Blue Whale", "Octopus"],
    answer: 2
  }
];

// Initialize or reset game session
function initGame(session) {
  session.score = 0;
  session.currentQuestion = 0;
  session.answered = [];
  session.gameOver = false;
}

// Home - Start new game
app.get('/', (req, res) => {
  initGame(req.session);
  res.json({
    message: "🎮 Welcome to the Kids Quiz Game!",
    instructions: "Answer fun questions and earn points!",
    endpoints: {
      start: "GET /quiz - Start the quiz",
      answer: "POST /answer - Submit your answer",
      score: "GET /score - Check your score",
      restart: "GET /restart - Start over"
    }
  });
});

// Get current question
app.get('/quiz', (req, res) => {
  if (req.session.score === undefined) {
    initGame(req.session);
  }

  if (req.session.gameOver) {
    return res.json({
      message: "🏁 Quiz completed!",
      finalScore: req.session.score,
      totalQuestions: questions.length,
      hint: "GET /restart to play again!"
    });
  }

  const questionIndex = req.session.currentQuestion;
  const q = questions[questionIndex];

  res.json({
    questionNumber: questionIndex + 1,
    totalQuestions: questions.length,
    question: q.question,
    options: q.options.map((opt, i) => `${i}: ${opt}`),
    currentScore: req.session.score,
    hint: "POST /answer with { \"answer\": 0-3 }"
  });
});

// Submit answer
app.post('/answer', (req, res) => {
  if (req.session.score === undefined) {
    initGame(req.session);
  }

  if (req.session.gameOver) {
    return res.json({
      message: "🏁 Quiz already completed!",
      finalScore: req.session.score,
      hint: "GET /restart to play again!"
    });
  }

  const userAnswer = req.body.answer;

  if (userAnswer === undefined || userAnswer < 0 || userAnswer > 3) {
    return res.status(400).json({
      error: "Please provide an answer (0-3)",
      example: { answer: 1 }
    });
  }

  const questionIndex = req.session.currentQuestion;
  const q = questions[questionIndex];
  const isCorrect = userAnswer === q.answer;

  if (isCorrect) {
    req.session.score += 10;
  }

  req.session.answered.push({
    question: q.question,
    yourAnswer: q.options[userAnswer],
    correctAnswer: q.options[q.answer],
    correct: isCorrect
  });

  req.session.currentQuestion++;

  if (req.session.currentQuestion >= questions.length) {
    req.session.gameOver = true;

    const percentage = Math.round((req.session.score / (questions.length * 10)) * 100);
    let message = "";

    if (percentage === 100) message = "🌟 PERFECT! You're a SUPERSTAR! 🌟";
    else if (percentage >= 80) message = "🎉 AMAZING! You're so smart!";
    else if (percentage >= 60) message = "👍 GOOD JOB! Keep learning!";
    else if (percentage >= 40) message = "😊 Nice try! Practice makes perfect!";
    else message = "💪 Keep trying! You'll do better next time!";

    return res.json({
      result: isCorrect ? "✅ Correct!" : "❌ Oops! Wrong answer",
      correctAnswer: q.options[q.answer],
      gameOver: true,
      message: message,
      finalScore: req.session.score,
      totalPossible: questions.length * 10,
      percentage: percentage + "%"
    });
  }

  res.json({
    result: isCorrect ? "✅ Correct! +10 points" : "❌ Oops! Wrong answer",
    correctAnswer: q.options[q.answer],
    currentScore: req.session.score,
    nextQuestion: "GET /quiz for next question"
  });
});

// Check score
app.get('/score', (req, res) => {
  if (req.session.score === undefined) {
    return res.json({
      message: "No game in progress",
      hint: "GET / to start a new game"
    });
  }

  res.json({
    currentScore: req.session.score,
    questionsAnswered: req.session.currentQuestion,
    totalQuestions: questions.length,
    gameOver: req.session.gameOver,
    history: req.session.answered
  });
});

// Restart game
app.get('/restart', (req, res) => {
  initGame(req.session);
  res.json({
    message: "🔄 Game restarted! Good luck!",
    hint: "GET /quiz to start playing"
  });
});

app.listen(PORT, () => {
  console.log(`🎮 Kids Quiz Game running on http://localhost:${PORT}`);
});
