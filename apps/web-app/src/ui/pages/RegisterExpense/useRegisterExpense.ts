import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
            const res = await fetch(`http://localhost:8000/api/groups/${cleanGroupId}`);

            if (res.ok) {
                const currentGroup = await res.json();

                // 🚩 MEJORA 1: Formato "Yo (Nombre Real)"
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

                // 🚩 MEJORA 2: El comprador es FIJO (El usuario actual/admin)
                // Inicializamos participantes_ids con todos los miembros por defecto
                const allIds = listaFormateada.map((m: any) => m.id);

                setFormData(prev => ({
                    ...prev,
                    comprador_id: userId, // Ya no cambiará
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

        // 🚩 VALIDACIÓN: Ahora permite que haya solo 1 participante (tú mismo)
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

            const response = await fetch(`http://localhost:8000/api/groups/add-item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate(-1);
            } else {
                const err = await response.json();
                alert(`Error: ${err.detail || 'Fallo en el registro'}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, integrantes, handleSubmit, loading, toggleParticipante };
};