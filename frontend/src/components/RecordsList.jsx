// frontend/src/components/RecordsList.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './RecordsList.css';

function RecordsList() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUserRecords();
    }, []);

    const fetchUserRecords = async () => {
        try {
            setLoading(true);
            const response = await api.get('/records/user');
            console.log('Demandas do usuário:', response.data);
            setRecords(response.data);
            setError('');
        } catch (error) {
            console.error('Erro ao carregar demandas:', error);
            setError('Erro ao carregar demandas: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    // 🔥 ATUALIZADO: Mapeamento de cores para as novas categorias
    const getTypeColor = (type) => {
        const colors = {
            'camera-opt': '#17a2b8',      // Azul petróleo
            'radio-opt': '#fd7e14',       // Laranja
            'nobreak-opt': '#20c997',     // Verde água
            'gerador-opt': '#ffc107',     // Amarelo
            'wifi-auditoria-opt': '#6f42c1', // Roxo
            'wifi-mobile-opt': '#e83e8c',    // Rosa
            '5s-sala-opt': '#28a745',     // Verde
            '5s-deposito-opt': '#28a745', // Verde
            'faturamento-hp-opt': '#007bff', // Azul
            'pcs-imp-opt': '#dc3545',     // Vermelho
            'org-rack-opt': '#6c757d',    // Cinza
            'toners-hp-opt': '#17a2b8',   // Azul petróleo
            'pcs-ti-opt': '#dc3545',      // Vermelho
            'central-tele-opt': '#fd7e14',  // Laranja
            'sif-opt': '#20c997',         // Verde água
            'dmnd-corp-opt': '#6f42c1',   // Roxo
            'cut-sl-eti-opt': '#28a745',  // Verde
            'bckp-opt': '#007bff',        // Azul
            'pilar-adm-opt': '#6c757d',   // Cinza
            'mikrotik-opt': '#17a2b8',    // Azul petróleo
            'erp-1t-opt': '#fd7e14',      // Laranja
            'erp-2t-opt': '#fd7e14',      // Laranja
            'erp-area-apoio-opt': '#fd7e14', // Laranja
            default: '#6c757d'
        };
        return colors[type] || colors.default;
    };

    // 🔥 ATUALIZADO: Ícones para as novas categorias
    const getTypeIcon = (type) => {
        const icons = {
            'camera-opt': '📷',
            'radio-opt': '📻',
            'nobreak-opt': '⚡',
            'gerador-opt': '🔄',
            'wifi-auditoria-opt': '📶',
            'wifi-mobile-opt': '📱',
            '5s-sala-opt': '🧹',
            '5s-deposito-opt': '📦',
            'faturamento-hp-opt': '💰',
            'pcs-imp-opt': '🖨️',
            'org-rack-opt': '🗄️',
            'toners-hp-opt': '🖨️',
            'pcs-ti-opt': '💻',
            'central-tele-opt': '📞',
            'sif-opt': '🔒',
            'dmnd-corp-opt': '🏢',
            'cut-sl-eti-opt': '✂️',
            'bckp-opt': '💾',
            'pilar-adm-opt': '📊',
            'mikrotik-opt': '🌐',
            'erp-1t-opt': '📈',
            'erp-2t-opt': '📉',
            'erp-area-apoio-opt': '🆘',
            default: '📌'
        };
        return icons[type] || icons.default;
    };

    // 🔥 ATUALIZADO: Labels para as novas categorias
    const getTypeLabel = (type) => {
        const labels = {
            'camera-opt': 'Câmera',
            'radio-opt': 'Rádio',
            'nobreak-opt': 'Nobreak T.I',
            'gerador-opt': 'Gerador',
            'wifi-auditoria-opt': 'WiFi Auditoria',
            'wifi-mobile-opt': 'WiFi Mobile',
            '5s-sala-opt': '5S Sala',
            '5s-deposito-opt': '5S Depósito',
            'faturamento-hp-opt': 'Faturamento HP',
            'pcs-imp-opt': 'Peças Impressoras',
            'org-rack-opt': 'Organização de Racks',
            'toners-hp-opt': 'Toners HP',
            'pcs-ti-opt': 'Peças T.I',
            'central-tele-opt': 'Central Telefônica',
            'sif-opt': 'SIF',
            'dmnd-corp-opt': 'Demandas Corporativas',
            'cut-sl-eti-opt': 'Cortadores SL Etiquetas',
            'bckp-opt': 'Backup',
            'pilar-adm-opt': 'Pilar ADM',
            'mikrotik-opt': 'Mikrotik',
            'erp-1t-opt': 'Acesso ERP 1T',
            'erp-2t-opt': 'Acesso ERP 2T',
            'erp-area-apoio-opt': 'ERP Area Apoio',
            default: 'Outros'
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

    // 🔥 ATUALIZADO: Função para deletar (corrigida)
    const handleDelete = async (id) => {
        if (window.confirm('⚠️ Tem certeza que deseja deletar esta demanda?\n\nEsta ação não pode ser desfeita!')) {
            try {
                await api.delete(`/records/${id}`);
                alert('✅ Demanda deletada com sucesso!');
                fetchUserRecords();
            } catch (error) {
                console.error('Erro ao deletar:', error);
                alert('❌ Erro ao deletar demanda: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    // Filtra as demandas baseado no tipo e termo de busca
    const filteredRecords = records.filter(record => {
        const matchesType = filter === 'all' || record.type === filter;
        const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             record.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    // 🔥 ATUALIZADO: Lista de categorias para os botões de filtro
    const categories = [
        { value: 'all', label: 'Todos', icon: '📋' },
        { value: 'camera-opt', label: 'Câmera', icon: '📷' },
        { value: 'radio-opt', label: 'Rádio', icon: '📻' },
        { value: 'nobreak-opt', label: 'Nobreak', icon: '⚡' },
        { value: 'gerador-opt', label: 'Gerador', icon: '🔄' },
        { value: 'wifi-auditoria-opt', label: 'WiFi Aud.', icon: '📶' },
        { value: 'wifi-mobile-opt', label: 'WiFi Mob.', icon: '📱' },
        { value: '5s-sala-opt', label: '5S Sala', icon: '🧹' },
        { value: '5s-deposito-opt', label: '5S Depósito', icon: '📦' },
        { value: 'pcs-imp-opt', label: 'Peças Imp.', icon: '🖨️' },
        { value: 'toners-hp-opt', label: 'Toners HP', icon: '🖨️' },
        { value: 'pcs-ti-opt', label: 'Peças T.I', icon: '💻' },
        { value: 'central-tele-opt', label: 'Central Tel.', icon: '📞' },
        { value: 'bckp-opt', label: 'Backup', icon: '💾' },
        { value: 'mikrotik-opt', label: 'Mikrotik', icon: '🌐' },
        { value: 'erp-1t-opt', label: 'ERP 1T', icon: '📈' },
        { value: 'erp-2t-opt', label: 'ERP 2T', icon:'📈'},
        { value: 'erp-area-apoio-opt', label: 'ERP Área de Apoio', icon:'📈'}
    ];

    if (loading) {
        return (
            <div className="records-loading">
                <div className="spinner"></div>
                <p>Carregando suas demandas...</p>
            </div>
        );
    }

    return (
        <div className="records-container">
            <div className="records-header">
                <h1>Minhas Demandas</h1>
                <div className="user-info-header">
                    <p>Usuário: <strong>{user?.user || user?.name || 'Usuário'}</strong></p>
                    <p>Total: {filteredRecords.length} {filteredRecords.length === 1 ? 'demanda' : 'demandas'}</p>
                </div>
            </div>

            {error && (
                <div className="records-error">
                    <span>⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchUserRecords}>Tentar novamente</button>
                </div>
            )}

            <div className="records-filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Buscar em suas demandas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-buttons">
                    {categories.map(cat => (
                        <button 
                            key={cat.value}
                            className={filter === cat.value ? 'active' : ''} 
                            onClick={() => setFilter(cat.value)}
                            style={{ borderColor: cat.value !== 'all' ? getTypeColor(cat.value) : undefined }}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
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
                            : 'Você ainda não criou nenhuma demanda!'}
                    </p>
                    <button onClick={() => window.location.href = '/create-record'}>
                        Criar Primeira Demanda
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
                                    <span className="author-name">
                                        {record.user?.user || user?.user || 'Você'}
                                    </span>
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
                                        onClick={() => handleDelete(record.id)}
                                        title="Excluir"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="record-debug" style={{ fontSize: '10px', color: '#999', padding: '5px', borderTop: '1px dashed #ccc' }}>
                                <small>ID: {record.id} | Tipo: {record.type}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecordsList;