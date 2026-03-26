import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { useAuth } from '../pages/Auth/useAuth'; // Importamos tu nuevo hook

export const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout } = useAuth(); // Extraemos la función de cerrar sesión

    // Recuperamos el nombre del usuario para pasarlo a la Sidebar si es necesario
    const userName = localStorage.getItem('userName') || 'Usuario';

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-[var(--bg-body)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300 font-display">
            {/* Sidebar Navigation - Le pasamos el logout y el nombre */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={logout}
                userName={userName}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
                    <div className="max-w-7xl mx-auto w-full space-y-6">
                        {/* Mantenemos el toggleSidebar para los PageHeaders de cada página */}
                        <Outlet context={{ toggleSidebar }} />
                    </div>
                </main>
            </div>
        </div>
    );
};