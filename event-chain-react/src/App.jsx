import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddEvent from './pages/AddEvent';
import Timeline from './pages/Timeline';
import VerifyEvent from './pages/VerifyEvent';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/verify" element={<VerifyEvent />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;

