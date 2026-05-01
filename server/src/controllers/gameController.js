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

  const currentUser = await User.findById(req.user._id);
  if (currentUser.walletBalance < parsedEntryFee) {
    return res.status(400).json({ message: "Insufficient wallet balance." });
  }

  currentUser.walletBalance -= parsedEntryFee;
  currentUser.walletTransactions.unshift({
    type: "match-entry",
    amount: -parsedEntryFee,
    note: `${game.title} match entry deducted.`
  });
  await currentUser.save();

  const payout = calculateMatchPayout(parsedEntryFee);

  const match = await Match.create({
    createdBy: currentUser._id,
    gameKey,
    entryFee: parsedEntryFee,
    status: "live",
    participants: [
      { user: currentUser._id, displayName: currentUser.fullName, score: 0, accuracy: 0 },
      { user: null, displayName: "Quick Rival", score: 0, accuracy: 0 }
    ],
    payout
  });

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

  const match = await Match.findById(matchId);
  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }
  if (String(match.createdBy) !== String(req.user._id)) {
    return res.status(403).json({ message: "You cannot submit this match result." });
  }
  if (match.status === "completed") {
    return res.status(400).json({ message: "This match result was already submitted." });
  }

  const player = await User.findById(req.user._id);
  if (!player) {
    return res.status(404).json({ message: "User not found." });
  }

  const simulatedOpponentScore = Math.max(1, Math.floor(Math.random() * 12));
  const playerWon = Number(score) >= simulatedOpponentScore;

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
      score: Number(score),
      accuracy: Number(accuracy)
    },
    {
      user: null,
      displayName: "Quick Rival",
      score: simulatedOpponentScore,
      accuracy: 100
    }
  ];

  await Promise.all([player.save(), match.save()]);

  res.json({
    result: {
      playerWon,
      playerScore: Number(score),
      opponentScore: simulatedOpponentScore,
      winnerAmount: playerWon ? match.payout.winnerAmount : 0,
      refundAmount: playerWon ? 0 : match.payout.loserRefund,
      walletBalance: player.walletBalance
    }
  });
};
