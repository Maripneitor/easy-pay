import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '../../../infrastructure/api/http-client';

export const useRegisterExpense = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [integrantes, setIntegrantes] = useState<{ id: string, nombre: string }[]>([]);

    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        cantidad: 1,
        comprador_id: '',
        participantes_ids: [] as string[]
    });

    const fetchGroupDetails = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        const cleanGroupId = groupId?.replace(/[#?:]/g, '');

        if (!userId || !cleanGroupId) return;

        try {
            const res = await httpClient.get(`/groups/${cleanGroupId}`);

            if (res.status === 200) {
                const currentGroup = res.data;

                const listaFormateada = currentGroup.integrantes.map((m: any) => {
                    const isMe = m.id === userId;
                    return {
                        id: m.id,
                        nombre: isMe
                            ? `Yo (${m.nombre || 'Usuario'})`
                            : (m.nombre || `Usuario ${m.id.slice(-4).toUpperCase()}`)
                    };
                });

                setIntegrantes(listaFormateada);

                const allIds = listaFormateada.map((m: any) => m.id);

                setFormData(prev => ({
                    ...prev,
                    comprador_id: userId,
                    participantes_ids: allIds
                }));
            }
        } catch (error) {
            console.error("❌ Error en el fetch de integrantes:", error);
        }
    }, [groupId]);

    useEffect(() => {
        fetchGroupDetails();
    }, [fetchGroupDetails]);

    const toggleParticipante = (id: string) => {
        setFormData(prev => ({
            ...prev,
            participantes_ids: prev.participantes_ids.includes(id)
                ? prev.participantes_ids.filter(p => p !== id)
                : [...prev.participantes_ids, id]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.nombre || !formData.precio || formData.participantes_ids.length === 0) {
            alert("Por favor rellena todos los campos.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                group_id: groupId?.replace(/[#?:]/g, ''),
                nombre: formData.nombre.trim(),
                precio: parseFloat(formData.precio),
                cantidad: Number(formData.cantidad),
                comprador_id: formData.comprador_id,
                participantes_ids: formData.participantes_ids
            };

            const response = await httpClient.post('/groups/add-item', payload);

            if (response.status === 200 || response.status === 201) {
                navigate(-1);
            } else {
                alert(`Error: ${response.data?.detail || 'Fallo en el registro'}`);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.detail || "Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, integrantes, handleSubmit, loading, toggleParticipante };
};