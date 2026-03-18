// frontend/src/components/Dashboard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecordsList from './RecordsList.jsx';
import './Dashboard.css';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h2>Gerenciamento de Demandas</h2>
                </div>
                
                <div className="nav-user">
                    <span className="user-greeting">
                        Olá, <strong >{user.toUpperCase()}</strong>
                    </span>
                    <button 
                        className="btn-create"
                        onClick={() => navigate('/create-record')}
                        title="Criar nova demanda"
                    >
                        ➕ Nova Demanda
                    </button>
                    <button 
                        className="btn-logout"
                        onClick={handleLogout}
                        title="Sair"
                    >
                        🚪 Sair
                    </button>
                </div>
            </nav>

            <main className="dashboard-main">
                <RecordsList />
            </main>
        </div>
    );
}

export default Dashboard;