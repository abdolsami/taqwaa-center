import express from 'express'

const router = express.Router()

// Welcome route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Taqwa Center API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact',
      programs: '/api/programs',
      services: '/api/services'
    }
  })
})

// Contact route
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body
  
  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Missing required fields: name, email, message'
    })
  }

  // TODO: Implement email sending or database storage
  console.log('Contact form submission:', { name, email, message })
  
  res.json({
    success: true,
    message: 'Thank you for contacting us. We will get back to you soon.'
  })
})

// Programs route
router.get('/programs', (req, res) => {
  res.json({
    success: true,
    programs: [
      {
        id: 1,
        name: 'Quran Classes',
        description: 'Learn and memorize the Holy Quran',
        schedule: 'Monday - Friday, 5:00 PM - 7:00 PM'
      },
      {
        id: 2,
        name: 'Arabic Language',
        description: 'Learn Arabic language and grammar',
        schedule: 'Saturday - Sunday, 10:00 AM - 12:00 PM'
      },
      {
        id: 3,
        name: 'Islamic Studies',
        description: 'Comprehensive Islamic education',
        schedule: 'Wednesday, 6:00 PM - 8:00 PM'
      }
    ]
  })
})

// Services route
router.get('/services', (req, res) => {
  res.json({
    success: true,
    services: [
      {
        id: 1,
        name: 'Prayer Services',
        description: 'Daily prayers and Jummah services'
      },
      {
        id: 2,
        name: 'Community Events',
        description: 'Regular community gatherings and events'
      },
      {
        id: 3,
        name: 'Religious Counseling',
        description: 'Guidance and counseling services'
      }
    ]
  })
})

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Taqwa Center API',
    timestamp: new Date().toISOString()
  })
})

export default router

