import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import membershipRoutes, { handleStripeWebhook } from "./routes/membership.js";

// Load environment variables
dotenv.config();

const app = express();

// When running behind a proxy (Render, Heroku, etc.) trust the first proxy
// so express-rate-limit and other middleware can read the correct client IP from X-Forwarded-For
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

// Security: set common HTTP headers
app.use(helmet());

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Basic rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Middleware - Allow multiple origins for development and production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://taqwaa-center.onrender.com", // Frontend URL if deployed on Render
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      // Allow all origins in development for convenience
      if (process.env.NODE_ENV === "development") return callback(null, true);

      // In production, reject unknown origins
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg));
    },
    credentials: true,
  })
);

// Mount the Stripe webhook route with a raw body parser BEFORE json/body parsers
// Stripe requires the raw request body to verify signatures.
app.post(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    // Delegate to the handler exported from membership router
    return handleStripeWebhook(req, res, next);
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);
app.use("/api/checkout", membershipRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Taqwa Center API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

export default app;
