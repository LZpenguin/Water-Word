import React, { useState } from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Index from './pages/index'
import Terminal from './pages/terminal'
import Login from './pages/login'

const App = () => {
    const [login, setLogin] = useState(false)
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index login={login} setLogin={value => setLogin(value)} />} />
                <Route path="/terminal" element={<Terminal login={login} setLogin={value => setLogin(value)} />} />
                <Route path="/login" element={<Login login={login} setLogin={value => setLogin(value)} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
