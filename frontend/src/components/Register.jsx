// frontend/src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import logoJbs from '../img/jbs-logo.webp'
import './Register.css';

function Register() {
    const navigate = useNavigate();
    
    // Estados para os campos do formulário
    const [formData, setFormData] = useState({
        user: '',
        password: '',
        confirmPassword: ''
    });
    
    // Estados para controle da interface
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Função para lidar com mudanças nos inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Função para validar os dados (apenas o básico)
    const validateForm = () => {
        // Verifica se os campos estão preenchidos
        if (!formData.user || !formData.password || !formData.confirmPassword) {
            setError('Todos os campos são obrigatórios');
            return false;
        }

        // Verifica tamanho mínimo do usuário (3 caracteres)
        if (formData.user.length < 3) {
            setError('O nome de usuário deve ter pelo menos 3 caracteres');
            return false;
        }

        // Verifica se as senhas coincidem
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return false;
        }

        // Validação básica de senha (mínimo 6 caracteres)
        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return false;
        }

        return true;
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Limpa mensagens anteriores
        setError('');
        setSuccess('');

        // Valida o formulário
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Envia os dados para o backend com role fixo como "USER"
            const response = await api.post('/users', {
                user: formData.user,
                password: formData.password,
                role: 'USER'  // SEMPRE "USER", ignorando qualquer outro valor
            });

            console.log('Usuário criado:', response.data); // Debug

            setSuccess('Usuário cadastrado com sucesso!');
            
            // Limpa o formulário
            setFormData({
                user: '',
                password: '',
                confirmPassword: ''
            });

            // Redireciona para o login após 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Erro no registro:', error);
            
            // Tratamento de erros
            if (error.response?.status === 500) {
                // Provavelmente usuário duplicado (erro do banco)
                setError('Este nome de usuário já está em uso');
            } else if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Erro ao cadastrar usuário. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="register-header">
                    <img src={logoJbs} alt="" style={{
                                    width: '100px',
                                    height:'100px'
                                }} />
                    {/* <h1>GERDEMANDAS</h1> */}
                    <h2>Criar Conta</h2>
                    {/* <p>Preencha os dados para se registrar</p> */}
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span>⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <span>✅</span>
                        <p>{success}</p>
                        <small>Redirecionando para login...</small>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    {/* Campo de usuário */}
                    <div className="form-group">
                        <label htmlFor="user">
                            Usuário
                        </label>
                        <input
                            type="text"
                            id="user"
                            name="user"
                            value={formData.user}
                            onChange={handleChange}
                            placeholder="Digite seu nome de usuário"
                            disabled={loading || success}
                            autoComplete="username"
                            required
                        />
                        <small>Mínimo de 3 caracteres</small>
                    </div>

                    {/* Campo de senha */}
                    <div className="form-group">
                        <label htmlFor="password">
                            Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                            disabled={loading || success}
                            autoComplete="new-password"
                            required
                        />
                        <small>Mínimo de 6 caracteres</small>
                    </div>

                    {/* Campo de confirmação de senha */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirmar Senha
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Digite a senha novamente"
                            disabled={loading || success}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {/* */}
                    {/* <div className="role-info">
                        <small>📌 Todos os usuários são cadastrados como "USER"</small>
                    </div> */}

                    {/* Botão de submit */}
                    <button 
                        type="submit" 
                        className="btn-register"
                        disabled={loading || success}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>

                    {/* Link para login */}
                    <div className="login-link">
                        Já tem uma conta? <Link to="/login">Faça login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;