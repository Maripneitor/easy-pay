import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';


export const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
            {/* Sidebar Navigation */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Page Header is usually specific to the page, but we can have a default one or just rely on pages.
                    However, the request was to use a Layout to avoid re-rendering Sidebar.
                    If we put PageHeader here, it stays static unless we pass props.
                    Since existing pages have their own PageHeader, we should probably NOT render it here, 
                    OR we should refactor pages to NOT render it.
                    
                    Refactoring all pages is a big task. 
                    Better approach: 
                    The Layout stays, Sidebar stays. 
                    The `Outlet` renders the page, which renders the `PageHeader`.
                    BUT the `PageHeader` needs to open the sidebar.
                    
                    So we need to pass `toggleSidebar` to the Outlet context.
                */}

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
                    <div className="max-w-7xl mx-auto w-full space-y-6">
                        <Outlet context={{ toggleSidebar }} />
                    </div>
                </main>
            </div>
        </div>
    );
};
