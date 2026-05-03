import React, { useState } from 'react';
import { 
    CheckCircle2, 
    X, 
    ArrowRight, 
    ArrowLeft, 
    Zap, 
    Percent, 
    Calculator, 
    Table,
    AlertCircle,
    Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../../infrastructure/utils';
import { httpClient } from '../../../../infrastructure/api/http-client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { groupRepository } from '../../../../infrastructure/api/repositories';

interface SettlementWizardProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    activities: any[];
    members: any[];
    totalSpent: number;
    integrantesData: any[];
}

export const SettlementWizard: React.FC<SettlementWizardProps> = ({ 
    isOpen, onClose, groupId, activities, members, totalSpent, integrantesData 
}) => {
    const [step, setStep] = useState(1);
    const [tipPercentage, setTipPercentage] = useState(10);
    const [customTip, setCustomTip] = useState('');
    const [isClosing, setIsClosing] = useState(false);

    const safeActivities = activities || [];
    const safeIntegrantes = integrantesData || [];

    const unassignedItems = safeActivities.filter(item => 
        !item.nombres_participantes || item.nombres_participantes.length === 0
    );

    const tipAmount = tipPercentage === -1 ? Number(customTip) || 0 : (totalSpent * tipPercentage) / 100;
    const finalTotal = totalSpent + tipAmount;

    // --- CÁLCULO DE RESUMEN POR INTEGRANTE ---
    // Calcula la porción de cada miembro basándose en los gastos reales asignados
    const summary = safeIntegrantes.map(member => {
        const spent = safeActivities
            .filter(item => {
                const pIds = item.participantes_ids || [];
                return pIds.includes(member.id);
            })
            .reduce((acc, item) => {
                const amount = Number(item.monto || item.precio || 0);
                const participantsCount = Math.max((item.participantes_ids || []).length, 1);
                return acc + (amount / participantsCount);
            }, 0);
        
        const shareOfTip = tipAmount / (safeIntegrantes.length || 1);
        return {
            name: member.nombre || 'Usuario',
            subtotal: spent,
            tip: shareOfTip,
            total: spent + shareOfTip
        };
    });

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const queryClient = useQueryClient();

    const handleCloseTable = async () => {
        setIsClosing(true);
        try {
            await groupRepository.closeGroup(groupId, tipAmount, finalTotal);
            
            toast.success("Grupo cerrado correctamente");
            // Invalidate all related data
            queryClient.invalidateQueries({ queryKey: ['group', groupId] });
            queryClient.invalidateQueries({ queryKey: ['user-stats'] });
            queryClient.invalidateQueries({ queryKey: ['user-charts'] });
            
            onClose();
            // We keep the reload as fallback for now if the user isn't in a React Query context elsewhere
            setTimeout(() => window.location.reload(), 500);
        } catch (error) {
            toast.error("Error al cerrar el grupo");
        } finally {
            setIsClosing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter text-[var(--text-primary)]">Asistente de Liquidación</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paso {step} de 3</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-[var(--hover-bg)] rounded-xl transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-black/5">
                        <motion.div 
                            className="h-full bg-emerald-500"
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="flex flex-col items-center text-center mb-8">
                                    <div className="w-20 h-20 rounded-[2.5rem] bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Validación de Gastos</h3>
                                    <p className="text-sm text-[var(--text-secondary)] mt-2">Verificando que todos los consumos tengan un responsable.</p>
                                </div>

                                {unassignedItems.length > 0 ? (
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
                                        <AlertCircle className="text-amber-500 mt-0.5" size={24} />
                                        <div>
                                            <p className="text-amber-200 font-bold text-sm">Gastos sin asignar detectados</p>
                                            <p className="text-amber-200/60 text-xs mt-1">Hay {unassignedItems.length} items que no tienen dueños. Asígnelos antes de continuar para un cálculo preciso.</p>
                                            <div className="mt-4 space-y-2">
                                                {unassignedItems.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="flex justify-between items-center text-[10px] font-mono text-amber-200/80 bg-black/20 p-2 rounded-lg">
                                                        <span>{item.nombre}</span>
                                                        <span>${item.monto}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 flex flex-col items-center text-center">
                                        <CheckCircle2 className="text-emerald-500 mb-4" size={48} />
                                        <p className="text-emerald-500 font-black uppercase tracking-widest text-sm">¡Todo en Orden!</p>
                                        <p className="text-emerald-200/60 text-xs mt-2">Todos los {activities.length} gastos han sido asignados correctamente.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-[2.5rem] bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
                                        <Percent size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Gratificación / Propina</h3>
                                    <p className="text-sm text-[var(--text-secondary)] mt-2">Selecciona el porcentaje de propina para el servicio.</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[5, 10, 15, -1].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setTipPercentage(val)}
                                            className={cn(
                                                "py-6 rounded-2xl border-2 transition-all font-black text-xl",
                                                tipPercentage === val 
                                                    ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" 
                                                    : "bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50"
                                            )}
                                        >
                                            {val === -1 ? 'Otro' : `${val}%`}
                                        </button>
                                    ))}
                                </div>

                                {tipPercentage === -1 && (
                                    <div className="bg-[var(--bg-body)] border border-[var(--border-color)] rounded-2xl p-6">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monto Personalizado ($)</label>
                                        <input 
                                            type="number" 
                                            className="w-full bg-transparent border-none outline-none text-2xl font-black text-[var(--text-primary)]"
                                            placeholder="0.00"
                                            value={customTip}
                                            onChange={(e) => setCustomTip(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="bg-black/5 rounded-3xl p-8 space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest">Subtotal Consumo</span>
                                        <span className="text-[var(--text-primary)] font-black font-mono">${totalSpent.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest">Propina Calculada</span>
                                        <span className="text-emerald-500 font-black font-mono">+${tipAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-4 border-t border-dashed border-[var(--border-color)] flex justify-between items-center">
                                        <span className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Total Final</span>
                                        <span className="text-3xl font-black text-[var(--text-primary)] font-mono tracking-tighter">${finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Table size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">Resumen por Integrante</h3>
                                </div>

                                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-black/5">
                                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <th className="px-6 py-4">Integrante</th>
                                                <th className="px-6 py-4 text-right">Consumo</th>
                                                <th className="px-6 py-4 text-right">Propina</th>
                                                <th className="px-6 py-4 text-right text-[var(--primary)]">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-color)]">
                                            {summary.map((row, i) => (
                                                <tr key={i} className="text-xs font-bold text-[var(--text-secondary)]">
                                                    <td className="px-6 py-4 text-[var(--text-primary)] uppercase">{row.name}</td>
                                                    <td className="px-6 py-4 text-right font-mono">${row.subtotal.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-right font-mono text-emerald-500">${row.tip.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-right font-mono text-[var(--text-primary)] font-black">${row.total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex items-start gap-4">
                                    <Calculator size={20} className="text-blue-500 mt-1" />
                                    <p className="text-[10px] text-blue-400 font-medium leading-relaxed">
                                        Este resumen incluye el desglose exacto de lo que cada persona debe aportar para cubrir el total de la cuenta incluyendo la propina seleccionada. Al cerrar el grupo, se enviará una notificación a todos los integrantes.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer / Navigation */}
                    <div className="px-8 py-6 border-t border-[var(--border-color)] bg-black/5 flex justify-between items-center">
                        <button 
                            onClick={step === 1 ? onClose : handleBack}
                            className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[var(--text-primary)] transition-colors"
                        >
                            <ArrowLeft size={16} /> {step === 1 ? 'Cancelar' : 'Anterior'}
                        </button>

                        <button 
                            onClick={step === 3 ? handleCloseTable : handleNext}
                            disabled={(step === 1 && unassignedItems.length > 0) || isClosing}
                            className={cn(
                                "flex items-center gap-2 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95",
                                step === 3 
                                    ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500" 
                                    : "bg-[var(--primary)] text-white shadow-[var(--primary)]/20 hover:brightness-110 disabled:opacity-50 disabled:grayscale"
                            )}
                        >
                            {isClosing ? 'Procesando...' : step === 3 ? 'Cerrar Grupo Definitivamente' : 'Siguiente'}
                            {!isClosing && <ArrowRight size={16} />}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
