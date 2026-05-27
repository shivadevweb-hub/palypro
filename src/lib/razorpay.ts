
export interface RazorpayOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler: (response: any) => void;
  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const processPayment = async (options: Partial<RazorpayOptions>) => {
  console.log("Razorpay: processPayment called", { order_id: options.order_id });

  const isLoaded = window.Razorpay ? true : await loadRazorpay();

  if (!isLoaded) {
    throw new Error("Razorpay SDK failed to load. Are you online?");
  }

  let razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  try {
    const configRes = await fetch("/api/payment/config");
    if (configRes.ok) {
      const configData = await configRes.json();
      if (configData.keyId) {
        razorpayKey = configData.keyId;
        console.log("Razorpay: Loaded key dynamically from backend config:", razorpayKey);
      }
    }
  } catch (err) {
    console.warn("Razorpay: Failed to fetch key dynamically, using bundled env variable:", err);
  }

  if (!razorpayKey) {
    console.log("Razorpay: VITE_RAZORPAY_KEY_ID was missing in import.meta.env, falling back to default key.");
    razorpayKey = "rzp_live_RBDamiXJvSAFKW";
  }

  const isFallbackTest = options.order_id && options.order_id.startsWith("order_test_fallback_");
  if (isFallbackTest && (!razorpayKey || !razorpayKey.startsWith("rzp_live_"))) {
    console.log("Razorpay Live Mismatch detected: Safe dynamic recovery loading active Razorpay Test Key for full, real-time checkout simulation.");
    razorpayKey = "rzp_test_SpvLFBDRrZonAb";
  }

  console.log("Razorpay: Key Status:", razorpayKey ? `Present (${razorpayKey.substring(0, 10)}...)` : "MISSING");

  return new Promise((resolve, reject) => {
    console.log("Razorpay: Initializing modal...");
    try {
      const checkoutOptions: any = {
        key: razorpayKey,
        amount: options.amount,
        currency: options.currency || "INR",
        name: options.name || "PlayPro Toy Rental",
        description: options.description || "Toy Rental Subscription",
        prefill: options.prefill,
        theme: options.theme || { color: "#FF7A59" },
        handler: (response: any) => {
          console.log("Razorpay: Payment Success", response);
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay: User closed modal");
            reject(new Error("Payment cancelled by user"));
          },
        },
      };

      // Only pass order_id if it is a real order (not empty, not mock, and not a test fallback)
      if (options.order_id && !options.order_id.startsWith("order_mock_") && !options.order_id.startsWith("order_test_fallback_")) {
        checkoutOptions.order_id = options.order_id;
      } else {
        console.log("Razorpay Client Fallback: Opening real-time standard Razorpay modal using Direct Client-Side Capture instead.");
      }

      const rzp = new window.Razorpay(checkoutOptions);

      console.log("Razorpay: Calling rzp.open()");
      rzp.open();
    } catch (e: any) {
      console.error("Razorpay: Failed to open modal", e);
      reject(e);
    }
  });
};
