import { useQuery } from '@tanstack/react-query';
import { statsRepository } from '../../../infrastructure/api/repositories';
import { useAuthContext } from '../../context/AuthContext';

export const useProfileStats = () => {
    const { user } = useAuthContext();
    const userId = user?.id || null;

    // Fetch basic stats (Total spent, owed, etc.)
    const statsQuery = useQuery({
        queryKey: ['user-stats', userId],
        queryFn: async () => {
            if (!userId) throw new Error("User ID not found");
            return await statsRepository.getUserStats(userId);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    });

    // Fetch chart data (Monthly trend, detailed categories)
    const chartsQuery = useQuery({
        queryKey: ['user-charts', userId],
        queryFn: async () => {
            if (!userId) throw new Error("User ID not found");
            return await statsRepository.getUserCharts(userId);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    });

    const refresh = () => {
        statsQuery.refetch();
        chartsQuery.refetch();
    };

    // Combine data for the UI
    const combinedData = {
        ...(statsQuery.data || {}),
        ...(chartsQuery.data || {}),
        // Ensure consistent field names
        categories: chartsQuery.data?.by_category || statsQuery.data?.expenses_by_category || [],
        monthly_trend: chartsQuery.data?.monthly_trend || []
    };

    return { 
        stats: combinedData, 
        loading: statsQuery.isLoading || chartsQuery.isLoading,
        error: statsQuery.isError || chartsQuery.isError,
        refresh 
    };
};
