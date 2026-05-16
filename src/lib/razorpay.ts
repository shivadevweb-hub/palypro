
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

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  console.log("Razorpay: Key Status:", razorpayKey ? "Present" : "MISSING");

  if (!razorpayKey) {
    throw new Error("Razorpay Key ID missing. Please check VITE_RAZORPAY_KEY_ID in .env");
  }

  return new Promise((resolve, reject) => {
    console.log("Razorpay: Initializing modal...");
    try {
      const rzp = new window.Razorpay({
        key: razorpayKey,
        ...options,
        handler: (response: any) => {
          console.log("Razorpay: Payment Success");
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay: User closed modal");
            reject(new Error("Payment cancelled by user"));
          },
        },
      });

      console.log("Razorpay: Calling rzp.open()");
      rzp.open();
    } catch (e: any) {
      console.error("Razorpay: Failed to open modal", e);
      reject(e);
    }
  });
};
