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
        // Eliminamos cualquier caracter raro del ID de la URL
        const cleanGroupId = groupId?.replace(/[#?:]/g, '');

        if (!userId || !cleanGroupId) return;

        try {
            console.log("🔍 Buscando datos para el grupo:", cleanGroupId);
            const res = await fetch(`http://localhost:8002/api/groups/user/${userId}`);

            if (res.ok) {
                const groups = await res.json();
                console.log("📦 Grupos recibidos del servidor:", groups);

                // Buscamos coincidencia exacta o por ID
                const currentGroup = groups.find((g: any) => g.id === cleanGroupId || g._id === cleanGroupId);

                if (currentGroup) {
                    console.log("✅ Grupo encontrado:", currentGroup);

                    // Combinamos creador e integrantes
                    const allIds: string[] = [...new Set([
                        currentGroup.creador_id,
                        ...(currentGroup.integrantes || [])
                    ])].filter(id => id); // Eliminamos nulos

                    const listaFormateada = allIds.map(id => ({
                        id,
                        nombre: id === userId ? "Yo (Tú)" : `Usuario ${id.slice(-4).toUpperCase()}`
                    }));

                    setIntegrantes(listaFormateada);

                    // Seteamos valores iniciales
                    setFormData(prev => ({
                        ...prev,
                        comprador_id: userId,
                        participantes_ids: allIds
                    }));
                } else {
                    console.warn("⚠️ No se encontró el grupo con ID:", cleanGroupId, "en la lista del usuario.");
                }
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

            const response = await fetch(`http://localhost:8002/api/groups/add-item`, {
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
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, integrantes, handleSubmit, loading, toggleParticipante };
};