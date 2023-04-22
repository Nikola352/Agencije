import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './layouts/Navbar'
import { UserProvider } from './data/UserContext'
import NotFound from './pages/NotFound'
import AgencijaPage from './pages/AgencijaPage'

function App() {
  return (
    <Router>
        <UserProvider>
            <div className="App">
                <Navbar />

                <div className='h-10 sm:h-12 mb-4'></div>

                <main className="content p-4 -z-10 text-secondary-800">
                    <Routes>
                        <Route path='/' element={<Home/>} />
                        <Route path='/agencija/:id' element={<AgencijaPage/>} />
                        <Route path='*' element={<NotFound/>} />
                    </Routes>
                </main>

            </div>
        </UserProvider>
    </Router>
  )
}

export default App
