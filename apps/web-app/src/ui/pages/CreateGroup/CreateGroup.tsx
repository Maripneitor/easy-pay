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
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Header */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={activeTab === 'create' ? 'Nuevo Grupo' : 'Unirse a Grupo'}
                    onBack={goBack}
                    rightSlot={<div className="w-8" />} 
                />

                <main className="flex-1 w-full max-w-xl mx-auto px-6 py-8 flex flex-col items-center space-y-8">

                    {/* Tabs Adaptables */}
                    <div className="w-full bg-[var(--bg-card)] p-1 rounded-xl flex border border-[var(--border-color)] transition-colors duration-300 shadow-sm">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                activeTab === 'create'
                                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
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
                                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                            )}
                        >
                            <Users size={16} />
                            Unirse a Grupo
                        </button>
                    </div>

                    {/* Create Form */}
                    {activeTab === 'create' && (
                        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 space-y-6 shadow-xl transition-colors duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Nombre del Grupo</label>
                                    <input
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="Ej. Viaje a la playa"
                                        className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Descripción (Opcional)</label>
                                    <textarea
                                        value={groupDesc}
                                        onChange={(e) => setGroupDesc(e.target.value)}
                                        placeholder="¿De qué trata este grupo?"
                                        rows={3}
                                        className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all resize-none font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Invitar Miembros</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Buscar por nombre o email..."
                                            className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-3 text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all font-medium"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => handleAddMember(searchQuery)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--primary)] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md hover:opacity-90 transition-all"
                                            >
                                                Añadir
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Listado de miembros */}
                                <div className="space-y-2 pt-2">
                                    <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold ml-1 opacity-70">Miembros añadidos</p>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                        {members.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between p-3 bg-[var(--bg-body)] rounded-xl border border-[var(--border-color)] group hover:border-[var(--primary)] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 p-[2px] shadow-sm">
                                                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full border-2 border-[var(--bg-card)]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[var(--text-primary)]">{member.name}</p>
                                                        <p className="text-xs text-[var(--text-secondary)]">{member.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {member.isAdmin ? (
                                                        <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                                                            <Check size={16} className="text-emerald-500" />
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleRemoveMember(member.id)} 
                                                            className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                                        >
                                                            <Check size={16} className="rotate-45" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full bg-[var(--primary)] hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[var(--primary)]/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] group"
                                onClick={handleCreateGroup}
                            >
                                <span>Crear Grupo</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {/* Join Form Adaptable */}
                    {activeTab === 'join' && (
                        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-4 py-8">
                                <div className="w-20 h-20 bg-[var(--bg-card)] mx-auto rounded-2xl flex items-center justify-center border border-[var(--border-color)] shadow-lg mb-4 group hover:scale-105 transition-transform">
                                    <QrCode size={40} className="text-[var(--primary)] group-hover:rotate-3 transition-transform" />
                                </div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Escanea un código QR</h2>
                                <p className="text-[var(--text-secondary)] max-w-xs mx-auto text-sm font-medium">
                                    Pídele al administrador del grupo que te muestre su código QR para unirte al instante.
                                </p>
                                <button className="bg-[var(--bg-card)] hover:bg-[var(--hover-bg)] border border-[var(--border-color)] text-[var(--text-primary)] px-6 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95">
                                    Abrir Cámara
                                </button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[var(--border-color)]"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-3 bg-[var(--bg-body)] text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">O ingresa el código</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Ej. ABC-123"
                                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-5 text-center text-2xl tracking-widest uppercase font-mono text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all shadow-inner"
                                />
                                <button
                                    className="w-full bg-[var(--bg-card)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] font-bold py-4 rounded-xl border border-[var(--border-color)] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
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