import { useState } from 'react'
import { motion } from 'framer-motion'
import { createMembershipSession } from '../utils/api'

const Hero = () => {
  const [isLoadingMembership, setIsLoadingMembership] = useState(false)

  const handleLearnMore = () => {
    const element = document.querySelector('#programs')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleBecomeMember = async () => {
    setIsLoadingMembership(true)

    try {
      const { url } = await createMembershipSession()
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      alert('Failed to start membership checkout. Please try again.')
      setIsLoadingMembership(false)
    }
  }

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
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-elegant leading-tight"
          >
            Taqwa Center
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 font-light max-w-3xl mx-auto"
          >
            A place of worship, community, and growth.
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLearnMore}
              className="px-8 py-4 bg-islamic-gold-500 hover:bg-islamic-gold-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
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
              className={`px-8 py-4 bg-islamic-green-600 hover:bg-islamic-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg border-2 border-white/20 ${
                isLoadingMembership ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoadingMembership ? 'Redirecting to secure payment...' : 'Become a Member'}
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
  )
}

export default Hero

