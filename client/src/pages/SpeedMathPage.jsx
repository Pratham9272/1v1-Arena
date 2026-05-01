import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

const createQuestion = (index) => {
  const tier = Math.floor(index / 5);

  if (tier === 0) {
    const a = 1 + Math.floor(Math.random() * 9);
    const b = 1 + Math.floor(Math.random() * 9);
    return { prompt: `${a} + ${b}`, answer: a + b };
  }

  if (tier === 1) {
    const a = 10 + Math.floor(Math.random() * 20);
    const b = 1 + Math.floor(Math.random() * 9);
    return { prompt: `${a} - ${b}`, answer: a - b };
  }

  if (tier === 2) {
    const a = 2 + Math.floor(Math.random() * 12);
    const b = 2 + Math.floor(Math.random() * 12);
    return { prompt: `${a} x ${b}`, answer: a * b };
  }

  const a = 20 + Math.floor(Math.random() * 50);
  const b = 2 + Math.floor(Math.random() * 8);
  return { prompt: `${a + a % b} / ${b}`, answer: (a + (a % b)) / b };
};

export const SpeedMathPage = () => {
  const { matchId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, updateWalletBalance } = useAuth();
  const [timeLeft, setTimeLeft] = useState(state?.durationSeconds || 35);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const question = useMemo(() => createQuestion(questionIndex), [questionIndex]);

  useEffect(() => {
    if (timeLeft <= 0 || result) return undefined;

    const timer = window.setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [timeLeft, result]);

  useEffect(() => {
    if (timeLeft === 0 && !result) {
      submitResult(score);
    }
  }, [timeLeft, result, score]);

  const handleAnswer = (event) => {
    event.preventDefault();
    if (Number(answer) === question.answer) {
      setScore((current) => current + 1);
    }

    setAnswer("");
    setQuestionIndex((current) => current + 1);
  };

  const submitResult = async (finalScore) => {
    setSubmitting(true);
    const data = await apiClient.post(
      `/games/matches/${matchId}/result`,
      { score: finalScore, accuracy: 100 },
      token
    );
    updateWalletBalance(data.result.walletBalance);
    setResult(data.result);
    setSubmitting(false);
  };

  return (
    <main className="game-layout">
      <section className="game-board">
        <div className="game-header-row">
          <div>
            <span className="eyebrow">Speed Math</span>
            <h1>Solve as many as you can in 35 seconds.</h1>
          </div>
          <div className="timer-pill">{timeLeft}s</div>
        </div>

        {!result ? (
          <>
            <div className="question-card">
              <p>Question #{questionIndex + 1}</p>
              <h2>{question.prompt}</h2>
            </div>
            <form className="answer-form" onSubmit={handleAnswer}>
              <input
                autoFocus
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type your answer"
                type="number"
                value={answer}
              />
              <button className="primary-button" disabled={timeLeft === 0} type="submit">
                Submit
              </button>
            </form>
            <p className="score-text">Correct answers: {score}</p>
          </>
        ) : (
          <div className="result-card">
            <h2>{result.playerWon ? "You won the match" : "You lost the match"}</h2>
            <p>Your score: {result.playerScore}</p>
            <p>Opponent score: {result.opponentScore}</p>
            <p>
              {result.playerWon
                ? `Wallet credited with Rs ${result.winnerAmount}`
                : `Wallet refunded with Rs ${result.refundAmount}`}
            </p>
            <button className="primary-button" onClick={() => navigate("/profile")} type="button">
              Go to Profile
            </button>
          </div>
        )}

        {submitting ? <p>Submitting result...</p> : null}
      </section>
    </main>
  );
};
