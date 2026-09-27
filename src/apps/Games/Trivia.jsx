import { useCallback, useEffect, useMemo, useState } from "react";
import "./Trivia.css";

const QUESTION_TIME = 20;
const STARTING_LIVES = 3;
const QUESTIONS_PER_GAME = 10;

const QUESTIONS = [
  {
    question: "Which language is primarily used for web frontend development?",
    options: ["Python", "JavaScript", "C++", "Go"],
    answer: 1,
    difficulty: "easy",
    explanation:
      "JavaScript is one of the primary programming languages used to build interactive web interfaces.",
  },
  {
    question: "Which company originally created React?",
    options: ["Google", "Facebook", "Microsoft", "Apple"],
    answer: 1,
    difficulty: "easy",
    explanation:
      "React was created at Facebook and was open-sourced in 2013.",
  },
  {
    question: "What does API stand for?",
    options: [
      "App Performance Index",
      "Application Programming Interface",
      "Applied Programming Input",
      "Application Process Integration",
    ],
    answer: 1,
    difficulty: "easy",
    explanation:
      "API stands for Application Programming Interface.",
  },
  {
    question: "Which HTTP status code means 'Not Found'?",
    options: ["200", "301", "404", "500"],
    answer: 2,
    difficulty: "easy",
    explanation:
      "HTTP 404 means that the requested resource could not be found.",
  },
  {
    question: "Which JavaScript method creates a new array by transforming every element?",
    options: ["filter()", "reduce()", "map()", "forEach()"],
    answer: 2,
    difficulty: "medium",
    explanation:
      "map() creates a new array containing the results of calling a function on every element.",
  },
  {
    question: "What does Redis primarily provide?",
    options: [
      "A relational database",
      "An in-memory data store",
      "A frontend framework",
      "A programming language",
    ],
    answer: 1,
    difficulty: "medium",
    explanation:
      "Redis is an in-memory data structure store commonly used for caching, queues, sessions, and fast data access.",
  },
  {
    question:
      "Which React hook is commonly used to synchronize a component with an external system?",
    options: ["useMemo", "useRef", "useEffect", "useCallback"],
    answer: 2,
    difficulty: "medium",
    explanation:
      "useEffect is commonly used for synchronizing components with external systems such as subscriptions, timers, and network activity.",
  },
  {
    question: "What is one of the primary purposes of a CDN?",
    options: [
      "Compile JavaScript",
      "Distribute content closer to users",
      "Replace a database",
      "Encrypt source code",
    ],
    answer: 1,
    difficulty: "easy",
    explanation:
      "A CDN distributes cached content across geographically distributed servers so users can retrieve content from a nearby location.",
  },
  {
    question: "Which data structure follows LIFO ordering?",
    options: ["Queue", "Stack", "Heap", "Graph"],
    answer: 1,
    difficulty: "easy",
    explanation:
      "A stack follows Last In, First Out. The most recently added item is removed first.",
  },
  {
    question: "Which data structure normally follows FIFO ordering?",
    options: ["Stack", "Queue", "Tree", "Set"],
    answer: 1,
    difficulty: "easy",
    explanation:
      "A queue follows First In, First Out. The first item added is normally the first one removed.",
  },
  {
    question: "What does JWT commonly contain?",
    options: [
      "Only a password",
      "Encoded claims",
      "A SQL query",
      "A CSS stylesheet",
    ],
    answer: 1,
    difficulty: "medium",
    explanation:
      "A JSON Web Token commonly contains encoded claims that can be used to transmit information between parties.",
  },
  {
    question: "Which Git command creates a new branch and switches to it?",
    options: [
      "git merge",
      "git clone",
      "git switch -c",
      "git fetch",
    ],
    answer: 2,
    difficulty: "medium",
    explanation:
      "git switch -c <name> creates a new branch and switches to the new branch.",
  },
  {
    question: "Which SQL clause is commonly used to filter rows?",
    options: ["GROUP BY", "ORDER BY", "WHERE", "JOIN"],
    answer: 2,
    difficulty: "medium",
    explanation:
      "WHERE filters rows according to a condition.",
  },
  {
    question: "What is the main purpose of database indexing?",
    options: [
      "Increase query lookup speed",
      "Encrypt the database",
      "Replace backups",
      "Remove duplicate tables",
    ],
    answer: 0,
    difficulty: "hard",
    explanation:
      "Indexes can significantly speed up data retrieval by providing an efficient lookup structure.",
  },
  {
    question: "What problem does a race condition involve?",
    options: [
      "A slow internet connection",
      "Unexpected behavior caused by timing/order of concurrent operations",
      "A corrupted image",
      "A missing CSS class",
    ],
    answer: 1,
    difficulty: "hard",
    explanation:
      "Race conditions occur when the result depends on the timing or ordering of concurrent operations.",
  },
  {
    question:
      "What is a common reason for using a message queue in a backend system?",
    options: [
      "To replace HTML",
      "To process work asynchronously",
      "To render CSS",
      "To store passwords in plain text",
    ],
    answer: 1,
    difficulty: "hard",
    explanation:
      "Message queues allow work to be processed asynchronously and can help decouple services.",
  },
  {
    question: "What does HTTP 429 indicate?",
    options: [
      "Unauthorized",
      "Not Found",
      "Too Many Requests",
      "Internal Server Error",
    ],
    answer: 2,
    difficulty: "medium",
    explanation:
      "HTTP 429 means the client has sent too many requests in a given period.",
  },
  {
    question: "Which concept allows a class to provide different implementations of the same interface?",
    options: [
      "Polymorphism",
      "Serialization",
      "Compression",
      "Indexing",
    ],
    answer: 0,
    difficulty: "hard",
    explanation:
      "Polymorphism allows different implementations to be treated through a shared interface.",
  },
  {
    question: "What is caching primarily intended to reduce?",
    options: [
      "Repeated expensive work or data retrieval",
      "Source code readability",
      "User authentication",
      "Screen resolution",
    ],
    answer: 0,
    difficulty: "medium",
    explanation:
      "Caching stores previously obtained or computed data so future requests can be served more efficiently.",
  },
  {
    question:
      "What is the main advantage of asynchronous programming in I/O-heavy applications?",
    options: [
      "It makes every operation instantaneous",
      "It can avoid blocking while waiting for I/O",
      "It eliminates all bugs",
      "It removes the need for servers",
    ],
    answer: 1,
    difficulty: "hard",
    explanation:
      "Asynchronous programming allows an application to continue useful work while waiting for I/O operations to complete.",
  },
];

const POINTS = {
  easy: 100,
  medium: 200,
  hard: 300,
};

const shuffle = (array) => {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

const getDifficultyLabel = (difficulty) => {
  if (difficulty === "hard") return "FINAL BOSS";
  if (difficulty === "medium") return "ENGINEER";
  return "WARM UP";
};

const getHighScore = () => {
  try {
    return Number(localStorage.getItem("portfolio-trivia-high-score")) || 0;
  } catch {
    return 0;
  }
};

const saveHighScore = (score) => {
  try {
    localStorage.setItem(
      "portfolio-trivia-high-score",
      String(score)
    );
  } catch {
    // Storage may be unavailable in some browser environments.
  }
};

function Trivia() {
  const [gameState, setGameState] = useState("start");

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const [questionPoints, setQuestionPoints] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);

  const [highScore, setHighScore] = useState(getHighScore);

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const [fastestAnswer, setFastestAnswer] = useState(null);

  const q = questions[index];

  const progress = useMemo(() => {
    if (!questions.length) return 0;

    return ((index + 1) / questions.length) * 100;
  }, [index, questions.length]);

  const streakMultiplier = Math.min(1 + streak * 0.25, 3);

  const startGame = useCallback(() => {
    const selectedQuestions = shuffle(QUESTIONS).slice(
      0,
      QUESTIONS_PER_GAME
    );

    setQuestions(selectedQuestions);
    setIndex(0);

    setScore(0);
    setLives(STARTING_LIVES);
    setStreak(0);
    setBestStreak(0);

    setSelected(null);
    setTimeLeft(QUESTION_TIME);

    setUsedFiftyFifty(false);
    setHiddenOptions([]);

    setQuestionPoints(0);
    setLastPoints(0);

    setCorrectAnswers(0);
    setWrongAnswers(0);

    setFastestAnswer(null);

    setGameState("playing");
  }, []);

  const finishGame = useCallback(() => {
    setGameState("finished");

    setHighScore((currentHighScore) => {
      const finalScore = score;

      if (finalScore > currentHighScore) {
        saveHighScore(finalScore);
        return finalScore;
      }

      return currentHighScore;
    });
  }, [score]);

  const choose = useCallback(
    (optionIndex) => {
      if (!q || selected !== null) return;

      setSelected(optionIndex);

      const isCorrect = optionIndex === q.answer;

      if (isCorrect) {
        const base = POINTS[q.difficulty];
        const speedBonus = timeLeft * 5;
        const comboBonus = Math.floor(
          base * (streakMultiplier - 1)
        );

        const total = base + speedBonus + comboBonus;

        setQuestionPoints(total);
        setLastPoints(total);

        setScore((current) => current + total);

        setCorrectAnswers((current) => current + 1);

        setStreak((current) => {
          const next = current + 1;

          setBestStreak((best) =>
            Math.max(best, next)
          );

          return next;
        });

        const answerTime = QUESTION_TIME - timeLeft;

        setFastestAnswer((current) => {
          if (current === null) return answerTime;

          return Math.min(current, answerTime);
        });
      } else {
        setQuestionPoints(0);
        setLastPoints(0);

        setWrongAnswers((current) => current + 1);

        setStreak(0);

        setLives((current) => {
          const nextLives = current - 1;

          return nextLives;
        });
      }
    },
    [q, selected, timeLeft, streakMultiplier]
  );

  const timeoutQuestion = useCallback(() => {
    if (!q || selected !== null) return;

    setSelected(-1);
    setQuestionPoints(0);
    setLastPoints(0);

    setWrongAnswers((current) => current + 1);
    setStreak(0);

    setLives((current) => current - 1);
  }, [q, selected]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (selected !== null) return;

    if (timeLeft <= 0) {
      timeoutQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    gameState,
    selected,
    timeLeft,
    timeoutQuestion,
  ]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyboard = (event) => {
      if (selected === null) {
        const number = Number(event.key);

        if (
          number >= 1 &&
          number <= 4 &&
          number <= q.options.length
        ) {
          choose(number - 1);
        }
      }

      if (
        selected !== null &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  });

  useEffect(() => {
    if (gameState !== "playing") return;

    if (lives <= 0) {
      const timeout = setTimeout(() => {
        finishGame();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [lives, gameState, finishGame]);

  const next = () => {
    if (selected === null) return;

    if (index + 1 >= questions.length) {
      finishGame();
      return;
    }

    setIndex((current) => current + 1);

    setSelected(null);
    setTimeLeft(QUESTION_TIME);

    setHiddenOptions([]);

    setQuestionPoints(0);
    setLastPoints(0);
  };

  const useFiftyFifty = () => {
    if (
      usedFiftyFifty ||
      selected !== null ||
      !q
    ) {
      return;
    }

    const incorrect = q.options
      .map((_, i) => i)
      .filter((i) => i !== q.answer);

    const hidden = shuffle(incorrect).slice(0, 2);

    setHiddenOptions(hidden);
    setUsedFiftyFifty(true);
  };

  const restart = () => {
    startGame();
  };

  if (gameState === "start") {
    return (
      <section className="trivia-app trivia-start">
        <div className="trivia-start-icon">⚡</div>

        <span className="trivia-eyebrow">
          PORTFOLIO OS GAME
        </span>

        <h2>Tech Trivia</h2>

        <p className="trivia-subtitle">
          Think fast. Answer faster.
        </p>

        <div className="trivia-rules">
          <div>
            <strong>10</strong>
            <span>Questions</span>
          </div>

          <div>
            <strong>3</strong>
            <span>Lives</span>
          </div>

          <div>
            <strong>20s</strong>
            <span>Per Question</span>
          </div>
        </div>

        <div className="trivia-high-score">
          🏆 High Score:{" "}
          <strong>{highScore.toLocaleString()}</strong>
        </div>

        <button
          className="trivia-primary-button"
          onClick={startGame}
        >
          Start Game
        </button>

        <p className="trivia-keyboard-hint">
          Use <kbd>1</kbd>–<kbd>4</kbd> to answer
        </p>
      </section>
    );
  }

  if (gameState === "finished") {
    const accuracy =
      questions.length > 0
        ? Math.round(
            (correctAnswers / questions.length) * 100
          )
        : 0;

    const isNewHighScore =
      score > highScore;

    return (
      <section className="trivia-app trivia-finish">
        <div className="trivia-result-icon">
          {accuracy >= 80
            ? "🏆"
            : accuracy >= 50
            ? "⚡"
            : "💀"}
        </div>

        <span className="trivia-eyebrow">
          RUN COMPLETE
        </span>

        <h2>
          {accuracy >= 80
            ? "Excellent Run"
            : accuracy >= 50
            ? "Solid Run"
            : "Back to the Lab"}
        </h2>

        <div className="trivia-final-score">
          <strong>{score.toLocaleString()}</strong>
          <span>XP</span>
        </div>

        {isNewHighScore && (
          <div className="trivia-new-score">
            🏆 NEW HIGH SCORE
          </div>
        )}

        <div className="trivia-results-grid">
          <div>
            <strong>
              {correctAnswers}/{questions.length}
            </strong>
            <span>Correct</span>
          </div>

          <div>
            <strong>{accuracy}%</strong>
            <span>Accuracy</span>
          </div>

          <div>
            <strong>{bestStreak}</strong>
            <span>Best Streak</span>
          </div>

          <div>
            <strong>
              {fastestAnswer !== null
                ? `${fastestAnswer}s`
                : "—"}
            </strong>
            <span>Fastest</span>
          </div>
        </div>

        <button
          className="trivia-primary-button"
          onClick={restart}
        >
          Play Again
        </button>

        <button
          className="trivia-secondary-button"
          onClick={() => setGameState("start")}
        >
          Main Menu
        </button>
      </section>
    );
  }

  if (!q) return null;

  return (
    <section className="trivia-app">
      <header className="trivia-header">
        <div>
          <span className="trivia-eyebrow">
            TECH TRIVIA
          </span>

          <h2>
            Question {index + 1}
            <span> / {questions.length}</span>
          </h2>
        </div>

        <div className="trivia-header-stats">
          <span>🔥 {streak}</span>
          <span>
            ❤️ {Math.max(lives, 0)}
          </span>
          <span>
            💰 {score.toLocaleString()}
          </span>
        </div>
      </header>

      <div className="trivia-progress">
        <div
          className="trivia-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="trivia-meta">
        <span
          className={`trivia-difficulty ${q.difficulty}`}
        >
          {getDifficultyLabel(q.difficulty)}
        </span>

        <span
          className={`trivia-timer ${
            timeLeft <= 5 ? "danger" : ""
          }`}
        >
          ⏱ {timeLeft}s
        </span>
      </div>

      <div className="trivia-question">
        <h3>{q.question}</h3>

        <div className="trivia-options">
          {q.options.map((option, i) => {
            const hidden = hiddenOptions.includes(i);

            if (hidden) return null;

            let stateClass = "";

            if (selected !== null) {
              if (i === q.answer) {
                stateClass = "correct";
              } else if (
                i === selected &&
                i !== q.answer
              ) {
                stateClass = "wrong";
              }
            }

            return (
              <button
                key={i}
                className={`trivia-option ${stateClass}`}
                onClick={() => choose(i)}
                disabled={selected !== null}
              >
                <span className="trivia-option-number">
                  {i + 1}
                </span>

                <span>{option}</span>

                {selected !== null &&
                  i === q.answer && (
                    <span className="trivia-option-icon">
                      ✓
                    </span>
                  )}

                {selected === i &&
                  i !== q.answer && (
                    <span className="trivia-option-icon">
                      ✕
                    </span>
                  )}
              </button>
            );
          })}
        </div>
      </div>

      {selected !== null && (
        <div
          className={`trivia-feedback ${
            selected === q.answer
              ? "correct"
              : "wrong"
          }`}
        >
          <div>
            <strong>
              {selected === q.answer
                ? `Correct! +${lastPoints.toLocaleString()} XP`
                : selected === -1
                ? "Time's up!"
                : "Not quite!"}
            </strong>

            {selected !== q.answer && (
              <span>
                Correct answer:{" "}
                <strong>{q.options[q.answer]}</strong>
              </span>
            )}
          </div>

          <p>{q.explanation}</p>
        </div>
      )}

      <footer className="trivia-footer">
        <button
          className="trivia-hint-button"
          onClick={useFiftyFifty}
          disabled={
            usedFiftyFifty ||
            selected !== null
          }
        >
          💡 50/50
        </button>

        <div className="trivia-footer-right">
          {selected !== null && (
            <span className="trivia-next-hint">
              Press Enter
            </span>
          )}

          <button
            className="trivia-next-button"
            onClick={next}
            disabled={selected === null}
          >
            {index + 1 >= questions.length
              ? "Finish"
              : "Next"}
            <span>→</span>
          </button>
        </div>
      </footer>
    </section>
  );
}

export default Trivia;