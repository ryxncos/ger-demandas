// frontend/src/components/RecordsList.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './RecordsList.css'; // Vamos criar o CSS depois

function RecordsList() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'bug', 'feature', 'task'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const response = await api.get('/records'); // Ajuste a rota conforme seu backend
            setRecords(response.data);
            setError('');
        } catch (error) {
            setError('Erro ao carregar demandas: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            bug: '#dc3545',
            feature: '#28a745',
            task: '#ffc107',
            default: '#6c757d'
        };
        return colors[type] || colors.default;
    };

    const getTypeIcon = (type) => {
        const icons = {
            bug: '🐛',
            feature: '✨',
            task: '📋',
            default: '📌'
        };
        return icons[type] || icons.default;
    };

    const getTypeLabel = (type) => {
        const labels = {
            bug: 'Bug',
            feature: 'Feature',
            task: 'Task'
        };
        return labels[type] || type;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filtra as demandas baseado no tipo e termo de busca
    const filteredRecords = records.filter(record => {
        const matchesType = filter === 'all' || record.type === filter;
        const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             record.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    if (loading) {
        return (
            <div className="records-loading">
                <div className="spinner"></div>
                <p>Carregando demandas...</p>
            </div>
        );
    }

    return (
        <div className="records-container">
            <div className="records-header">
                <h1>Minhas Demandas</h1>
                <p>Total: {filteredRecords.length} {filteredRecords.length === 1 ? 'demanda' : 'demandas'}</p>
            </div>

            {error && (
                <div className="records-error">
                    <span>⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchRecords}>Tentar novamente</button>
                </div>
            )}

            <div className="records-filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Buscar demandas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-buttons">
                    <button 
                        className={filter === 'all' ? 'active' : ''} 
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </button>
                    <button 
                        className={filter === 'bug' ? 'active' : ''} 
                        onClick={() => setFilter('bug')}
                        style={{ borderColor: getTypeColor('bug') }}
                    >
                        🐛 Bugs
                    </button>
                    <button 
                        className={filter === 'feature' ? 'active' : ''} 
                        onClick={() => setFilter('feature')}
                        style={{ borderColor: getTypeColor('feature') }}
                    >
                        ✨ Features
                    </button>
                    <button 
                        className={filter === 'task' ? 'active' : ''} 
                        onClick={() => setFilter('task')}
                        style={{ borderColor: getTypeColor('task') }}
                    >
                        📋 Tasks
                    </button>
                </div>
            </div>

            {filteredRecords.length === 0 ? (
                <div className="no-records">
                    <div className="no-records-icon">📭</div>
                    <h3>Nenhuma demanda encontrada</h3>
                    <p>
                        {searchTerm 
                            ? 'Tente buscar com outros termos' 
                            : filter !== 'all' 
                            ? `Você não tem demandas do tipo ${getTypeLabel(filter)}` 
                            : 'Comece criando sua primeira demanda!'}
                    </p>
                    <button onClick={() => window.location.href = '/create-record'}>
                        Criar Nova Demanda
                    </button>
                </div>
            ) : (
                <div className="records-grid">
                    {filteredRecords.map((record) => (
                        <div key={record.id} className="record-card">
                            <div className="record-card-header">
                                <span 
                                    className="record-type"
                                    style={{ backgroundColor: getTypeColor(record.type) }}
                                >
                                    {getTypeIcon(record.type)} {getTypeLabel(record.type)}
                                </span>
                                <span className="record-date">{formatDate(record.createdAt)}</span>
                                
                                
                            </div>

                            <div className="record-card-body">
                                <h3>{record.title}</h3>
                                <p>{record.description}</p>
                                
                                {record.imageUrl && (
                                    <div className="record-image">
                                        <img 
                                            src={`http://localhost:3000/uploads/${record.imageUrl}`} 
                                            alt={record.title}
                                            onClick={() => window.open(`http://localhost:3000/uploads/${record.imageUrl}`, '_blank')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="record-card-footer">
                                <div className="record-author">
                                    <span className="author-avatar">👤</span>
                                    <span className="author-name">{user.toUpperCase()}</span>
                                </div>
                                
                                <div className="record-actions">
                                    <button 
                                        className="btn-view"
                                        onClick={() => {/* Implementar visualização detalhada */}}
                                        title="Ver detalhes"
                                    >
                                        👁️
                                    </button>
                                    <button 
                                        className="btn-edit"
                                        onClick={() => {/* Implementar edição */}}
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => {/* Implementar exclusão com confirmação */}}
                                        title="Excluir"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecordsList;