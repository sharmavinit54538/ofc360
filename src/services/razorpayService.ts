import apiInstance from "@/api/apiInstance";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface CheckoutOptions {
  amountInRupees: number;
  description?: string;
  planName?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (paymentResult: { orderId: string; paymentId: string; signature: string }) => void;
  onError?: (error: any) => void;
  onDismiss?: () => void;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
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
}

export async function processRazorpayCheckout(options: CheckoutOptions): Promise<void> {
  const { amountInRupees, description, planName, prefill, onSuccess, onError, onDismiss } = options;

  // 1. Ensure script is loaded
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
    onError?.(new Error("Razorpay SDK load failure"));
    return;
  }

  // Convert amount to paise (min 100 paise = 1 INR)
  const amountInPaise = Math.max(100, Math.round(amountInRupees * 100));

  try {
    toast.loading("Creating order...", { id: "razorpay-init" });

    // 2. Call backend endpoint to create order
    const createRes = await apiInstance.post("/payments/create-order", {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    toast.dismiss("razorpay-init");

    if (!createRes.data || !createRes.data.order_id) {
      throw new Error("Order creation failed on backend");
    }

    const { order_id, amount, currency, key_id } = createRes.data;
    const razorpayKey = key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TNVkrT9u257lKg";

    // 3. Configure Razorpay modal options
    const rzpOptions = {
      key: razorpayKey,
      amount,
      currency,
      name: "OFC360 HRMS",
      description: description || `Payment for ${planName || "Subscription Plan"}`,
      image: "https://dummyimage.com/128x128/0f172a/ffffff&text=OFC360",
      order_id,
      prefill: {
        name: prefill?.name || "",
        email: prefill?.email || "",
        contact: prefill?.contact || "",
      },
      theme: {
        color: "#6366f1",
      },
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        try {
          toast.loading("Verifying payment...", { id: "razorpay-verify" });

          // 4. Send payment result to backend verification endpoint
          const verifyRes = await apiInstance.post("/payments/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          toast.dismiss("razorpay-verify");

          if (verifyRes.data && verifyRes.data.verified) {
            toast.success("Payment successful! Signature verified.", {
              description: `Payment ID: ${response.razorpay_payment_id}`,
              duration: 6000,
            });
            onSuccess?.({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          } else {
            toast.error("Payment verification failed!", {
              description: "Signature mismatch detected. Payment was not completed.",
            });
            onError?.(new Error("Signature verification failed"));
          }
        } catch (verifyError: any) {
          toast.dismiss("razorpay-verify");
          const msg = verifyError?.response?.data?.detail || verifyError?.message || "Verification failed";
          toast.error("Payment verification error", { description: msg });
          onError?.(verifyError);
        }
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment cancelled by user.");
          onDismiss?.();
        },
      },
    };

    const rzp = new window.Razorpay(rzpOptions);

    rzp.on("payment.failed", function (response: any) {
      toast.error("Payment failed", {
        description: response.error?.description || "Payment process failed",
      });
      onError?.(response.error);
    });

    rzp.open();
  } catch (err: any) {
    toast.dismiss("razorpay-init");
    const errMsg = err?.response?.data?.detail || err?.message || "Unable to start checkout";
    toast.error("Checkout Initialization Error", { description: errMsg });
    onError?.(err);
  }
}
