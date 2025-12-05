const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://taqwaa-center.onrender.com/api"
    : "http://localhost:5000/api");

/**
 * Create a membership checkout session for a selected subscription plan
 * @param {string} plan - The plan key ("monthly", "six_months", or "yearly")
 * @returns {Promise<{url: string, sessionId: string}>}
 */
export const createMembershipSession = async (plan) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/checkout/create-membership-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      }
    );

    if (!response.ok) {
      let errorMsg = "Failed to create checkout session";
      try {
        const error = await response.json();
        if (error && error.error) errorMsg = error.error;
        else if (error && error.message) errorMsg = error.message;
      } catch {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating membership session:", error);
    throw error instanceof Error ? error : new Error("Unknown error");
  }
};
