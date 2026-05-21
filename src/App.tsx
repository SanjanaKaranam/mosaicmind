import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Unscramble from './games/unscramble'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/unscramble" element={<Unscramble />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
