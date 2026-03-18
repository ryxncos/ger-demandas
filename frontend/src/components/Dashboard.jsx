// frontend/src/components/Dashboard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
                paddingBottom: '10px'
            }}>
                <h1>Dashboard</h1>
                <div>
                    {/* Mostra o nome do usuário logado */}
                    <span style={{ marginRight: '20px' }}>
                        Bem-vindo <strong>{user}</strong>
                    </span>
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    >
                        Sair
                    </button>
                </div>
            </div>
            
            <div style={{ marginTop: '30px' }}>
                <h2>Menu</h2>
                <button 
                    onClick={() => navigate('/create-record')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Criar Nova Demanda
                </button>
                
                <button 
                    onClick={() => navigate('/records')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    Ver Demandas
                </button>
            </div>

            {/* Informações do usuário (opcional) */}
            
        </div>
    );
}

export default Dashboard;