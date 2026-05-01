import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { useAuth } from '../pages/Auth/useAuth';
import { CommandPalette } from '../components/CommandPalette/CommandPalette';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';

export const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { logout } = useAuth();

    useKeyboardShortcuts();

    const userName = localStorage.getItem('userName') || 'Usuario';
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-[var(--bg-body)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300 font-display">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={logout}
                userName={userName}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 transition-all duration-300">
                    <div className="max-w-7xl mx-auto w-full space-y-6">
                        <Outlet context={{ toggleSidebar, isSidebarOpen }} />
                    </div>
                </main>
            </div>
            
            <CommandPalette />
        </div>
    );
};