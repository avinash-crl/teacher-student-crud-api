require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({
  origin:"*"
}));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Teacher-Student API is running" });
});

app.use("/api/v1/user", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  if (!process.env.JWT_SECRET || !process.env.MONGODB_URL) {
    console.error("Please configure JWT_SECRET and MONGODB_URL in .env");
    process.exit(1);
  }
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
