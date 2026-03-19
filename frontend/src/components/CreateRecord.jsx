// frontend/src/components/CreateRecord.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function CreateRecord() {
    const { user } = useAuth(); // Pega o usuário logado
    console.log(user)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'bug'
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('type', formData.type);
        if (image) {
            data.append('imageUrl', image);
        }

        try {
            const response = await api.post('/records', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Demanda criada com sucesso!');
            console.log('Demanda criada por:', user); // Debug
            setFormData({ title: '', description: '', type: 'bug' });
            setImage(null);
        } catch (error) {
            setMessage('Erro ao criar demanda: ' + error.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
            <h2>Nova Demanda</h2>
            {message && (
                <p style={{ 
                    color: message.includes('sucesso') ? 'green' : 'red',
                    marginBottom: '15px' 
                }}>
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Título:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', minHeight: '100px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Tipo:</label>
                    <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="bug">Bug</option>
                        <option value="feature">Feature</option>
                        <option value="task">Task</option>
                    </select>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Imagem</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none',
                        borderRadius: '3px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Criando...' : 'Criar Demanda'}
                </button>
            </form>
        </div>
    );
}

export default CreateRecord;