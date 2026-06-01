import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";

// Load environment variables. Try to read from .env first, forcing override to ensure local changes are applied
dotenv.config({ override: true });

const isProduction = process.env.NODE_ENV === "production";

const sanitizeEnv = (val: string | undefined): string => {
  if (!val) return "";
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1).trim();
  }
  return s;
};

let razorpayClient: Razorpay | null = null;

const getRazorpay = (): Razorpay => {
  if (!razorpayClient) {
    const keyId = sanitizeEnv(process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID);
    const keySecret = sanitizeEnv(process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET);
    
    if (!keyId || !keySecret) {
      console.error("❌ Razorpay configuration missing on the server backend! Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
      throw new Error("Razorpay configuration missing on backend. Please ensure the server-side environment has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET set correctly.");
    }
    
    console.log(`[Razorpay Server SDK] Initializing instance with Key ID: ${keyId.substring(0, 10)}... (length: ${keyId.length}), Secret length: ${keySecret.length}`);
    razorpayClient = new (Razorpay as any)({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return razorpayClient;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  console.log("Starting server in", isProduction ? "production" : "development", "mode.");

  // Logging middleware
  app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    }
    next();
  });

  // Health check for deployment monitoring
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", environment: isProduction ? "production" : "development" });
  });

  // Create real Razorpay order
  app.post("/api/payment/order", async (req, res) => {
    try {
      const { amount, currency = "INR", receipt } = req.body;
      if (amount === undefined || amount === null) {
        return res.status(400).json({ error: "Amount is required" });
      }

      console.log(`[API /api/payment/order] Creating order of amount: ₹${amount}`);
      const rzp = getRazorpay();

      // Convert rupees to paise (paise = rupees * 100)
      const options = {
        amount: Math.round(Number(amount) * 100),
        currency,
        receipt: receipt || `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
      };

      const order = await rzp.orders.create(options);
      console.log(`[API /api/payment/order] Successfully created Razorpay order:`, order.id);
      res.json(order);
    } catch (err: any) {
      console.error("[API /api/payment/order] Failure creating Razorpay order:", err);
      const msg = err?.error?.description || err.message || "Failed to create secure Razorpay order";
      res.status(500).json({ error: msg });
    }
  });

  // Secure Cryptographic Signature Verification
  app.post("/api/payment/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      console.log(`[API /api/payment/verify] Verification request received. Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`);

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing verification parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required." });
      }

      const keySecret = sanitizeEnv(process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET);
      if (!keySecret) {
        console.error("❌ Critical: RAZORPAY_KEY_SECRET is not configured or is empty on server.");
        return res.status(500).json({ error: "Server credentials missing. Cryptographic checking is unavailable." });
      }

      // Check signature: HMAC SHA256 of "order_id|payment_id" signed with Key Secret
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature, "utf-8"),
        Buffer.from(razorpay_signature, "utf-8")
      );

      if (isValid) {
        console.log("✅ [API /api/payment/verify] Signature verified successfully!");
        res.json({ success: true, verified: true });
      } else {
        console.error("❌ [API /api/payment/verify] Signature verification mismatched!");
        res.status(400).json({ success: false, verified: false, error: "Payment verification failed: cryptographic signature mismatch." });
      }
    } catch (err: any) {
      console.error("[API /api/payment/verify] Core signature logic failure:", err);
      res.status(500).json({ error: err.message || "Internal payment signature check failure" });
    }
  });

  // Vite/Static Setup
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html for all non-API routes
    app.get('*', (req, res) => {
      if (req.url.startsWith('/api')) {
        return res.status(404).json({ error: `API route not found: ${req.url}` });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer().catch(err => {
  console.error("Critical failure during server startup:", err);
  process.exit(1);
});

