import mongoose, { Schema, models, model } from "mongoose";

const positionSchema = new Schema({
  x: Number,
  y: Number,
});

const nodeSchema = new Schema(
  {
    id: String,
    type: String,
    data: Schema.Types.Mixed,
    position: positionSchema,
    height: Number,
    width: Number,
    selected: Boolean,
  },
  { _id: false }
);

const edgeSchema = new Schema(
  {
    source: String,
    target: String,
  },
  { _id: false }
);

const flowSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },

    nodes: [nodeSchema],
    edges: [edgeSchema],

    completed: {
      type: Boolean,
      default: false,
    },

    taskCompleted: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true, // replaces createdAt
  }
);

export const Flow = models.Flow || model("Flow", flowSchema);
