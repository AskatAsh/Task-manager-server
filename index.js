const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const taskRoutes = require("./routes/taskRoutes");


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Use Routes
app.use("/api", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task management server is running.");
})

// Start Server
app.listen(port, () => console.log("Server running on port: ", port));