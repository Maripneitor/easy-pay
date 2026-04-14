import React from 'react';
import { Share2, Settings, Plus, Receipt, UserCircle, Hash } from 'lucide-react';
import { cn } from '../../../infrastructure/utils';
import { useGroupDetail } from './useGroupDetail';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';

export const GroupDetail = () => {
    // 🚩 SOLUCIÓN AL ID VACÍO:
    // Extraemos todos los parámetros posibles que React Router pueda estar enviando
    const params = useParams();

    // Buscamos el ID probando todas las combinaciones comunes. 
    // Esto garantiza que idFinal tenga el valor '69d73b...' de tu URL.
    const idFinal = params.groupId || params.group_id || params.id || "";

    // Log para que verifiques en consola que ahora sí aparece el ID largo
    //console.log("🆔 ID detectado para el Hook:", idFinal);

    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const navigate = useNavigate();

    const {
        activeTab,
        setActiveTab,
        groupName,
        groupCode,
        members = [],
        totalSpent,
        userShare,
        userOwed,
        activities = [],
        balances,
        loading
    } = useGroupDetail(idFinal);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-body)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] shadow-[0_0_15px_var(--primary)] mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 animate-pulse">Sincronizando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-body)] font-display text-[var(--text-primary)] transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-24 md:pb-0">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={groupName || "Detalle del Grupo"}
                    onBack={() => navigate('/dashboard')}
                    rightSlot={
                        <div className="flex gap-1">
                            <button className="p-2 text-[var(--text-secondary)] rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Share2 size={18} />
                            </button>
                            <button className="p-2 text-[var(--text-secondary)] rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Settings size={18} />
                            </button>
                        </div>
                    }
                />

                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
                    {/* Tarjetas de Resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 border-t-[var(--primary)] shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Total Grupo</p>
                            <p className="text-2xl font-black">${Number(totalSpent).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 border-t-slate-400 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Tu Parte</p>
                            <p className="text-2xl font-black">${Number(userShare).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className={cn(
                            "bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 shadow-sm",
                            userOwed >= 0 ? "border-t-emerald-500" : "border-t-red-500"
                        )}>
                            <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", userOwed >= 0 ? "text-emerald-500" : "text-red-500")}>
                                {userOwed >= 0 ? 'Te deben' : 'Debes'}
                            </p>
                            <p className={cn("text-2xl font-black", userOwed >= 0 ? "text-emerald-500" : "text-red-500")}>
                                {userOwed >= 0 ? '+' : '-'}${Math.abs(Number(userOwed)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
                        {['activity', 'balances', 'members'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    "px-6 py-4 text-[10px] font-black uppercase tracking-widest relative transition-all whitespace-nowrap",
                                    activeTab === tab ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"
                                )}
                            >
                                {tab === 'activity' ? 'Actividad' : tab === 'balances' ? 'Saldos' : 'Integrantes'}
                                {activeTab === tab && (
                                    <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[var(--primary)] rounded-t-full shadow-[0_0_15px_var(--primary)]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Contenido Dinámico */}
                    <div className="min-h-[300px] pb-10">
                        {activeTab === 'members' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                                        Participantes ({members.length})
                                    </h2>
                                    <div className="flex items-center gap-2 bg-[var(--primary)]/10 px-3 py-1.5 rounded-xl border border-[var(--primary)]/20 shadow-sm shadow-[var(--primary)]/5">
                                        <Hash size={12} className="text-[var(--primary)]" />
                                        <span className="text-[10px] font-black tracking-widest text-[var(--primary)] uppercase">
                                            {groupCode || "S/C"}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    {members.length > 0 ? members.map((member: any) => {
                                        // 🛠️ Lógica de extracción: 
                                        // Si 'member' es un objeto {nombre: 'Erick'}, usamos el nombre.
                                        // Si es solo el ID '64a3...', lo mostramos recortado.
                                        const memberId = typeof member === 'string' ? member : (member.id || member._id || 'ID');
                                        const displayName = typeof member === 'object' ? member.nombre : `Usuario ${memberId.slice(-6)}`;
                                        const initial = displayName.charAt(0).toUpperCase();

                                        return (
                                            <div key={memberId} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[var(--primary)] font-black text-xl">
                                                    {initial}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">{displayName}</p>
                                                    <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest">
                                                        Miembro Activo
                                                    </p>
                                                </div>
                                                {memberId === localStorage.getItem('userId') && (
                                                    <span className="text-[8px] font-black bg-[var(--primary)] text-white px-2 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20">
                                                        Tú
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    }) : (
                                        <div className="py-20 text-center border-2 border-dashed border-[var(--border-color)] rounded-3xl opacity-30 text-[10px] font-black uppercase">
                                            No se encontraron integrantes
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actividad */}
                        {activeTab === 'activity' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                {activities.length > 0 ? activities.map((item: any) => (
                                    <div key={item.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] border-l-4 border-l-[var(--primary)] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]"><Receipt size={20} /></div>
                                            <h3 className="font-bold text-sm">{item.nombre || item.concepto || "Gasto"}</h3>
                                        </div>
                                        <span className="font-black text-sm">${Number(item.precio || item.monto || 0).toFixed(2)}</span>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center border-2 border-dashed border-[var(--border-color)] rounded-3xl opacity-30 text-[10px] font-black uppercase">No hay gastos</div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Botón Flotante */}
            <button
                onClick={() => navigate(`/group/${idFinal}/register-expense`)}
                className="fixed bottom-10 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-2xl shadow-[var(--primary)]/40 transition-all hover:scale-110 active:scale-90"
            >
                <Plus size={32} strokeWidth={3} />
            </button>
        </div>
    );
};