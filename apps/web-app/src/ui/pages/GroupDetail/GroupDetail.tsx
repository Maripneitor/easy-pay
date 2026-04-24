import React from 'react';
import { Share2, Settings, Plus, Receipt, UserCircle, Hash, ArrowRight, DollarSign, CreditCard, X, Pencil, Trash2, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../../../infrastructure/utils';
import { useGroupDetail } from './useGroupDetail';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const GroupDetail = () => {
    const params = useParams();
    const idFinal = params.groupId || params.group_id || params.id || "";
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const navigate = useNavigate();

    const {
        activeTab, setActiveTab, groupName, groupCode, totalSpent,
        userShare, userOwed, activities, balances, members,
        integrantes_data, loading, adminId, currentUserId
    } = useGroupDetail(idFinal);

    const isAdmin = adminId === currentUserId;

    const handleDeleteItem = async (itemId: string) => {
        if (!window.confirm("¿Estás seguro de eliminar este gasto? Los balances se recalcularán.")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_GROUP_SERVICE_URL ?? 'http://localhost:8002'}/api/groups/${idFinal}/items/${itemId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success("Gasto eliminado");
                window.location.reload();
            } else {
                toast.error("Error al eliminar el gasto");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased">
            <div className="flex-1 flex flex-col min-w-0 relative">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={groupName || "Cargando..."}
                    onBack={() => navigate(-1)}
                    rightSlot={
                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <button onClick={() => navigate(`/group/${idFinal}/register-expense`)} className="p-2 text-[var(--primary)] rounded-full hover:bg-[var(--primary)]/10 transition-colors">
                                    <Plus size={22} />
                                </button>
                            )}
                            <button className="p-2 text-[var(--text-secondary)] rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><Settings size={18} /></button>
                        </div>
                    }
                />

                <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
                    {/* --- RESUMEN --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 border-t-[var(--primary)] shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Total Grupo</p>
                            <p className="text-2xl font-black">${Number(totalSpent).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 border-t-slate-400 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Tu Consumo</p>
                            <p className="text-2xl font-black">${Number(userShare).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className={cn("bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 shadow-sm flex flex-col justify-between", userOwed >= 0 ? "border-t-emerald-500" : "border-t-red-500")}>
                            <div>
                                <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", userOwed >= 0 ? "text-emerald-500" : "text-red-500")}>{userOwed >= 0 ? 'Te deben' : 'Debes'}</p>
                                <p className={cn("text-2xl font-black", userOwed >= 0 ? "text-emerald-500" : "text-red-500")}>{userOwed >= 0 ? '+' : '-'}${Math.abs(Number(userOwed)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                            </div>
                            {userOwed < -0.01 && !isAdmin && (
                                <button onClick={() => setActiveTab('payments')} className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-600 transition-all">Liquidar <ArrowRight size={14} /></button>
                            )}
                        </div>
                    </div>

                    {/* --- TABS --- */}
                    <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
                        {['activity', 'balances', 'members'].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab as any)} className={cn("px-6 py-4 text-[10px] font-black uppercase tracking-widest relative whitespace-nowrap", activeTab === tab ? "text-[var(--primary)]" : "text-[var(--text-secondary)]")}>
                                {tab === 'activity' ? 'Actividad' : tab === 'balances' ? 'Saldos' : 'Integrantes'}
                                {activeTab === tab && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[var(--primary)] rounded-t-full shadow-[0_0_15px_var(--primary)]" />}
                            </button>
                        ))}
                    </div>

                    {/* --- CONTENIDO --- */}
                    <div className="min-h-[300px] pb-10">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-30">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary)] border-t-transparent" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Sincronizando...</p>
                            </div>
                        ) : activeTab === 'activity' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                {activities.length > 0 ? activities.map((item: any) => (
                                    <div key={item.id || item._id} className="bg-[var(--bg-card)] border border-[var(--border-color)] border-l-4 border-l-[var(--primary)] rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-[var(--hover-bg)] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]"><Receipt size={20} /></div>
                                            <div className="flex flex-col">
                                                <h3 className="font-bold text-sm text-[var(--text-primary)]">{item.nombre || "Gasto"}</h3>

                                                {/* DIVIDIDO ENTRE (Etiquetas) */}
                                                <div className="flex flex-wrap gap-1 mt-1.5 items-center">
                                                    <Users size={10} className="text-[var(--text-secondary)] opacity-50" />
                                                    {item.nombres_participantes && item.nombres_participantes.length > 0 ? (
                                                        item.nombres_participantes.map((name: string, idx: number) => (
                                                            <span key={idx} className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md font-bold border border-black/5 dark:border-white/5">{name}</span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[8px] text-slate-500 italic">Cargando...</span>
                                                    )}
                                                </div>
                                                <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-tight mt-1 opacity-60">Pagado por: {integrantes_data?.find((i: any) => i.id === item.comprador_id)?.nombre || "Usuario"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5">
                                            {isAdmin && (
                                                <div className="flex items-center gap-1 border-r border-[var(--border-color)] pr-4">
                                                    <button onClick={() => navigate(`/group/${idFinal}/edit-item/${item.id || item._id}`)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"><Pencil size={16} /></button>
                                                    <button onClick={() => handleDeleteItem(item.id || item._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                                                </div>
                                            )}
                                            <div className="text-right">
                                                <span className="font-black text-sm text-[var(--text-primary)]">${Number(item.monto || item.precio || 0).toFixed(2)}</span>
                                                <p className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter">Monto</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="py-20 text-center opacity-30 text-[10px] font-black uppercase">Sin movimientos</div>}
                            </div>
                        )}

                        {activeTab === 'balances' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <h2 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-2">Resumen de Cuentas</h2>
                                <div className="grid gap-3">
                                    {balances?.balance_detallado?.map((b: any) => {
                                        const userObj = integrantes_data?.find((m: any) => m.id === b.usuario_id);
                                        return (
                                            <div key={b.usuario_id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 flex justify-between items-center shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <UserCircle size={24} className="text-slate-400" />
                                                    <span className="font-bold text-sm">{userObj?.nombre || `ID: ${b.usuario_id.slice(-4)}`}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className={cn("font-black text-lg", b.balance >= 0 ? "text-emerald-500" : "text-red-500")}>{b.balance >= 0 ? '+' : '-'}${Math.abs(Number(b.balance)).toFixed(2)}</span>
                                                    <p className="text-[8px] font-black uppercase opacity-40">Saldo Actual</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'members' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Código de Invitación</p>
                                    <div className="p-4 bg-white rounded-2xl shadow-inner mb-6 border border-slate-100"><QRCodeSVG value={groupCode || "EASYPAY"} size={160} /></div>
                                    <h3 className="text-lg font-black text-[var(--text-primary)] mb-2 tracking-widest">{groupCode}</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {members.map((memberId: string) => {
                                        const user = integrantes_data?.find((i: any) => i.id === memberId);
                                        if (!user) return null;
                                        return (
                                            <div key={memberId} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><UserCircle size={24} /></div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-[var(--text-primary)]">{user.nombre}</p>
                                                    <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{memberId === adminId ? "👑 Administrador" : "Integrante"}</p>
                                                </div>
                                                {memberId === currentUserId && <span className="text-[8px] font-black bg-[var(--primary)] text-white px-2 py-1 rounded-full uppercase">Tú</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* --- BOTONES FLOTANTES --- */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-[90%] max-w-[340px] pointer-events-none">
                {isAdmin && (
                    <button onClick={() => navigate(`/group/${idFinal}/register-expense`)} className="pointer-events-auto w-full h-16 bg-[var(--primary)] text-white rounded-3xl shadow-2xl flex items-center justify-center gap-4 active:scale-[0.98] transition-all">
                        <Plus size={22} strokeWidth={3} />
                        <span className="text-[11px] font-black uppercase tracking-[0.25em]">Registrar Gasto</span>
                    </button>
                )}
                {!isAdmin && (
                    <button onClick={() => setActiveTab('payments')} className={cn("pointer-events-auto w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase text-[10px] tracking-[0.2em] backdrop-blur-xl border", activeTab === 'payments' ? "bg-emerald-500 text-white border-emerald-400" : "bg-[var(--bg-card)]/80 text-emerald-500 shadow-xl")}>
                        <CreditCard size={18} strokeWidth={2.5} />
                        <span>Liquidar Deuda</span>
                    </button>
                )}
            </div>
        </div>
    );
};