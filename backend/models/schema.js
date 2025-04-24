import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema({
  id: String,
  type: String,
  data: mongoose.Schema.Types.Mixed,
});


const edgeSchema = new mongoose.Schema({
  source: String,
  target: String,
});

const flowSchema = new mongoose.Schema({
  userId: String,
  nodes: [nodeSchema],
  edges: [edgeSchema],
  completed: {
    type: Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  taskCompleted:{
    type: Number
  }
});

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password: {
    type:String,
    required:true
  },
})

export const Flow = mongoose.model("Flow", flowSchema);
export const User = mongoose.model("User", userSchema);
