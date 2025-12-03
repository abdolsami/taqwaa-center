import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createMembershipSession } from "../utils/api";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Programs", href: "#programs" },
    { name: "Services", href: "#services" },
    { name: "Contact Us", href: "#contact" },
    { name: "Find Us", href: "#find-us" },
    { name: "Contribute", href: "#contribute" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBecomeMember = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
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
    <>
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
            className="bg-white rounded-lg p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-islamic-green-900 mb-6">
              Choose Your Membership Plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {plans.map((plan) => (
                <motion.button
                  key={plan.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSelectPlan(plan.priceId)}
                  disabled={isLoadingMembership}
                  className="p-4 border-2 border-islamic-green-600 rounded-lg hover:bg-islamic-green-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-lg font-semibold text-islamic-green-900">
                    {plan.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {isLoadingMembership ? "Processing..." : "Select this plan"}
                  </div>
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => setShowPlanSelector(false)}
              disabled={isLoadingMembership}
              className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <img
                src="/images/taqwa-center-logo.jpeg"
                alt="Taqwa Center Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-bold text-gradient font-elegant">
                Taqwa Center
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isScrolled
                      ? "text-gray-700 hover:text-islamic-green-600"
                      : "text-white hover:text-islamic-gold-300"
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.button
                onClick={handleBecomeMember}
                disabled={isLoadingMembership}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isScrolled
                    ? "bg-islamic-green-600 hover:bg-islamic-green-700 text-white"
                    : "bg-islamic-gold-500 hover:bg-islamic-gold-600 text-white"
                } ${
                  isLoadingMembership ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoadingMembership ? "Redirecting..." : "Become a Member"}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block px-4 py-2 text-gray-700 hover:bg-islamic-green-50 hover:text-islamic-green-600 rounded-lg transition-colors font-semibold"
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={handleBecomeMember}
              disabled={isLoadingMembership}
              className={`w-full px-4 py-2 bg-islamic-green-600 hover:bg-islamic-green-700 text-white font-semibold rounded-lg transition-colors ${
                isLoadingMembership ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoadingMembership ? "Redirecting..." : "Become a Member"}
            </button>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
};

export default NavBar;
