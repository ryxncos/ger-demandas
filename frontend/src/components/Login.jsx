import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logoJbs from '../img/jbs-logo.webp';
import './Login.css';

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
            const userRole = result.user?.role;

            if (userRole === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                
                <div className="login-header">
                    <img src={logoJbs} alt="Logo" />
                    <h2>Login</h2>
                </div>

                {error && (
                    <div className="alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    
                    <div className="form-group">
                        <label>Usuário</label>
                        <input
                            type="text"
                            value={user}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Digite seu usuário"
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-login"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="login-link">
                        Criar conta <Link to="/register">Cadastro</Link>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;