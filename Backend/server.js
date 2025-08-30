require("dotenv").config();
const express = require('express');
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Healthcheck
app.get("/", (_, res) => res.send("Event Management API is running"));

// Global 404

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`sever listening on port ${PORT}`));
});


