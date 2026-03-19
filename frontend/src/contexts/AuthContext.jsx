// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Recupera usuário do localStorage ao iniciar
    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');
                
                if (storedUser && storedToken) {
                    // Configura o token no axios para próximas requisições
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Erro ao carregar usuário do storage:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        loadUserFromStorage();
    }, []);

    

    // FUNÇÃO DE LOGIN ADAPTADA PARA USUÁRIO (NÃO EMAIL)
    const login = async (user, password) => {
        try {
            // Envia usuário e senha para o backend
            const response = await api.post('/login', { 
                user: user,  // ou 'username' dependendo do que seu backend espera
                password 
            });
            
            // A estrutura abaixo DEPENDE de como seu backend retorna os dados
            // Geralmente o backend retorna algo como:
            // { user: { id, name, username }, token: "jwt_token" }
            const { user: userData, token } = response.data;
            
            // Se seu backend retornar com nomes diferentes, ajuste aqui
            // Por exemplo, se retornar { usuario, token }:
            // const { usuario: userData, token } = response.data;
            
            // Salva no localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            
            // Configura o token no axios para próximas requisições
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Atualiza o estado
            setUser(userData);
            
            return { success: true, user: userData };
            
        } catch (error) {
            console.error('Erro no login:', error);
            
            let errorMessage = 'Erro ao fazer login';
            
            if (error.response) {
                errorMessage = error.response.data?.error || 
                              error.response.data?.message || 
                              `Erro ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Servidor não respondeu. Verifique se o backend está rodando.';
            } else {
                errorMessage = error.message;
            }
            
            return { 
                success: false, 
                error: errorMessage 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user;
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading,
            isAuthenticated,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};