
import { cn } from '../../../infrastructure/utils';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const MobileNavigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide on scroll down (>10px), show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 10) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Map paths to the IDs used in the snippet
    const pathMap = [
        { id: 'dashboard', path: '/dashboard' },
        { id: 'profile', path: '/profile' },
        { id: 'notifications', path: '/notifications' },
        { id: 'help', path: '/help' },
        // { id: 'settings', path: '/profile/personal-data' } // Optional fifth item
    ];

    const getActiveId = () => {
        const found = pathMap.find(item => location.pathname.startsWith(item.path));
        return found ? found.id : 'dashboard';
    };

    const [activeId, setActiveId] = useState(getActiveId());

    useEffect(() => {
        setActiveId(getActiveId());
    }, [location.pathname]);

    const handleNavigation = (id: string, path: string) => {
        setActiveId(id);
        navigate(path);
    };

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center pb-4 px-2 pointer-events-none md:hidden transition-transform duration-300 ease-in-out",
            !isVisible && "translate-y-[150%]"
        )}>
            <div className="pointer-events-auto w-auto">
                <div className="flex justify-center items-center relative transition-all duration-[450ms] ease-in-out w-auto">
                    <article className="border border-solid border-gray-200 dark:border-slate-700 w-full ease-in-out duration-500 left-0 rounded-2xl flex shadow-xl shadow-black/10 bg-white dark:bg-slate-800 backdrop-blur-md px-2">

                        {/* Dashboard */}
                        <label
                            className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-transparent has-[:checked]:border-black/5 dark:has-[:checked]:border-white/10 group flex flex-row gap-3 items-center justify-center text-slate-500 dark:text-slate-400 rounded-xl cursor-pointer"
                            htmlFor="dashboard"
                            onClick={() => handleNavigation('dashboard', '/dashboard')}
                        >
                            <input
                                id="dashboard"
                                name="mobile-nav"
                                type="radio"
                                className="hidden peer/expand"
                                checked={activeId === 'dashboard'}
                                readOnly
                            />
                            <svg viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg" className="peer-checked/expand:text-blue-500 peer-checked/expand:fill-blue-500/20 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300 transition-all">
                                <path fill="currentColor" d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z" />
                            </svg>
                        </label>

                        {/* Notifications (using Messages icon from snippet roughly) */}
                        <label
                            className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-transparent has-[:checked]:border-black/5 dark:has-[:checked]:border-white/10 group flex flex-row gap-3 items-center justify-center text-slate-500 dark:text-slate-400 rounded-xl cursor-pointer"
                            htmlFor="notifications"
                            onClick={() => handleNavigation('notifications', '/notifications')}
                        >
                            <input
                                id="notifications"
                                name="mobile-nav"
                                type="radio"
                                className="hidden peer/expand"
                                checked={activeId === 'notifications'}
                                readOnly
                            />
                            <svg viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg" className="peer-checked/expand:text-blue-500 peer-checked/expand:fill-blue-500/20 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300 transition-all">
                                <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                            </svg>
                        </label>

                        {/* Help */}
                        <label
                            className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-transparent has-[:checked]:border-black/5 dark:has-[:checked]:border-white/10 group flex flex-row gap-3 items-center justify-center text-slate-500 dark:text-slate-400 rounded-xl cursor-pointer"
                            htmlFor="help"
                            onClick={() => handleNavigation('help', '/help')}
                        >
                            <input
                                id="help"
                                name="mobile-nav"
                                type="radio"
                                className="hidden peer/expand"
                                checked={activeId === 'help'}
                                readOnly
                            />
                            <svg viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg" className="peer-checked/expand:text-blue-500 peer-checked/expand:fill-blue-500/20 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300 transition-all">
                                <path fill="currentColor" d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM12 20c-4.411 0-8-3.589-8-8s3.567-8 7.953-8C16.391 4 20 7.589 20 12s-3.589 8-8 8z" />
                                <path fill="currentColor" d="M11 7h2v7h-2zm0 8h2v2h-2z" />
                            </svg>
                        </label>

                        {/* Profile */}
                        <label
                            className="has-[:checked]:shadow-lg relative w-full h-16 p-4 ease-in-out duration-300 border-solid border-transparent has-[:checked]:border-black/5 dark:has-[:checked]:border-white/10 group flex flex-row gap-3 items-center justify-center text-slate-500 dark:text-slate-400 rounded-xl cursor-pointer"
                            htmlFor="profile"
                            onClick={() => handleNavigation('profile', '/profile')}
                        >
                            <input
                                id="profile"
                                name="mobile-nav"
                                type="radio"
                                className="hidden peer/expand"
                                checked={activeId === 'profile'}
                                readOnly
                            />
                            <svg viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg" className="peer-checked/expand:text-blue-500 peer-checked/expand:fill-blue-500/20 text-2xl peer-checked/expand:scale-125 ease-in-out duration-300 transition-all">
                                <path fill="currentColor" d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z" />
                            </svg>
                        </label>
                    </article>
                </div>
            </div>
        </div>
    );
};
