const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// add a new task
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

// get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.query.userId }).sort({
      position: 1,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// update a task
router.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, category, position } = req.body;
    await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
      category,
      position,
    });
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// reorder tasks
router.put("/tasks/reorder", async (req, res) => {
  try {
    const updates = req.body; // List of tasks with updated positions
    for (let task of updates) {
      await Task.findByIdAndUpdate(task._id, { position: task.position });
    }
    res.json({ message: "Task order updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task order" });
  }
});

// delete a task
router.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;