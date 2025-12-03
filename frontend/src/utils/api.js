const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://taqwaa-center.onrender.com/api"
    : "http://localhost:5000/api");

/**
 * Create a membership checkout session for a selected subscription plan
 * @param {string} priceId - The Stripe price ID (monthly, semi-annual, or yearly)
 * @returns {Promise<{url: string, sessionId: string}>}
 */
export const createMembershipSession = async (priceId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/checkout/create-membership-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
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
