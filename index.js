import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import matchesRouter from "./routes/matches.js";
import votesRouter from "./routes/votes.js";
import predictionsRouter from "./routes/predictions.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ipl-predict-server.onrender.com/",
  "https://ipl-predict-server.onrender.com/api",
  "https://ipl-predict-two.vercel.app/",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/matches", matchesRouter);
app.use("/api/votes", votesRouter);
app.use("/api/predictions", predictionsRouter);
app.use("/api/auth", authRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "IPL Predictor API running with MongoDB 🏏" });
});

app.listen(PORT, () => {
  console.log(`🏏 IPL Predictor API → http://localhost:${PORT}`);
});
