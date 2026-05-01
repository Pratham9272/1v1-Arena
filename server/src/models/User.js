import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["bonus", "match-entry", "match-win", "match-refund", "manual"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    note: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    walletBalance: {
      type: Number,
      default: 50
    },
    bonusGranted: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ["player", "admin"],
      default: "player"
    },
    walletTransactions: {
      type: [walletTransactionSchema],
      default: () => [
        {
          type: "bonus",
          amount: 50,
          note: "Welcome bonus credited for new signup."
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);
