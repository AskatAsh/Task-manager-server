const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, maxlength: 200 },
  timestamp: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ["To-Do", "In Progress", "Done"],
    default: "To-Do",
  },
  userId: { type: String, required: true },
  position: { type: Number, default: 0 },
});

module.exports = mongoose.model("Task", TaskSchema);
