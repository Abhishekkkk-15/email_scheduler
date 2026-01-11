import mongoose, { models } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    image: {
      type: String,
    },

    provider: {
      type: String,
      default: "google",
    },
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", userSchema);
