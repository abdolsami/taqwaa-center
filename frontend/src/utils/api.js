const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://taqwaa-center.onrender.com/api"
    : "http://localhost:5000/api");

/**
 * Create a membership checkout session with multiple subscription plans
 * User selects the plan (monthly or yearly) inside Stripe Checkout
 * @returns {Promise<{url: string, sessionId: string}>}
 */
export const createMembershipSession = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/checkout/create-membership-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create checkout session");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating membership session:", error);
    throw error;
  }
};
