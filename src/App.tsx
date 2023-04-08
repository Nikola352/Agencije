import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './layouts/Navbar'

function App() {
  return (
    <Router>
        <div className="App">
            <Navbar />

            <div className='h-10 sm:h-12'></div>

            <div className="content p-4 -z-10">
                <Routes>
                    <Route path='/' element={Home()} />
                </Routes>
            </div>

        </div>
    </Router>
  )
}

export default App
