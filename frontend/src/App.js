import React, { useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './components/CRUD.css';
import './App.css';

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');

    const renderPage = () => {
        switch(currentPage) {
            case 'dashboard':
                return <Dashboard />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="app">
            <nav className="app-navbar">
                <div className="nav-brand">
                    <h2><i className="fas fa-globe"></i> GOW</h2>
                </div>
                <div className="nav-links">
                    <button 
                        className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('home')}
                    >
                        <i className="fas fa-map"></i> Map View
                    </button>
                    <button 
                        className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('dashboard')}
                    >
                        <i className="fas fa-database"></i> Dashboard
                    </button>
                </div>
            </nav>
            <main className="app-main">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;
