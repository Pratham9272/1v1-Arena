import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    displayName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const payoutSchema = new mongoose.Schema(
  {
    winnerAmount: {
      type: Number,
      required: true
    },
    loserRefund: {
      type: Number,
      required: true
    },
    totalPool: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    gameKey: {
      type: String,
      required: true
    },
    entryFee: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["queued", "live", "completed"],
      default: "queued"
    },
    participants: {
      type: [participantSchema],
      validate: (participants) => participants.length === 2
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    payout: payoutSchema
  },
  {
    timestamps: true
  }
);

export const Match = mongoose.model("Match", matchSchema);
