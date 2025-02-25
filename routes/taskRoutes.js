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
    console.error("Error creating task:", error);
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
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// update a task
// router.put("/tasks/:id", async (req, res) => {
//   try {
//     const { title, description, category, position } = req.body;
//     if (!title || !category || typeof position !== "number") {
//       return res.status(400).json({ error: "Invalid data provided" });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       { title, description, category, position },
//       { new: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ error: "Task not found" });
//     }

//     res.json({ message: "Task updated successfully", task: updatedTask });
//   } catch (error) {
//     console.error("Error updating task:", error);
//     res.status(500).json({ error: "Failed to update task" });
//   }
// });

// reorder tasks
router.put("/tasks/reorder", async (req, res) => {
  // console.log("Reorder tasks:", req.body);
  try {
    const updates = req.body; // Get tasks from the 'tasks' key in the request body

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    for (let task of updates) {
      if (!task._id || typeof task.position !== "number") {
        return res.status(400).json({ error: "Invalid task data" });
      }

      const updatedTask = await Task.findByIdAndUpdate(task._id, {
        position: task.position,
        category: task.category, // Ensure category update is also handled
      });

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
    }

    res.json({ message: "Task order updated successfully" });
  } catch (error) {
    console.error("Error reordering tasks:", error);
    res.status(500).json({ error: "Failed to update task order" });
  }
});

// delete a task
router.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;