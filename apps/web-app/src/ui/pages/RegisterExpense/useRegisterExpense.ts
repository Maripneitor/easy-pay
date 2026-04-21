import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useRegisterExpense = () => {
    // 🚩 Capturamos groupId e itemId para saber si estamos editando
    const { groupId, itemId } = useParams<{ groupId: string; itemId: string }>();
    const isEditing = Boolean(itemId);

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

    const fetchGroupAndExpenseData = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        const cleanGroupId = groupId?.replace(/[#?:]/g, '');

        if (!userId || !cleanGroupId) return;

        try {
            // 1. Obtener integrantes del grupo
            const resGroup = await fetch(`http://localhost:8002/api/groups/${cleanGroupId}`);
            let allMembersIds: string[] = [];

            if (resGroup.ok) {
                const currentGroup = await resGroup.json();
                const listaFormateada = currentGroup.integrantes.map((m: any) => ({
                    id: m.id,
                    nombre: m.id === userId ? `Yo (${m.nombre})` : m.nombre
                }));
                setIntegrantes(listaFormateada);
                allMembersIds = listaFormateada.map((m: any) => m.id);
            }

            // 2. Si estamos EDITANDO, cargar los datos del gasto específico
            if (isEditing && itemId) {
                const resItems = await fetch(`http://localhost:8002/api/groups/${cleanGroupId}/items`);
                if (resItems.ok) {
                    const items = await resItems.json();
                    // Buscamos el item en la lista (o puedes crear un endpoint GET /items/{id} en el backend)
                    const itemToEdit = items.find((i: any) => (i.id || i._id) === itemId);

                    if (itemToEdit) {
                        setFormData({
                            nombre: itemToEdit.nombre || itemToEdit.concepto || '',
                            precio: String(itemToEdit.precio || itemToEdit.monto || ''),
                            cantidad: itemToEdit.cantidad || 1,
                            comprador_id: itemToEdit.comprador_id || userId,
                            participantes_ids: itemToEdit.participantes_ids || []
                        });
                    }
                }
            } else {
                // Si es NUEVO, valores por defecto
                setFormData(prev => ({
                    ...prev,
                    comprador_id: userId,
                    participantes_ids: allMembersIds
                }));
            }
        } catch (error) {
            console.error("❌ Error cargando datos:", error);
        }
    }, [groupId, itemId, isEditing]);

    useEffect(() => {
        fetchGroupAndExpenseData();
    }, [fetchGroupAndExpenseData]);

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
            toast.error("Por favor rellena todos los campos.");
            return;
        }

        setLoading(true);
        const cleanGroupId = groupId?.replace(/[#?:]/g, '');

        try {
            const payload = {
                group_id: cleanGroupId,
                nombre: formData.nombre.trim(),
                precio: parseFloat(formData.precio),
                cantidad: Number(formData.cantidad),
                comprador_id: formData.comprador_id,
                participantes_ids: formData.participantes_ids
            };

            // 🚩 LÓGICA DINÁMICA: PUT para editar, POST para crear
            const url = isEditing
                ? `http://localhost:8002/api/groups/${cleanGroupId}/items/${itemId}`
                : `http://localhost:8002/api/groups/add-item`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success(isEditing ? "Gasto actualizado" : "Gasto registrado");
                navigate(`/group/${cleanGroupId}`);
            } else {
                const err = await response.json();
                toast.error(`Error: ${err.detail || 'Error en la operación'}`);
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, integrantes, handleSubmit, loading, toggleParticipante };
};