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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <Navbar />
          <main className="pb-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add-event" element={<AddEvent />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/verify" element={<VerifyEvent />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
