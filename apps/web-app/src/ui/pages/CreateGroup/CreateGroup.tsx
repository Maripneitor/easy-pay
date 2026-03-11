import {
    Users,
    QrCode,
    Plus,
    ArrowRight,
    Search,
    Check
} from 'lucide-react';
import { cn } from '@infrastructure/utils';
import { useCreateGroup } from './useCreateGroup';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext } from 'react-router-dom';

export const CreateGroup = () => {
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const {
        groupName,
        setGroupName,
        groupDesc,
        setGroupDesc,
        searchQuery,
        setSearchQuery,
        members,
        handleCreateGroup,
        handleAddMember,
        handleRemoveMember,
        goBack,
        activeTab,
        setActiveTab
    } = useCreateGroup();

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-alice-blue dark:bg-slate-900 font-display text-slate-800 dark:text-slate-200 antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={activeTab === 'create' ? 'Nuevo Grupo' : 'Unirse a Grupo'}
                    onBack={goBack}
                    rightSlot={<div className="w-8" />} // Spacer to balance back button if needed, or leave empty
                />

                <main className="flex-1 w-full max-w-xl mx-auto px-6 py-8 flex flex-col items-center space-y-8">

                    {/* Tabs */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl flex border border-slate-200 dark:border-slate-700/50 transition-colors duration-300">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                activeTab === 'create'
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/30"
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
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/30"
                            )}
                        >
                            <Users size={16} />
                            Unirse a Grupo
                        </button>
                    </div>

                    {/* Create Form */}
                    {activeTab === 'create' && (
                        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-6 shadow-xl transition-colors duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Nombre del Grupo</label>
                                    <input
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="Ej. Viaje a la playa"
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Descripción (Opcional)</label>
                                    <textarea
                                        value={groupDesc}
                                        onChange={(e) => setGroupDesc(e.target.value)}
                                        placeholder="¿De qué trata este grupo?"
                                        rows={3}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Invitar Miembros</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Buscar por nombre o email..."
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => handleAddMember(searchQuery)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-1 rounded-lg text-xs"
                                            >
                                                Añadir
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Mock Member List */}
                                <div className="space-y-2 pt-2">
                                    <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold ml-1">Miembros añadidos</p>
                                    {members.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                                                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {member.isAdmin ? (
                                                    <div className="bg-emerald-500/10 p-1 rounded-full">
                                                        <Check size={16} className="text-emerald-500" />
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                        <Check size={16} className="rotate-45" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                                onClick={handleCreateGroup}
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
                                <div className="w-20 h-20 bg-white dark:bg-slate-800 mx-auto rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-glow mb-4">
                                    <QrCode size={40} className="text-blue-500 dark:text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Escanea un código QR</h2>
                                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                    Pídele al administrador del grupo que te muestre su código QR para unirte al instante.
                                </p>
                                <button className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-colors">
                                    Abrir Cámara
                                </button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-alice-blue dark:bg-slate-900 text-slate-400 dark:text-slate-500">O ingresa el código</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Ej. ABC-123"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-center text-2xl tracking-widest uppercase font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                                <button
                                    className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2 transition-all"
                                    onClick={() => handleCreateGroup()}
                                >
                                    Unirse Manualmente
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
