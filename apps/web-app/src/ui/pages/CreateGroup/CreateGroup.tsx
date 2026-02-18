import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Users,
    QrCode,
    Plus,
    ArrowRight,
    Search,
    Check
} from 'lucide-react';
import { cn } from '@infrastructure/utils';

export const CreateGroup = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
    const [groupName, setGroupName] = useState('');

    return (
        <div className="bg-slate-900 font-display text-slate-200 min-h-screen flex flex-col antialiased selection:bg-blue-500 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/30">
                <div className="max-w-xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium z-10"
                    >
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                        <span>Volver</span>
                    </button>
                    <h1 className="font-bold text-white text-lg">
                        {activeTab === 'create' ? 'Nuevo Grupo' : 'Unirse a Grupo'}
                    </h1>
                    <div className="w-16"></div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-xl mx-auto px-6 py-8 flex flex-col items-center">

                {/* Tabs */}
                <div className="w-full bg-slate-800/50 p-1 rounded-xl flex mb-8 border border-slate-700/50">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={cn(
                            "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                            activeTab === 'create'
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                        )}
                    >
                        <Plus size={16} />
                        Crear Grupo
                    </button>
                    <button
                        onClick={() => setActiveTab('join')}
                        className={cn(
                            "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                            activeTab === 'join'
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                        )}
                    >
                        <Users size={16} />
                        Unirse a Grupo
                    </button>
                </div>

                {/* Create Form */}
                {activeTab === 'create' && (
                    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6 shadow-xl">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Nombre del Grupo</label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Ej. Viaje a la playa"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Descripción (Opcional)</label>
                                <textarea
                                    placeholder="¿De qué trata este grupo?"
                                    rows={3}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Invitar Miembros</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o email..."
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Mock Member List */}
                            <div className="space-y-2 pt-2">
                                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold ml-1">Miembros añadidos</p>
                                <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                                            <img src="https://ui-avatars.com/api/?name=Tu&background=0f172a&color=fff" alt="You" className="w-full h-full rounded-full" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Tú</p>
                                            <p className="text-xs text-slate-400">Admin</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-500/10 p-1 rounded-full">
                                        <Check size={16} className="text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                            onClick={() => navigate('/dashboard')}
                        >
                            <span>Crear Grupo</span>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* Join Form */}
                {activeTab === 'join' && (
                    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-4 py-8">
                            <div className="w-20 h-20 bg-slate-800 mx-auto rounded-2xl flex items-center justify-center border border-slate-700 shadow-glow mb-4">
                                <QrCode size={40} className="text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Escanea un código QR</h2>
                            <p className="text-slate-400 max-w-xs mx-auto">
                                Pídele al administrador del grupo que te muestre su código QR para unirte al instante.
                            </p>
                            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                                Abrir Cámara
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-900 text-slate-500">O ingresa el código</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Ej. ABC-123"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-center text-2xl tracking-widest uppercase font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                            <button
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl border border-slate-600 flex items-center justify-center gap-2 transition-all"
                                onClick={() => navigate('/dashboard')}
                            >
                                Unirse Manualmente
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
