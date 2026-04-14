import React from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import {
    DollarSign,
    MoreHorizontal,
    Check,
    User,
    Users,
    ChevronDown
} from 'lucide-react';
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

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-body)] font-display text-[var(--text-primary)] antialiased">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="Registrar Gasto"
                    onBack={() => navigate(-1)}
                    rightSlot={
                        <button
                            className="text-[var(--primary)] font-bold text-sm uppercase tracking-widest disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? '...' : 'Guardar'}
                        </button>
                    }
                />

                <main className="flex-1 w-full max-w-xl mx-auto px-6 py-6 space-y-8">
                    {/* Monto */}
                    <div className="flex flex-col items-center justify-center py-4">
                        <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-[0.2em] opacity-60">Monto total</p>
                        <div className="relative flex items-center">
                            <DollarSign size={40} className="text-[var(--primary)] absolute -left-10 top-1/2 -translate-y-1/2 opacity-50" />
                            <input
                                type="number"
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                placeholder="0.00"
                                className="bg-transparent text-6xl font-black text-[var(--text-primary)] text-center w-full focus:outline-none"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Formulario Principal */}
                    <div className="bg-[var(--bg-card)] rounded-3xl p-5 shadow-xl border border-[var(--border-color)] space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border-color)]">
                                <MoreHorizontal size={22} />
                            </div>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="¿Qué se compró?"
                                className="flex-1 bg-transparent text-xl font-bold placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>

                        <div className="h-px bg-[var(--border-color)] opacity-50"></div>

                        {/* Comprador (Combo Box) */}
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border-color)]">
                                <User size={22} />
                            </div>
                            <div className="flex-1 relative">
                                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-0.5">Pagado por</p>
                                <select
                                    value={formData.comprador_id}
                                    onChange={(e) => setFormData({ ...formData, comprador_id: e.target.value })}
                                    className="w-full bg-transparent text-lg font-bold text-[var(--text-primary)] focus:outline-none appearance-none cursor-pointer pr-8"
                                >
                                    {integrantes.map(user => (
                                        <option key={user.id} value={user.id} className="text-black">
                                            {user.nombre}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-0 bottom-1 pointer-events-none opacity-40" />
                            </div>
                        </div>
                    </div>

                    {/* Participantes */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
                                <Users size={16} /> Se divide entre
                            </h3>
                            <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                                {formData.participantes_ids.length} personas
                            </span>
                        </div>

                        <div className="grid gap-3">
                            {integrantes.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => toggleParticipante(user.id)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                                        formData.participantes_ids.includes(user.id)
                                            ? "bg-[var(--bg-card)] border-[var(--primary)] shadow-md"
                                            : "bg-transparent border-[var(--border-color)] opacity-60"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-black text-xs">
                                            {user.nombre.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-sm">{user.nombre}</span>
                                    </div>
                                    <div className={cn(
                                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                        formData.participantes_ids.includes(user.id)
                                            ? "bg-[var(--primary)] border-[var(--primary)]"
                                            : "border-[var(--border-color)]"
                                    )}>
                                        {formData.participantes_ids.includes(user.id) && <Check size={14} className="text-white stroke-[4]" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botón Final */}
                    <div className="pt-4">
                        <button
                            className="w-full bg-[var(--primary)] text-white font-black py-5 rounded-2xl shadow-xl shadow-[var(--primary)]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={loading || !formData.comprador_id || formData.participantes_ids.length === 0}
                        >
                            <Check size={24} />
                            <span className="uppercase tracking-widest text-sm">Confirmar y Guardar</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};