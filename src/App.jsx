import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import AuthContext from './AuthContext'
import Home from './Home'
import Profile from './Profile'
import Items from './Items'
import Buy from './Buy'
import Purchases from './Purchases'


function App() {
  const [jwt, setJwt] = useState('');


  const handleSetJwt = (token) => {
    setJwt(token);
  };

  return (
    <>
      <AuthContext.Provider value={jwt}>
        <BrowserRouter>
          <nav>
            <Link className='navBarLink' to="/">Home</Link>{' '}
            <Link className='navBarLink' to="/profile">Profile</Link>{' '}
            <Link className='navBarLink' to="/items">Your Items</Link>{' '}
            <Link className='navBarLink' to="/purchases">Purchase Requests</Link>{' '}
            <Link className='navBarLink' to="/buy">Buy Items</Link>{' '}

          </nav>
          <Routes>
            <Route path="/" element={<Home setJwt={handleSetJwt} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/items" element={<Items />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/buy" element={<Buy />} />

          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  )
}

export default App
