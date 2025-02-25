const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// add new tasks route
router.post("/tasks", async (req, res) => {
  try {
    const { title, description, category, userId } = req.body;

    // Get the highest position value in the category
    const lastTask = await Task.findOne({ category, userId }).sort({
      position: -1,
    });
    const newPosition = lastTask ? lastTask.position + 1 : 0;

    const newTask = new Task({
      title,
      description,
      category,
      userId,
      position: newPosition,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});


module.exports = router;