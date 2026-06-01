export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processPayment = async (options: {
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme?: {
    color?: string;
  };
}): Promise<{
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}> => {
  console.log("Razorpay: Starting processPayment for order:", options.order_id);
  
  const isLoaded = await loadRazorpay();
  if (!isLoaded || !(window as any).Razorpay) {
    throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
  }

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!razorpayKey) {
    throw new Error("Razorpay Key ID missing from client environments. Please ensure VITE_RAZORPAY_KEY_ID is populated.");
  }

  return new Promise((resolve, reject) => {
    const checkoutOptions: RazorpayOptions = {
      key: razorpayKey,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: options.order_id,
      prefill: options.prefill,
      theme: options.theme || { color: "#3B82F6" },
      handler: (response) => {
        console.log("Razorpay SDK: Payment succeeded!", response);
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          console.log("Razorpay SDK: Modal dismissed by user");
          reject(new Error("Payment cancelled by user"));
        }
      }
    };

    try {
      const rzpCheck = new (window as any).Razorpay(checkoutOptions);
      rzpCheck.on('payment.failed', function (response: any) {
        console.error("Razorpay SDK: Payment transaction failed", response.error);
        reject(new Error(`Payment failed: ${response.error.description || 'Unknown error occurred'}`));
      });
      rzpCheck.open();
    } catch (e) {
      console.error("Razorpay SDK init error:", e);
      reject(e);
    }
  });
};
