import { useState, useEffect } from 'react';

export const useDashboard = () => {
    // 1. Inicializamos con arreglos vacíos para evitar errores de .length
    const [allActiveGroups, setAllActiveGroups] = useState([]);
    const [settledGroups, setSettledGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    const fetchGroups = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`http://localhost:8002/api/groups/user/${userId}`);
            const data = await response.json();

            // 2. Validamos que la data sea un arreglo antes de guardar
            if (Array.isArray(data)) {
                // Filtramos por ejemplo si están liquidados o no
                setAllActiveGroups(data.filter((g: any) => !g.is_settled));
                setSettledGroups(data.filter((g: any) => g.is_settled));
            } else {
                setAllActiveGroups([]);
                setSettledGroups([]);
            }
        } catch (error) {
            console.error("Error al obtener grupos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    // Funciones de utilidad que pide el Dashboard
    const toggleSidebar = () => console.log("Sidebar toggled");
    const navigate = (path: string) => window.location.href = path; // O tu hook de navigate
    const getGroupIcon = (name: string) => ({ icon: 'Users' });

    return {
        allActiveGroups: allActiveGroups || [],
        settledGroups: settledGroups || [],
        isLoading,
        toggleSidebar,
        navigate,
        getGroupIcon
    };
};