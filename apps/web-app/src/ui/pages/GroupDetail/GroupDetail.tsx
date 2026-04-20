import React from 'react';
import { Share2, Settings, Plus, Receipt, UserCircle, Hash, ArrowRight, DollarSign, CreditCard, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../../../infrastructure/utils';
import { useGroupDetail } from './useGroupDetail';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const GroupDetail = () => {
    const params = useParams();
    const idFinal = params.groupId || params.group_id || params.id || "";

    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const navigate = useNavigate();

    // ERROR CORREGIDO: Pasando idFinal al hook para cargar los datos
    const {
        activeTab,
        setActiveTab,
        groupName,
        groupCode,
        totalSpent,
        userShare,
        userOwed,
        activities,
        balances,
        members,
        integrantes_data,
        loading
    } = useGroupDetail(idFinal);

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased">
            <div className="flex-1 flex flex-col min-w-0 relative">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title={groupName || "Cargando..."}
                    onBack={() => navigate(-1)}
                    rightSlot={
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => navigate(`/group/${idFinal}/register-expense`)}
                                className="p-2 text-[var(--primary)] rounded-full hover:bg-[var(--primary)]/10 transition-colors"
                            >
                                <Plus size={22} />
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
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 border-t-[var(--primary)] shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Total Grupo</p>
                            <p className="text-2xl font-black">${Number(totalSpent).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>

                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 border-t-4 border-t-slate-400 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">Tu Gasto</p>
                            <p className="text-2xl font-black">${Number(userShare).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        </div>

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
                            {userOwed < -0.01 && (
                                <button
                                    onClick={() => setActiveTab('payments')}
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
                        {loading ? (
                             <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-30">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary)] border-t-transparent" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Cargando Actividad...</p>
                             </div>
                        ) : activeTab === 'activity' && (
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
                                                    Pagado por: {integrantes_data.find((i:any) => i.id === item.comprador_id)?.nombre || "Alguien"}
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

                        {activeTab === 'balances' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <h2 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-2">Resumen de Cuentas</h2>
                                <div className="grid gap-3">
                                    {balances?.balance_detallado?.map((b: any) => {
                                        const userObj = integrantes_data.find((m:any) => m.id === b.usuario_id);
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

                        {activeTab === 'members' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Invitar al Grupo</p>
                                    <div className="p-4 bg-white rounded-2xl shadow-inner mb-6 border border-slate-100">
                                        <QRCodeSVG value={groupCode || "EASYPAY-GROUP"} size={160} />
                                    </div>
                                    <h3 className="text-lg font-black text-[var(--text-primary)] mb-2">{groupCode}</h3>
                                    <p className="text-xs text-[var(--text-secondary)] font-medium max-w-[200px]">Escanea este código para unirte al grupo rápidamente.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {members.map((memberId: string) => {
                                        const user = integrantes_data.find((i: any) => i.id === memberId);
                                        if (!user) return null;
                                        return (
                                            <div key={memberId} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <UserCircle size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-[var(--text-primary)]">{user.nombre}</p>
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
                        )}
                    </div>
                </main>
            </div>

            {/* --- ACCIONES REACOMODADAS: Stack Vertical --- */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-[90%] max-w-[340px] pointer-events-none">
                <button
                    onClick={() => navigate(`/group/${idFinal}/register-expense`)}
                    className="pointer-events-auto w-full h-16 bg-[var(--primary)] text-white rounded-3xl shadow-2xl shadow-[var(--primary)]/30 flex items-center justify-center gap-4 active:scale-[0.98] transition-all group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-[11px] font-black uppercase tracking-[0.25em]">Registrar Gasto</span>
                </button>

                <button
                    onClick={() => setActiveTab('payments')}
                    className={cn(
                        "pointer-events-auto w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase text-[10px] tracking-[0.2em] backdrop-blur-xl border",
                        activeTab === 'payments'
                            ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_10px_20px_rgba(16,185,129,0.3)]"
                            : "bg-[var(--bg-card)]/80 text-emerald-500 border-white/10 shadow-xl shadow-black/10 hover:bg-emerald-500/5"
                    )}
                >
                    <CreditCard size={18} strokeWidth={2.5} />
                    <span>Liquidar Deuda</span>
                </button>
            </div>

            {/* --- OVERLAY: MÉTODO DE PAGO (True Transparency) --- */}
            <AnimatePresence>
                {activeTab === 'payments' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        {/* Backdrop: Casi invisible, desenfoque mínimo para ver el fondo */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveTab('activity')}
                            className="absolute inset-0 bg-black/5 backdrop-blur-[2px]" 
                        />
                        
                        {/* Tarjeta del Modal: Transparencia Real */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-lg bg-[var(--bg-card)]/40 backdrop-blur-xl border border-white/20 rounded-[3rem] p-8 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-[110]"
                        >
                            {/* Brillos muy tenues */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)] opacity-5 blur-[60px] rounded-full" />

                            <button 
                                onClick={() => setActiveTab('activity')}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 transition-all z-20"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-10 relative z-10">
                                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                                    <Receipt size={40} className="text-[var(--primary)]" />
                                </div>
                                <h4 className="text-3xl font-black text-white tracking-tight">Pagar Deuda</h4>
                                <p className="text-white/40 text-sm font-medium">Selecciona un método para liquidar</p>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {[
                                    { id: 'card', icon: CreditCard, color: 'blue', title: 'Tarjeta de Crédito', sub: 'Visa, Mastercard, Amex' },
                                    { id: 'transfer', icon: Share2, color: 'emerald', title: 'Transferencia Bancaria', sub: 'SPEI, Transferencia Inmediata' },
                                    { id: 'cash', icon: DollarSign, color: 'orange', title: 'Efectivo', sub: 'Pago manual registrado' }
                                ].map((opt) => (
                                    <button 
                                        key={opt.id}
                                        onClick={() => navigate(`/group/${idFinal}/settle-up`)}
                                        className="w-full flex items-center gap-5 p-5 bg-white/[0.02] hover:bg-white/[0.08] rounded-2xl transition-all border border-white/5 hover:border-white/10 text-left group active:scale-[0.98]"
                                    >
                                        <div className={cn(
                                            "w-14 h-14 flex items-center justify-center rounded-2xl transition-all border",
                                            opt.color === 'blue' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                            opt.color === 'emerald' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                            "bg-orange-500/10 border-orange-500/20 text-orange-400"
                                        )}>
                                            <opt.icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-white">{opt.title}</p>
                                            <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest">{opt.sub}</p>
                                        </div>
                                        <ArrowRight size={18} className="text-[var(--primary)] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                    </button>
                                ))}
                            </div>

                            <div className="mt-10 pt-6 border-t border-white/5 text-center relative z-10">
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">Seguridad Encriptada por Easy-Pay Protocol</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
