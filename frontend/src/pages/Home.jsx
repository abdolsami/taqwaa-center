import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Home = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch prayer times from Aladhan API for Commerce City, CO
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          "https://api.aladhan.com/v1/timings?latitude=39.8282&longitude=-104.8202&method=2&tune=0,-3,2,4,2,3"
        );
        const data = await response.json();
        if (data.data && data.data.timings) {
          setPrayerTimes(data.data.timings);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);
  const programs = [
    {
      title: "Daily Prayers",
      description:
        "Join us for the five daily prayers. Our masjid provides a peaceful, welcoming environment for all community members to gather in worship.",
      icon: "🕌",
    },
    {
      title: "Quran Study Circles",
      description:
        "Deepen your understanding of the Quran through structured study sessions. Expert instructors guide discussions on interpretation and application.",
      icon: "📖",
    },
    {
      title: "Islamic Education",
      description:
        "Classes for all ages covering Islamic fundamentals, history, ethics, and contemporary issues in light of Islamic teachings.",
      icon: "🎓",
    },
    {
      title: "Youth Programs",
      description:
        "Engaging activities and mentorship for young Muslims to build community, develop leadership skills, and strengthen faith.",
      icon: "👥",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />

      {/* Programs Section */}
      <section
        id="programs"
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-islamic-green-900 mb-4">
              Our Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive spiritual and educational offerings designed to
              nurture faith, knowledge, and community.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-islamic-green-600"
              >
                <div className="text-5xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-bold text-islamic-green-900 mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {program.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen bg-gradient-to-br from-islamic-green-900 via-islamic-green-800 to-islamic-green-700 py-20 px-4 sm:px-6 lg:px-8 text-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Reach out to us
              through any of the methods below.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-bold mb-3">Address</h3>
              <p className="text-white/80">
                6675 Brighton Blvd
                <br />
                Commerce City, CO 80022
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-2xl font-bold mb-3">Phone</h3>
              <p className="text-white/80">
                (720) TBD-XXXX
                <br />
                Available Monday-Sunday
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="text-2xl font-bold mb-3">Email</h3>
              <p className="text-white/80">
                info@taqwacenter.com
                <br />
                support@taqwacenter.com
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-white/90 mb-6">
              We welcome visitors of all backgrounds. Feel free to visit us
              during prayer times or contact us for more information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Find Us Section */}
      <section
        id="find-us"
        className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-islamic-green-900 mb-4">
              Visit Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Located in the heart of our community, we welcome all to
              experience the warmth and spirituality of Taqwa Center.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
              <div>
                <h3 className="text-2xl font-bold text-islamic-green-900 mb-6">
                  Prayer Times & Hours
                </h3>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading prayer times...</p>
                  </div>
                ) : prayerTimes ? (
                  <div className="space-y-4">
                    {[
                      { name: "Fajr", key: "Fajr" },
                      { name: "Dhuhr", key: "Dhuhr" },
                      { name: "Asr", key: "Asr" },
                      { name: "Maghrib", key: "Maghrib" },
                      { name: "Isha", key: "Isha" },
                    ].map((prayer, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="font-semibold text-gray-700">
                          {prayer.name}
                        </span>
                        <span className="text-islamic-green-600 font-bold">
                          {prayerTimes[prayer.key]}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Unable to load prayer times</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-islamic-green-900 mb-6">
                  Facilities & Amenities
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {[
                    "✓ Climate-controlled prayer hall",
                    "✓ Separate women's prayer area",
                    "✓ Children's care facility",
                    "✓ Ablution facilities",
                    "✓ Parking available",
                    "✓ Community library",
                    "✓ Meeting rooms for events",
                    "✓ Accessible for all abilities",
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-lg"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contribute Section */}
      <section
        id="contribute"
        className="min-h-screen bg-gradient-to-br from-islamic-gold-50 to-islamic-gold-100 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-islamic-green-900 mb-4">
              Support Our Mission
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Your contributions help us maintain and expand our services to the
              community.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {[
              {
                title: "Financial Donations",
                description:
                  "Your generous contributions support our day-to-day operations, programs, and facility maintenance.",
                icon: "💰",
              },
              {
                title: "Volunteer",
                description:
                  "Share your skills and time. We welcome volunteers for programs, events, and community outreach.",
                icon: "🤝",
              },
              {
                title: "In-Kind Donations",
                description:
                  "Donate books, learning materials, prayer supplies, or other resources to support our community.",
                icon: "📦",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-islamic-green-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-12 shadow-xl text-center"
          >
            <h3 className="text-2xl font-bold text-islamic-green-900 mb-4">
              "Charity is not diminished by giving." - Prophet Muhammad ﷺ
            </h3>
            <p className="text-gray-600 mb-8">
              Every contribution, no matter the size, makes a meaningful
              difference in our community. Your support empowers us to continue
              our mission of fostering knowledge, spirituality, and unity.
            </p>
            <button className="bg-islamic-green-600 hover:bg-islamic-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg">
              Make a Donation
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
