import express from "express";
import dotenv from "dotenv";
import { initializeDatabase } from "./scripts/initDB.js";
import authRoutes from "./routes/authRoutes.js";
import trainRoutes from "./routes/trainRoutes.js";
import bookingsRoutes from "./routes/bookingsRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();

    app.get("/", (req, res) => {
      res.send("IRCTC API is running...");
    });

    app.use("/auth", authRoutes);
    app.use("/trains", trainRoutes);
    app.use("/bookings", bookingsRoutes);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); 
  }
}

startServer();
