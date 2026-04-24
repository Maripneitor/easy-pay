import { useState, useEffect } from 'react';

export const useProfileStats = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;
                
                const API_URL = 'http://localhost:8003/api';
                const response = await fetch(`${API_URL}/stats/user/${userId}/charts`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading };
};
