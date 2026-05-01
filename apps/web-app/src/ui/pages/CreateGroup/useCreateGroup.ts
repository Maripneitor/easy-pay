import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../infrastructure/api/http-client';

export const useCreateGroup = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
    const [loading, setLoading] = useState(false);

    // Estados para CREAR
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');

    // Estados para UNIRSE
    const [joinCode, setJoinCode] = useState('');

    const handleCreateGroup = async () => {
        if (!groupName) return alert("El nombre es obligatorio");

        const userId = localStorage.getItem('userId');
        if (!userId) {
            localStorage.clear();
            navigate('/auth');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                nombre: groupName,
                descripcion: groupDesc || "",
                admin_id: userId,
                integrantes: [userId]
            };

            const response = await httpClient.post('/groups/create', payload);

            if (response.status === 200 || response.status === 201) {
                navigate('/dashboard');
            } else {
                console.error("Error al crear:", response.data);
                alert(`Error al crear el grupo.`);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.detail || "Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async () => {
        if (joinCode.trim().length < 4) return alert("Ingresa un código válido");

        const userId = localStorage.getItem('userId');
        if (!userId) {
            localStorage.clear();
            navigate('/auth');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                codigo: joinCode.trim().toUpperCase(),
                user_id: userId
            };

            const response = await httpClient.post('/groups/join', payload);

            if (response.status === 200 || response.status === 201) {
                navigate('/dashboard');
            } else {
                console.error("Error al unirse:", response.data);
                alert(response.data?.detail || "Código inválido o ya estás en el grupo");
            }
        } catch (error: any) {
            console.error("Error de red:", error);
            alert(error.response?.data?.detail || "Error al intentar unirse");
        } finally {
            setLoading(false);
        }
    };

    return {
        activeTab, setActiveTab,
        groupName, setGroupName,
        groupDesc, setGroupDesc,
        joinCode, setJoinCode,
        handleCreateGroup,
        handleJoinGroup,
        loading,
        goBack: () => navigate(-1)
    };
};