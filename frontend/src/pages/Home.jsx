import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      
      {/* Placeholder sections for smooth scrolling */}
      <section id="programs" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-islamic-green-800 mb-4">Programs</h2>
          <p className="text-gray-600">Programs section coming soon...</p>
        </div>
      </section>
      
      <section id="services" className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-islamic-green-800 mb-4">Services</h2>
          <p className="text-gray-600">Services section coming soon...</p>
        </div>
      </section>
      
      <section id="contact" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-islamic-green-800 mb-4">Contact Us</h2>
          <p className="text-gray-600">Contact section coming soon...</p>
        </div>
      </section>
      
      <section id="find-us" className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-islamic-green-800 mb-4">Find Us</h2>
          <p className="text-gray-600">Location section coming soon...</p>
        </div>
      </section>
      
      <section id="contribute" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-islamic-green-800 mb-4">Contribute</h2>
          <p className="text-gray-600">Contribute section coming soon...</p>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

export default Home

