import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const MembershipSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          {/* Success Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-6"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>

          {/* Main Message */}
          <h1 className="text-4xl sm:text-5xl font-bold text-islamic-green-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 mb-4">
            Welcome to the Taqwa Center community! 🎉
          </p>

          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Your membership has been activated and you'll receive a confirmation
            email shortly. Thank you for joining us in this spiritual journey.
          </p>

          {/* Session ID (optional, for reference) */}

          {/* Manual Action */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => {
              try {
                navigate("/");
              } catch (err) {
                // fallback: reload home if navigation fails
                window.location.href = "/";
              }
            }}
            className="px-8 py-3 bg-islamic-green-600 hover:bg-islamic-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Return to Home
          </motion.button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default MembershipSuccess;
