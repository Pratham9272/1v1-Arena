import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

const getWordStats = (source, typed) => {
  const expectedWords = source.trim().split(/\s+/);
  const typedWords = typed.trim().split(/\s+/);
  const correctWords = typedWords.filter(
    (word, index) => word === expectedWords[index]
  ).length;

  return {
    accuracy: typedWords.length
      ? Number(((correctWords / typedWords.length) * 100).toFixed(2))
      : 0,
    score: correctWords
  };
};

export const TypingRacePage = () => {
  const { matchId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, updateWalletBalance } = useAuth();
  const prompt =
    state?.typingPrompt ||
    "Quick thinking and accurate typing help every player finish the same sentence before the timer expires.";
  const [timeLeft, setTimeLeft] = useState(state?.durationSeconds || 35);
  const [typedText, setTypedText] = useState("");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => getWordStats(prompt, typedText), [prompt, typedText]);

  useEffect(() => {
    if (timeLeft <= 0 || result) return undefined;

    const timer = window.setTimeout(() => setTimeLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [timeLeft, result]);

  useEffect(() => {
    if (timeLeft === 0 && !result) {
      submitRace();
    }
  }, [timeLeft, result]);

  const submitRace = async () => {
    setSubmitting(true);
    const data = await apiClient.post(
      `/games/matches/${matchId}/result`,
      { score: stats.score, accuracy: stats.accuracy },
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
            <span className="eyebrow">Typing Race</span>
            <h1>Type the same sentence faster and more accurately.</h1>
          </div>
          <div className="timer-pill">{timeLeft}s</div>
        </div>

        {!result ? (
          <>
            <div className="typing-prompt">{prompt}</div>
            <textarea
              className="typing-input"
              onChange={(event) => setTypedText(event.target.value)}
              placeholder="Start typing here..."
              value={typedText}
            />
            <div className="typing-stats">
              <span>Correct words: {stats.score}</span>
              <span>Accuracy: {stats.accuracy}%</span>
            </div>
          </>
        ) : (
          <div className="result-card">
            <h2>{result.playerWon ? "You won the race" : "Race lost"}</h2>
            <p>Your correct words: {result.playerScore}</p>
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
