import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MembershipSuccess from './pages/MembershipSuccess'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/membership-success" element={<MembershipSuccess />} />
      </Routes>
    </Router>
  )
}

export default App
