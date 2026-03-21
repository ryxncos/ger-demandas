// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [allRecords, setAllRecords] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filtros
    const [selectedUser, setSelectedUser] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Estatísticas
    const [stats, setStats] = useState({
        total: 0,
        byType: {},
        byUser: {}
    });

    useEffect(() => {
        // Verificar se é admin
        if (user && user.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        fetchAllData();
    }, [user]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            // Buscar todos os registros
            const recordsResponse = await api.get('/records/records/all');
            setAllRecords(recordsResponse.data);
            
            // Buscar todos os usuários
            const usersResponse = await api.get('/users');
            setUsers(usersResponse.data);
            
            // Calcular estatísticas
            calculateStats(recordsResponse.data);
            
            setError('');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError('Erro ao carregar dados: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (records) => {
        // Total de demandas
        const total = records.length;
        
        // Estatísticas por tipo
        const byType = {};
        records.forEach(record => {
            byType[record.type] = (byType[record.type] || 0) + 1;
        });
        
        // Estatísticas por usuário
        const byUser = {};
        records.forEach(record => {
            const userName = record.user?.user || 'Usuário desconhecido';
            byUser[userName] = (byUser[userName] || 0) + 1;
        });
        
        setStats({ total, byType, byUser });
    };

    const getTypeColor = (type) => {
        const colors = {
            'camera-opt': '#17a2b8',
            'radio-opt': '#fd7e14',
            'nobreak-opt': '#20c997',
            'gerador-opt': '#ffc107',
            'wifi-auditoria-opt': '#6f42c1',
            'wifi-mobile-opt': '#e83e8c',
            '5s-sala-opt': '#28a745',
            '5s-deposito-opt': '#28a745',
            'faturamento-hp-opt': '#007bff',
            'pcs-imp-opt': '#dc3545',
            'org-rack-opt': '#6c757d',
            'toners-hp-opt': '#17a2b8',
            'pcs-ti-opt': '#dc3545',
            'central-tele-opt': '#fd7e14',
            'sif-opt': '#20c997',
            'dmnd-corp-opt': '#6f42c1',
            'cut-sl-eti-opt': '#28a745',
            'bckp-opt': '#007bff',
            'pilar-adm-opt': '#6c757d',
            'mikrotik-opt': '#17a2b8',
            'erp-1t-opt': '#fd7e14',
            'erp-2t-opt': '#fd7e14',
            'erp-area-apoio-opt': '#fd7e14',
            default: '#6c757d'
        };
        return colors[type] || colors.default;
    };

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

    // Filtrar demandas
    const filteredRecords = allRecords.filter(record => {
        const matchesUser = selectedUser === 'all' || record.userId === parseInt(selectedUser);
        const matchesType = selectedType === 'all' || record.type === selectedType;
        const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (record.user?.user || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesDate = true;
        if (dateRange.start) {
            matchesDate = new Date(record.createdAt) >= new Date(dateRange.start);
        }
        if (dateRange.end && matchesDate) {
            matchesDate = new Date(record.createdAt) <= new Date(dateRange.end);
        }
        
        return matchesUser && matchesType && matchesSearch && matchesDate;
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (window.confirm('⚠️ Tem certeza que deseja deletar esta demanda?\n\nEsta ação não pode ser desfeita!')) {
            try {
                await api.delete(`/records/${id}`);
                alert('✅ Demanda deletada com sucesso!');
                fetchAllData();
            } catch (error) {
                console.error('Erro ao deletar:', error);
                alert('❌ Erro ao deletar demanda: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    // Lista de tipos para o filtro
    const typeOptions = [
        { value: 'all', label: 'Todos os tipos', icon: '📋' },
        { value: 'camera-opt', label: 'Câmera', icon: '📷' },
        { value: 'radio-opt', label: 'Rádio', icon: '📻' },
        { value: 'nobreak-opt', label: 'Nobreak T.I', icon: '⚡' },
        { value: 'gerador-opt', label: 'Gerador', icon: '🔄' },
        { value: 'wifi-auditoria-opt', label: 'WiFi Auditoria', icon: '📶' },
        { value: 'wifi-mobile-opt', label: 'WiFi Mobile', icon: '📱' },
        { value: '5s-sala-opt', label: '5S Sala', icon: '🧹' },
        { value: '5s-deposito-opt', label: '5S Depósito', icon: '📦' },
        { value: 'faturamento-hp-opt', label: 'Faturamento HP', icon: '💰' },
        { value: 'pcs-imp-opt', label: 'Peças Impressoras', icon: '🖨️' },
        { value: 'org-rack-opt', label: 'Organização de Racks', icon: '🗄️' },
        { value: 'toners-hp-opt', label: 'Toners HP', icon: '🖨️' },
        { value: 'pcs-ti-opt', label: 'Peças T.I', icon: '💻' },
        { value: 'central-tele-opt', label: 'Central Telefônica', icon: '📞' },
        { value: 'sif-opt', label: 'SIF', icon: '🔒' },
        { value: 'dmnd-corp-opt', label: 'Demandas Corporativas', icon: '🏢' },
        { value: 'bckp-opt', label: 'Backup', icon: '💾' },
        { value: 'mikrotik-opt', label: 'Mikrotik', icon: '🌐' },
        { value: 'erp-1t-opt', label: 'Acesso ERP 1T', icon: '📈' }
    ];

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Carregando dados do sistema...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <nav className="admin-nav">
                <div className="nav-brand">
                    <h2> Gerenciamento de demandas</h2>
                </div>
                <div className="nav-user">
                    <span className="user-greeting">
                        Olá, <strong>{user?.user || user?.name}</strong>
                    </span>
                    <button className="btn-logout" onClick={handleLogout}>
                         Sair
                    </button>
                </div>
            </nav>
            <br />
            <br />
            {/* Stats Cards
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <h3>Total de Demandas</h3>
                        <p>{stats.total}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Usuários Ativos</h3>
                        <p>{users.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-info">
                        <h3>Tipos de Demanda</h3>
                        <p>{Object.keys(stats.byType).length}</p>
                    </div>
                </div>
            </div> */}

            {/* Filters Section */}
            <div className="filters-section">
                <h3>🔍 Filtros de Pesquisa</h3>
                <div className="filters-grid">
                    <div className="filter-group">
                        <label> Usuário:</label>
                        <select 
                            value={selectedUser} 
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Todos os usuários</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.user} 
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label> Tipo de Demanda:</label>
                        <select 
                            value={selectedType} 
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="filter-select"
                        >
                            {typeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.icon} {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label> Busca:</label>
                        <input
                            type="text"
                            placeholder="Buscar por título, descrição ou usuário..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="filter-input"
                        />
                    </div>

                    {/* <div className="filter-group">
                        <label>📅 Data Início:</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="filter-input"
                        />
                    </div>

                    <div className="filter-group">
                        <label>📅 Data Fim:</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="filter-input"
                        />
                    </div> */}

                    <div className="filter-group">
                        <label>&nbsp;</label>
                        <button 
                            className="btn-clear-filters"
                            onClick={() => {
                                setSelectedUser('all');
                                setSelectedType('all');
                                setSearchTerm('');
                                setDateRange({ start: '', end: '' });
                            }}
                        >
                             Limpar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="results-info">
                <p>
                    📌 Mostrando <strong>{filteredRecords.length}</strong> de <strong>{allRecords.length}</strong> demandas
                    {selectedUser !== 'all' && ` | Usuário filtrado`}
                    {selectedType !== 'all' && ` | Tipo: ${getTypeLabel(selectedType)}`}
                </p>
                <button className="btn-refresh" onClick={fetchAllData}>
                     Atualizar
                </button>
            </div>

            {/* Records Grid */}
            {error && (
                <div className="admin-error">
                    <span>⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchAllData}>Tentar novamente</button>
                </div>
            )}

            {filteredRecords.length === 0 ? (
                <div className="no-records">
                    <div className="no-records-icon">📭</div>
                    <h3>Nenhuma demanda encontrada</h3>
                    <p>Tente ajustar os filtros de busca</p>
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
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => window.open(`http://localhost:3000/uploads/${record.imageUrl}`, '_blank')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="record-card-footer">
                                <div className="record-author">
                                    <span className="author-avatar">👤</span>
                                    <div className="author-info">
                                        <span className="author-name">{record.user?.user || 'Usuário desconhecido'}</span>
                                        {/* <span className="author-role">{record.user?.role || 'USER'}</span> */}
                                    </div>
                                </div>
                                
                                {/* <div className="record-actions">
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(record.id)}
                                        title="Excluir demanda"
                                    >
                                        🗑️
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;