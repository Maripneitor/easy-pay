import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
    DollarSign,
    MoreHorizontal,
    Check,
    User,
    Users,
    ArrowLeft,
    Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@infrastructure/utils';
import { PageHeader } from '@ui/components/PageHeader';
import { useRegisterExpense } from './useRegisterExpense';

export const RegisterExpense = () => {
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const navigate = useNavigate();
    const {
        formData,
        setFormData,
        integrantes,
        handleSubmit,
        loading,
        toggleParticipante
    } = useRegisterExpense();

    // Buscamos el objeto del comprador actual para mostrar su nombre
    const currentComprador = integrantes.find(i => i.id === formData.comprador_id);

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased overflow-x-hidden">
            {/* Efectos de fondo premium */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[var(--primary)] opacity-[0.03] blur-[120px] rounded-full" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-blue-500 opacity-[0.03] blur-[100px] rounded-full" />
            </div>

            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0 z-10">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="Nuevo Gasto"
                    onBack={() => navigate(-1)}
                    rightSlot={
                        <button
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={22} />
                        </button>
                    }
                />

                <main className="flex-1 w-full max-w-xl mx-auto px-6 py-8 space-y-10">
                    
                    {/* --- SECCIÓN DEL MONTO --- */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center space-y-2"
                    >
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">Monto del Gasto</p>
                        <div className="relative flex items-center group">
                            <div className="absolute -left-12 text-4xl font-black text-[var(--primary)] opacity-20 group-focus-within:opacity-100 transition-opacity duration-500">
                                $
                            </div>
                            <input
                                type="number"
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                placeholder="0.00"
                                className="bg-transparent text-7xl md:text-8xl font-black text-[var(--text-primary)] text-center w-full focus:outline-none placeholder:opacity-10 tracking-tighter"
                                autoFocus
                            />
                        </div>
                    </motion.div>

                    {/* --- FORMULARIO DE DETALLES --- */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <div className="bg-[var(--bg-card)]/60 backdrop-blur-xl border border-[var(--border-color)] rounded-[2.5rem] p-6 shadow-2xl shadow-black/5 space-y-6 relative overflow-hidden group">
                            {/* Brillo decorativo */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-[0.02] blur-3xl rounded-full transition-all group-focus-within:opacity-10" />

                            {/* Campo: Concepto */}
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] border border-[var(--primary)]/10 shadow-inner group-focus-within:bg-[var(--primary)]/10 transition-all">
                                    <Receipt size={24} className="drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1 opacity-50">¿Qué se compró?</p>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Ej. Cena en el centro"
                                        className="w-full bg-transparent text-xl font-bold placeholder:text-slate-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />

                            {/* Campo: Pagado por (Info) */}
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                                    <User size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1 opacity-50">Pagado por</p>
                                    <p className="text-xl font-bold text-[var(--text-primary)]">
                                        {currentComprador ? currentComprador.nombre : "Cargando..."}
                                    </p>
                                </div>
                                <div className="bg-emerald-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20 animate-pulse">
                                    Tú
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- SECCIÓN DE PARTICIPANTES --- */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.25em] flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                Dividir entre
                            </h3>
                            <div className="flex items-center gap-2 text-[var(--primary)] bg-[var(--primary)]/10 px-4 py-1.5 rounded-full border border-[var(--primary)]/20 shadow-sm transition-all hover:scale-105">
                                <Users size={14} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">
                                    {formData.participantes_ids.length} Miembros
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <AnimatePresence mode="popLayout">
                                {integrantes.map((user, index) => {
                                    const isSelected = formData.participantes_ids.includes(user.id);
                                    const initial = user.nombre.includes('(')
                                        ? user.nombre.split('(')[1].charAt(0).toUpperCase()
                                        : user.nombre.charAt(0).toUpperCase();

                                    return (
                                        <motion.div
                                            key={user.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => toggleParticipante(user.id)}
                                            className={cn(
                                                "group flex items-center justify-between p-5 rounded-[2rem] border transition-all cursor-pointer active:scale-[0.98]",
                                                isSelected
                                                    ? "bg-[var(--bg-card)] border-[var(--primary)] shadow-xl shadow-[var(--primary)]/5"
                                                    : "bg-transparent border-[var(--border-color)] opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                                            )}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500",
                                                    isSelected ? "bg-[var(--primary)] text-white rotate-0" : "bg-slate-100 dark:bg-slate-800 text-slate-400 rotate-12"
                                                )}>
                                                    {initial}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("font-bold text-base transition-colors", isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}>
                                                        {user.nombre}
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Participante</span>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                                                isSelected
                                                    ? "bg-[var(--primary)] border-[var(--primary)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                                                    : "border-[var(--border-color)] group-hover:border-[var(--primary)]/50"
                                            )}>
                                                {isSelected && <Check size={16} className="text-white stroke-[4] animate-in zoom-in duration-300" />}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* --- ACCIÓN FINAL --- */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="pt-6"
                    >
                        <button
                            className="w-full h-20 bg-[var(--primary)] text-white rounded-[2rem] shadow-2xl shadow-[var(--primary)]/30 flex items-center justify-center gap-4 active:scale-[0.97] transition-all disabled:opacity-30 disabled:grayscale overflow-hidden relative group"
                            onClick={handleSubmit}
                            disabled={loading || formData.participantes_ids.length === 0 || !formData.precio || !formData.nombre}
                        >
                            {/* Brillo al pasar el mouse */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            
                            {loading ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white" />
                            ) : (
                                <Check size={28} className="stroke-[3]" />
                            )}
                            <span className="uppercase tracking-[0.2em] font-black text-sm">
                                {loading ? 'Registrando...' : 'Confirmar Gasto'}
                            </span>
                        </button>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};
