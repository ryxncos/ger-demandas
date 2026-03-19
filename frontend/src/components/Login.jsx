// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import logoJbs from '../img/jbs-logo.webp'

function Login() {
    const [user, setUsername] = useState('');  
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login(user, password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        
        <div style={{ 
            width: '600px', 
            margin: '50px auto', 
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'column',
            gap:'15px'
        }}>
            <img src={logoJbs} alt="" style={{
                width: '100px',
                height:'100px'
            }} />
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
            
            {error && (
                <div style={{ 
                    color: 'red', 
                    marginBottom: '15px', 
                    padding: '10px',
                    backgroundColor: '#ffeeee',
                    borderRadius: '3px'
                }}>
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Usuário:
                    </label>
                    <input
                        type="text"
                        value={user}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '3px'
                        }}
                        placeholder="Digite seu usuário"
                    />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Senha:
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '3px'
                        }}
                        placeholder="Digite sua senha"
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
                <div className="login-link">
                        Criar conta <Link to="/register">Cadastro</Link>
                </div>
                
            </form>
        </div>
    );
}

export default Login;