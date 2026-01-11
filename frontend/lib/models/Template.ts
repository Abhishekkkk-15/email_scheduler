import mongoose, { Schema, models, model } from "mongoose";

const templateSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Template = models.Template || model("Template", templateSchema);
