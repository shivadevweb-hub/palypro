import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import cors from "cors";

const isProduction = process.env.NODE_ENV === "production";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000; // Hardcoded per platform guidelines

  app.use(cors());
  app.use(express.json());

    // Health check for deployment monitoring
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", environment: isProduction ? "production" : "development" });
    });

    // Global Error Handler for API
    const apiErrorHandler = (err: any, req: any, res: any, next: any) => {
      console.error("Express API Error:", err);
      if (res.headersSent) {
        return next(err);
      }
      const statusCode = err.status || err.statusCode || 500;
      res.status(statusCode).json({ 
        error: err.message || "Internal Server Error",
        details: isProduction ? undefined : err.stack
      });
    };

  // Razorpay instance
  let razorpay: Razorpay | null = null;
  
  const getRazorpay = () => {
    if (!razorpay) {
      const key_id = process.env.VITE_RAZORPAY_KEY_ID;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      
      if (!isProduction) {
        console.log("Checking Razorpay Env Vars (Dev Mode):", { 
          key_id_exists: !!key_id, 
          key_secret_exists: !!key_secret 
        });
      }
      
      if (!key_id || !key_secret) {
        throw new Error(`Razorpay credentials missing. Please set VITE_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.`);
      }
      
      razorpay = new Razorpay({
        key_id,
        key_secret,
      });
    }
    return razorpay;
  };

  // API Routes
  app.post("/api/payment/order", async (req, res, next) => {
    console.log("POST /api/payment/order hit", { hasBody: !!req.body, amount: req.body?.amount });
    try {
      const { amount, currency = "INR", receipt } = req.body;
      
      if (amount === undefined || amount === null) {
        return res.status(400).json({ error: "Amount is required" });
      }

      console.log("Initializing Razorpay...");
      const rzp = getRazorpay();
      
      const options = {
        amount: Math.round(Number(amount) * 100), // Amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      };

      console.log("Creating Razorpay Order with options:", options);
      const order = await rzp.orders.create(options);
      console.log("Order created successfully:", order.id);
      res.json(order);
    } catch (error: any) {
      console.error("Razorpay Order Route Error:", error);
      next(error); 
    }
  });

  // Apply error handler after API routes
  app.use("/api", apiErrorHandler);

  // 404 handler for any unmatched /api routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.originalUrl}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
