import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

//Import Routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchListRoutes from "./routes/watchListRoutes.js";

//Load variables
config();
connectDB();

const app = express();

//Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchListRoutes);


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

//Handle unhandled promise rejection eg database connection errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Unhandled Exception:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//Graceful shutdown
process.on("SIGTERM", async () => {
  console.error("SIGTERM recieved shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

//GET, POST, PUT, DELETE
//http://localhost:5001

//AUTH - Signin, Signup
//MOVIE - GETTING ALL MOVIES
//USER - Profile
//WATCHLIST
