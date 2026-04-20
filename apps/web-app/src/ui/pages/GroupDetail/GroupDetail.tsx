import React from 'react';
import { Share2, Settings, Plus, Receipt, UserCircle, Hash, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../../../infrastructure/utils';
import { useGroupDetail } from './useGroupDetail';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';

export const GroupDetail = () => {
    const params = useParams();
    const idFinal = params.groupId || params.group_id || params.id || "";

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

                    {/* --- SECCIÓN 1: TARJETAS DE RESUMEN --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Gasto Total del Grupo */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 border-t-[var(--primary)] shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Total Grupo</p>
                            <p className="text-2xl font-black">${Number(totalSpent).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>

                        {/* Tu Consumo Individual */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 border-t-slate-400 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Tu Gasto</p>
                            <p className="text-2xl font-black">${Number(userShare).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>

                        {/* Balance Neto (Deuda/Favor) */}
                        <div className={cn(
                            "bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 shadow-sm transition-all flex flex-col justify-between",
                            userOwed >= 0 ? "border-t-emerald-500" : "border-t-red-500"
                        )}>
                            <div>
                                <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", userOwed >= 0 ? "text-emerald-500" : "text-red-500")}>
                                    {userOwed >= 0 ? 'Te deben' : 'Debes'}
                                </p>
                                <p className={cn("text-2xl font-black", userOwed >= 0 ? "text-emerald-500" : "text-red-500")}>
                                    {userOwed >= 0 ? '+' : '-'}${Math.abs(Number(userOwed)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            {/* Botón para liquidar deudas (Solo si debes > 0) */}
                            {userOwed < -0.01 && (
                                <button
                                    onClick={() => navigate(`/group/${idFinal}/settle-up`)}
                                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Liquidar <ArrowRight size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* --- SECCIÓN 2: TABS DE NAVEGACIÓN --- */}
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

                    {/* --- SECCIÓN 3: CONTENIDO DINÁMICO --- */}
                    <div className="min-h-[300px] pb-10">

                        {/* TAB: ACTIVIDAD (Historial de Gastos con Participantes) */}
                        {activeTab === 'activity' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                {activities.length > 0 ? activities.map((item: any) => (
                                    <div key={item.id || item._id} className="bg-[var(--bg-card)] border border-[var(--border-color)] border-l-4 border-l-[var(--primary)] rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-[var(--hover-bg)] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                                                <Receipt size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                                                    {item.nombre || item.concepto || "Gasto registrado"}
                                                </h3>
                                                <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-tight">
                                                    Dividido entre: {item.nombres_participantes?.join(", ") || "Todos los miembros"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-black text-sm text-[var(--text-primary)]">
                                                ${Number(item.monto || item.precio || 0).toFixed(2)}
                                            </span>
                                            <p className="text-[8px] text-slate-500 uppercase font-bold">Total</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center border-2 border-dashed border-[var(--border-color)] rounded-3xl opacity-30 text-[10px] font-black uppercase tracking-widest">
                                        No hay actividad registrada
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: SALDOS (Lista de quién debe a quién) */}
                        {activeTab === 'balances' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <h2 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-2">Resumen de Cuentas</h2>
                                <div className="grid gap-3">
                                    {balances?.balance_detallado?.map((b: any) => {
                                        const userObj = members.find(m => m.id === b.usuario_id);
                                        const name = userObj ? userObj.nombre : `Usuario ${b.usuario_id.slice(-6)}`;

                                        return (
                                            <div key={b.usuario_id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 flex justify-between items-center shadow-sm transition-all hover:scale-[1.01]">
                                                <div className="flex items-center gap-3">
                                                    <UserCircle size={24} className="text-slate-400" />
                                                    <span className="font-bold text-sm">{name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className={cn("font-black text-lg", b.balance >= 0 ? "text-emerald-500" : "text-red-500")}>
                                                        {b.balance >= 0 ? '+' : '-'}${Math.abs(Number(b.balance)).toFixed(2)}
                                                    </span>
                                                    <p className="text-[8px] font-black uppercase opacity-40">Saldo Neto</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TAB: INTEGRANTES (Gestión y QR) */}
                        {activeTab === 'members' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                {/* Generador de Invitación QR */}
                                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Invitar al Grupo</p>
                                    <div className="p-4 bg-white rounded-2xl shadow-inner mb-6 border border-slate-100">
                                        {groupCode ? (
                                            <QRCodeSVG value={groupCode} size={180} level={"H"} includeMargin={false} />
                                        ) : (
                                            <div className="w-[180px] h-[180px] bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-[10px] text-slate-300">CARGANDO...</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Código de acceso</p>
                                        <div className="bg-[var(--primary)]/10 px-6 py-2 rounded-2xl border border-[var(--primary)]/20">
                                            <span className="text-2xl font-black tracking-[0.4em] text-[var(--primary)] uppercase">
                                                {groupCode || "----"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de Participantes */}
                                <div className="space-y-3">
                                    <h2 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-2">Participantes ({members.length})</h2>
                                    <div className="grid gap-3">
                                        {members.map((member: any) => {
                                            const memberId = typeof member === 'string' ? member : (member.id || member._id);
                                            const displayName = typeof member === 'object' ? member.nombre : `Usuario ${memberId.slice(-6)}`;
                                            return (
                                                <div key={memberId} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[var(--primary)] font-black text-xl">
                                                        {displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-sm text-[var(--text-primary)]">{displayName}</p>
                                                        <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Miembro Activo</p>
                                                    </div>
                                                    {memberId === localStorage.getItem('userId') && (
                                                        <span className="text-[8px] font-black bg-[var(--primary)] text-white px-2 py-1 rounded-full uppercase shadow-lg shadow-[var(--primary)]/20">Tú</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* BOTÓN FLOTANTE: Registrar Gasto */}
            <button
                onClick={() => navigate(`/group/${idFinal}/register-expense`)}
                className="fixed bottom-10 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-2xl shadow-[var(--primary)]/40 transition-all hover:scale-110 active:scale-90"
            >
                <Plus size={32} strokeWidth={3} />
            </button>
        </div>
    );
};