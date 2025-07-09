import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import PilgrimDashboard from './components/PilgrimDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : user.role === 'admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <PilgrimDashboard user={user} onLogout={handleLogout} />
            )
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;