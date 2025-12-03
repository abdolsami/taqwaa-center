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
      priceId: import.meta.env.VITE_PRICE_ID_MONTHLY,
    },
    {
      id: "semi-annual",
      label: "6 Months",
      priceId: import.meta.env.VITE_PRICE_ID_SEMI_ANNUAL,
    },
    {
      id: "yearly",
      label: "Yearly",
      priceId: import.meta.env.VITE_PRICE_ID_YEARLY,
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

  const handleSelectPlan = async (priceId) => {
    if (!priceId) {
      alert("Price ID not configured. Please contact support.");
      return;
    }

    setIsLoadingMembership(true);

    try {
      const { url } = await createMembershipSession(priceId);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
      alert("Failed to start membership checkout. Please try again.");
      setIsLoadingMembership(false);
      setShowPlanSelector(false);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-islamic-green-900 via-islamic-green-800 to-islamic-green-700"
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      <div className="absolute inset-0 islamic-pattern"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-islamic-gold-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-islamic-gold-300/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 xs:mb-6 font-elegant leading-tight"
          >
            Taqwa Center
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 xs:mb-8 font-light max-w-3xl mx-auto px-2"
          >
            A place of worship, community, and growth.
          </motion.p>

          {/* Plan Selector Modal */}
          {showPlanSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-islamic-green-900">
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
                      onClick={() => handleSelectPlan(plan.priceId)}
                      disabled={isLoadingMembership}
                      aria-disabled={isLoadingMembership}
                      className="flex-1 min-w-[180px] bg-white text-islamic-green-900 border border-islamic-green-200 rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition transform-gpu duration-200 flex flex-col items-center text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="text-lg sm:text-xl font-semibold">
                        {plan.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center px-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLearnMore}
              className="px-6 xs:px-8 py-3 xs:py-4 bg-islamic-gold-500 hover:bg-islamic-gold-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm xs:text-base sm:text-lg"
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
              className={`px-6 xs:px-8 py-3 xs:py-4 bg-islamic-green-600 hover:bg-islamic-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm xs:text-base sm:text-lg border-2 border-white/20 ${
                isLoadingMembership ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoadingMembership
                ? "Redirecting to secure payment..."
                : "Become a Member"}
            </motion.button>
          </div>
        </motion.div>

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
      </div>
    </section>
  );
};

export default Hero;
