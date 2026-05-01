import { User } from "../models/User.js";
import { Match } from "../models/Match.js";
import { gameCatalog } from "../data/games.js";

export const getDashboard = async (req, res) => {
  const [users, matches] = await Promise.all([
    User.find().select("-passwordHash").sort({ createdAt: -1 }),
    Match.find().sort({ createdAt: -1 }).populate("winner", "fullName email")
  ]);

  const totalWalletHeld = users.reduce(
    (sum, user) => sum + Number(user.walletBalance || 0),
    0
  );
  const totalPrizeDistributed = matches.reduce(
    (sum, match) => sum + Number(match.payout?.winnerAmount || 0),
    0
  );
  const totalRefundDistributed = matches.reduce(
    (sum, match) => sum + Number(match.payout?.loserRefund || 0),
    0
  );

  res.json({
    stats: {
      totalUsers: users.length,
      totalMatches: matches.length,
      totalWalletHeld,
      totalPrizeDistributed,
      totalRefundDistributed
    },
    games: gameCatalog,
    users,
    matches
  });
};
