import mongoose from "mongoose";
import { Match } from "../models/Match.js";
import { User } from "../models/User.js";
import { gameCatalog, typingPrompts } from "../data/games.js";
import { calculateMatchPayout } from "../utils/wallet.js";

const validateEntryFee = (game, entryFee) =>
  game.supportedEntryFees.includes(Number(entryFee));

const createMockOpponent = () => ({
  name: "Quick Rival",
  avatarSeed: "quick-rival"
});

export const getGames = async (req, res) => {
  const totals = await Match.aggregate([
    {
      $group: {
        _id: "$gameKey",
        matchesPlayed: { $sum: 1 }
      }
    }
  ]);

  const totalsByGame = new Map(
    totals.map((item) => [item._id, item.matchesPlayed])
  );

  const games = gameCatalog.map((game) => ({
    ...game,
    matchesPlayed: totalsByGame.get(game.key) || 0
  }));

  res.json({ games });
};

export const createMatch = async (req, res) => {
  const { gameKey, entryFee } = req.body;
  const game = gameCatalog.find((item) => item.key === gameKey);

  if (!game) {
    return res.status(404).json({ message: "Game not found." });
  }

  const parsedEntryFee = Number(entryFee || game.defaultEntryFee);
  if (!validateEntryFee(game, parsedEntryFee)) {
    return res.status(400).json({ message: "Unsupported entry fee for this game." });
  }

  const session = await mongoose.startSession();
  let currentUser;
  let match;
  const payout = calculateMatchPayout(parsedEntryFee);

  try {
    await session.withTransaction(async () => {
      currentUser = await User.findById(req.user._id).session(session);

      if (!currentUser) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }

      if (currentUser.walletBalance < parsedEntryFee) {
        const error = new Error("Insufficient wallet balance.");
        error.statusCode = 400;
        throw error;
      }

      currentUser.walletBalance -= parsedEntryFee;
      currentUser.walletTransactions.unshift({
        type: "match-entry",
        amount: -parsedEntryFee,
        note: `${game.title} match entry deducted.`
      });
      await currentUser.save({ session });

      [match] = await Match.create(
        [
          {
            createdBy: currentUser._id,
            gameKey,
            entryFee: parsedEntryFee,
            status: "live",
            participants: [
              {
                user: currentUser._id,
                displayName: currentUser.fullName,
                score: 0,
                accuracy: 0
              },
              { user: null, displayName: "Quick Rival", score: 0, accuracy: 0 }
            ],
            payout
          }
        ],
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  res.status(201).json({
    match: {
      id: match._id,
      gameKey,
      entryFee: parsedEntryFee,
      status: match.status,
      payout,
      opponent: createMockOpponent(),
      typingPrompt:
        gameKey === "typing-race"
          ? typingPrompts[Math.floor(Math.random() * typingPrompts.length)]
          : null,
      durationSeconds: game.durationSeconds
    },
    userWalletBalance: currentUser.walletBalance
  });
};

export const submitMatchResult = async (req, res) => {
  const { matchId } = req.params;
  const { score, accuracy = 0 } = req.body;

  if (!mongoose.isValidObjectId(matchId)) {
    return res.status(400).json({ message: "Invalid match id." });
  }

  const normalizedScore = Number(score);
  const normalizedAccuracy = Number(accuracy);

  if (!Number.isFinite(normalizedScore) || normalizedScore < 0) {
    return res.status(400).json({ message: "Score must be a valid non-negative number." });
  }

  if (!Number.isFinite(normalizedAccuracy) || normalizedAccuracy < 0) {
    return res
      .status(400)
      .json({ message: "Accuracy must be a valid non-negative number." });
  }

  const session = await mongoose.startSession();
  let resultPayload;

  try {
    await session.withTransaction(async () => {
      const match = await Match.findById(matchId).session(session);
      if (!match) {
        const error = new Error("Match not found.");
        error.statusCode = 404;
        throw error;
      }

      if (String(match.createdBy) !== String(req.user._id)) {
        const error = new Error("You cannot submit this match result.");
        error.statusCode = 403;
        throw error;
      }

      if (match.status === "completed") {
        const error = new Error("This match result was already submitted.");
        error.statusCode = 400;
        throw error;
      }

      const player = await User.findById(req.user._id).session(session);
      if (!player) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }

      const simulatedOpponentScore = Math.max(1, Math.floor(Math.random() * 12));
      const playerWon = normalizedScore >= simulatedOpponentScore;

      if (playerWon) {
        player.walletBalance += match.payout.winnerAmount;
        player.walletTransactions.unshift({
          type: "match-win",
          amount: match.payout.winnerAmount,
          note: `Won ${match.gameKey} match and received 75% of pool.`
        });
        match.winner = player._id;
      } else {
        player.walletBalance += match.payout.loserRefund;
        player.walletTransactions.unshift({
          type: "match-refund",
          amount: match.payout.loserRefund,
          note: `Lost ${match.gameKey} match and received 25% refund.`
        });
      }

      match.status = "completed";
      match.participants = [
        {
          user: player._id,
          displayName: player.fullName,
          score: normalizedScore,
          accuracy: normalizedAccuracy
        },
        {
          user: null,
          displayName: "Quick Rival",
          score: simulatedOpponentScore,
          accuracy: 100
        }
      ];

      await Promise.all([player.save({ session }), match.save({ session })]);

      resultPayload = {
        playerWon,
        playerScore: normalizedScore,
        opponentScore: simulatedOpponentScore,
        winnerAmount: playerWon ? match.payout.winnerAmount : 0,
        refundAmount: playerWon ? 0 : match.payout.loserRefund,
        walletBalance: player.walletBalance
      };
    });
  } finally {
    await session.endSession();
  }

  res.json({
    result: resultPayload
  });
};
