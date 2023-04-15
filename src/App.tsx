import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './layouts/Navbar'
import { UserProvider } from './data/UserContext'

function App() {
  return (
    <Router>
        <UserProvider>
            <div className="App">
                <Navbar />

                <div className='h-10 sm:h-12 mb-4'></div>

                <div className="content p-4 -z-10">
                    <Routes>
                        <Route path='/' element={Home()} />
                    </Routes>
                </div>

            </div>
        </UserProvider>
    </Router>
  )
}

export default App
