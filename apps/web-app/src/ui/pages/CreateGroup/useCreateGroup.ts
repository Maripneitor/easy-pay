import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        if (!userId) return alert("Sesión expirada. Reingresa.");

        setLoading(true);
        try {
            const payload = {
                nombre: groupName,
                descripcion: groupDesc || "",
                admin_id: userId,
                integrantes: [userId]
            };

            const response = await fetch('http://localhost:8002/api/groups/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                const err = await response.json();
                console.error("Error 422/400:", err.detail);
                alert(`Error al crear el grupo.`);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el microservicio");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async () => {
        if (joinCode.trim().length < 4) return alert("Ingresa un código válido");

        const userId = localStorage.getItem('userId');
        if (!userId) return alert("Usuario no identificado. Inicia sesión de nuevo.");

        setLoading(true);
        try {
            const payload = {
                codigo: joinCode.trim().toUpperCase(),
                user_id: userId
            };

            const response = await fetch(`http://localhost:8002/api/groups/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                const err = await response.json();
                console.error("Error al unirse:", err);
                alert(err.detail || "Código inválido o ya estás en el grupo");
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error al intentar unirse");
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