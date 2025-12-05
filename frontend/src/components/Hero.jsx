import { useState } from "react";
import { motion } from "framer-motion";
import { createMembershipSession } from "../utils/api";

const Hero = () => {
  const [isLoadingMembership, setIsLoadingMembership] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  // Plan configurations
  const plans = [
    {
      id: "monthly",
      label: "Monthly",
    },
    {
      id: "six_months",
      label: "6 Months",
    },
    {
      id: "yearly",
      label: "Yearly",
    },
  ];

  const handleLearnMore = () => {
    const element = document.querySelector("#programs");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBecomeMember = () => {
    setShowPlanSelector(true);
  };

  const handleSelectPlan = async (plan) => {
    if (!plan) {
      alert("Please select a plan.");
      return;
    }
    setIsLoadingMembership(true);
    try {
      const { url } = await createMembershipSession(plan);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      let message = "Failed to start membership checkout. Please try again.";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      alert(message);
      setIsLoadingMembership(false);
      setShowPlanSelector(false);
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden bg-green-900"
    >
      <div className="relative z-10 w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl border border-green-800 bg-green-900">
        {/* Landing page heading and description */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center pt-8">
          Welcome to Taqwaa Center
        </h1>
        <p className="text-lg md:text-2xl text-white/90 mb-10 text-center px-2 md:px-8">
          A place of worship, community, and growth. Join us and become a member
          today!
        </p>

        {/* Buttons */}
        <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center px-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLearnMore}
            className="px-6 xs:px-8 py-3 xs:py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm xs:text-base sm:text-lg"
          >
            Learn More
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBecomeMember}
            disabled={isLoadingMembership}
            className={`px-6 xs:px-8 py-3 xs:py-4 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm xs:text-base sm:text-lg border-2 border-white/20 ${
              isLoadingMembership ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoadingMembership
              ? "Redirecting to secure payment..."
              : "Become a Member"}
          </motion.button>
        </div>

        {/* Plan Selector Modal */}
        {showPlanSelector && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !isLoadingMembership && setShowPlanSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-4 xs:p-6 sm:p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 xs:mb-6">
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-green-900">
                  Choose Your Membership Plan
                </h2>
                {isLoadingMembership ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeOpacity="0.25"
                      ></circle>
                      <path
                        d="M22 12a10 10 0 00-10-10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                    Starting secure checkout...
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPlanSelector(false)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Close
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-4 xs:mb-6">
                {plans.map((plan) => (
                  <motion.button
                    key={plan.id}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isLoadingMembership}
                    className="flex-1 min-w-[180px] bg-white text-green-900 border border-green-200 rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition transform-gpu duration-200 flex flex-col items-center text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-lg sm:text-xl font-semibold">
                      {plan.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
