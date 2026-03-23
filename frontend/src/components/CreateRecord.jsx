import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CreateRecord.css';

function CreateRecord() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'bug'
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

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
        setMessage('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('type', formData.type);

        if (image) {
            data.append('imageUrl', image);
        }

        try {
            await api.post('/records', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage('Demanda criada com sucesso!');
            setSuccess(true);

            // 🔥 RESET
            setFormData({ title: '', description: '', type: 'bug' });
            setImage(null);

            // 🔥 REDIRECT APÓS 1.5s (tempo pra mostrar feedback)
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            setSuccess(false);
            setMessage('Erro ao criar demanda: ' + error.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-container">
            <div className="create-box">

                <div className="create-header">
                    <h2>Nova Demanda</h2>
                </div>

                {message && (
                    <div className={success ? 'alert-success' : 'alert-error'}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="create-form">

                    <div className="form-group">
                        <label>Título</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Tipo</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="camera-opt">Câmera</option>
                            <option value="radio-opt">Rádio</option>
                            <option value="nobreak-opt">Nobreak T.I</option>
                            <option value="gerador-opt">Gerador</option>
                            <option value="wifi-auditoria-opt">Wifi Auditoria</option>
                            <option value="wifi-mobile-opt">Wifi Mobile</option>
                            <option value="5s-sala-opt">5s Sala</option>
                            <option value="5s-deposito-opt">5s Depósito</option>
                            <option value="faturamento-hp-opt">Faturamento HP</option>
                            <option value="pcs-imp-opt">Peças impressoras</option>
                            <option value="org-rack-opt">Organização de Racks</option>
                            <option value="toners-hp-opt">Toners HP</option>
                            <option value="pcs-ti-opt">Peças T.I</option>
                            <option value="central-tele-opt">Central Telefônica</option>
                            <option value="sif-opt">SIF</option>
                            <option value="dmnd-corp-opt">Demandas corporativas</option>
                            <option value="cut-sl-eti-opt">Cortadores SL. Etiquetas</option>
                            <option value="bckp-opt">Backup</option>
                            <option value="pilar-adm-opt">Pilar ADM</option>
                            <option value="mikrotik-opt">Mikrotik</option>
                            <option value="erp-1t-opt">Acesso ERP 1T</option>
                            <option value="erp-2t-opt">Acesso ERP 2T</option>
                            <option value="erp-area-apoio-opt">ERP Area Apoio</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Imagem</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-create"
                    >
                        {loading ? 'Criando...' : 'Criar Demanda'}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CreateRecord;