import React from 'react';
import { Plane } from 'lucide-react';

export const InvitationCard: React.FC = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-l-4 border-slate-200 border-l-blue-500 bg-white p-5 shadow-sm dark:border-slate-800 dark:border-l-blue-500 dark:bg-slate-900">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 ring-1 ring-inset ring-blue-500/20">
                        <Plane size={24} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Viaje a la playa
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Invitado por <span className="font-medium text-blue-500">María González</span>
                        </p>
                    </div>
                </div>

                <div className="flex w-full gap-3 md:w-auto">
                    <button className="flex-1 rounded-lg border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white md:flex-none">
                        Rechazar
                    </button>
                    <button className="flex-1 rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-sm shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/50 hover:-translate-y-0.5 md:flex-none">
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};
