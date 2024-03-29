import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './layouts/Navbar'
import { UserProvider } from './data/UserContext'
import NotFound from './pages/NotFound'
import AgencijaPage from './pages/AgencijaPage'
import Footer from './layouts/Footer'
import Admin from './pages/Admin'
import AgencijaEdit from './pages/AgencijaEdit'
import DestinacijaPage from './pages/DestinacijaPage'
import DestinacijaEdit from './pages/DestinacijaEdit'
import DestinacijaNew from './pages/DestinacijaNew'

function App() {
  return (
    <Router>
        <UserProvider>
            <div id="App" className='relative min-h-[100vh]'>
                <Navbar />

                <div className='h-10 sm:h-12 mb-4'></div>

                <main className="content p-4 pb-16 sm:pb-20 -z-10 text-secondary-800">
                    <Routes>
                        <Route path='/' element={<Home/>} />
                        <Route path='/admin' element={<Admin/>} />
                        <Route path='/agencija/:id' element={<AgencijaPage/>} />
                        <Route path='/agencija/:id/edit' element={<AgencijaEdit/>} />
                        <Route path='/destinacija/:id1/:id2' element={<DestinacijaPage />} />
                        <Route path='/destinacija/:id1/:id2/edit' element={<DestinacijaEdit />} />
                        <Route path='/destinacija/:id/new' element={<DestinacijaNew />} />
                        <Route path='*' element={<NotFound/>} />
                    </Routes>
                </main>
                
                <Footer />
            </div>
        </UserProvider>
    </Router>
  )
}

export default App
