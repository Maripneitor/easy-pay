import React, { useState } from 'react';
import { 
    Settings, Plus, Receipt, UserCircle, ArrowRight, 
    CreditCard, Pencil, Trash2, Users, Download, 
    PieChart, Activity, Info, Scan, Utensils, Car, Gamepad2, ShoppingBag, Briefcase,
    X,
    Check
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../infrastructure/utils';
import { useGroupDetail } from './useGroupDetail';
import { PageHeader } from '@ui/components/PageHeader';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { httpClient } from '../../../infrastructure/api/http-client';
import { SettlementWizard } from './components/SettlementWizard';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { TransactionDetailModal } from '../MyPayments/components/TransactionDetailModal';

export const GroupDetail = () => {
    const params = useParams();
    const idFinal = params.groupId || params.group_id || params.id || "";
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const navigate = useNavigate();

    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);

    // Register shortcuts (Esc to close wizard)
    useKeyboardShortcuts(() => setIsWizardOpen(false));

    const {
        activeTab, setActiveTab, groupName, groupCode, totalSpent,
        userShare, userOwed, activities, balances, members,
        integrantes_data, loading, adminId, currentUserId,
        isRefreshing
    } = useGroupDetail(idFinal);

    const isAdmin = adminId === currentUserId;

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();

        doc.setFontSize(22);
        doc.setTextColor(59, 130, 246);
        doc.text("EASY-PAY", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Reporte de Gastos: ${groupName}`, 14, 30);
        doc.text(`Fecha: ${date}`, 14, 35);
        doc.text(`Código: ${groupCode}`, 14, 40);

        const tableData = activities.map(act => [
            act.nombre,
            integrantes_data.find(i => i.id === act.comprador_id)?.nombre || "N/A",
            `$${Number(act.monto).toFixed(2)}`,
            act.fecha
        ]);

        (doc as any).autoTable({
            head: [['Gasto', 'Pagado por', 'Monto', 'Fecha']],
            body: tableData,
            startY: 50,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] }
        });

        doc.save(`EasyPay_${groupName}_${date}.pdf`);
        toast.success("PDF generado correctamente");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando mesa...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <PageHeader 
                title={groupName || "Detalle de Grupo"}
                onMenuClick={toggleSidebar}
                rightSlot={
                    <div className="flex gap-2">
                        <button 
                            onClick={handleExportPDF}
                            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-[var(--text-primary)]"
                            title="Exportar PDF"
                        >
                            <Download size={20} />
                        </button>
                        <button 
                            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-[var(--text-primary)]"
                            title="Ajustes"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                }
            />

            {/* Stats Cards (Mini) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Gastado", value: totalSpent, icon: <Receipt size={20}/>, color: "var(--primary)" },
                    { label: "Tu Parte", value: userShare, icon: <UserCircle size={20}/>, color: "#10b981" },
                    { label: "Te Deben", value: userOwed, icon: <PieChart size={20}/>, color: "#f59e0b" },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] flex items-center gap-6 shadow-sm group hover:border-[var(--primary)]/30 transition-all"
                    >
                        <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                            <p className="text-2xl font-black tracking-tighter text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">${Number(stat.value).toFixed(2)}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Section */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] overflow-hidden shadow-sm">
                <div className="flex border-b border-[var(--border-color)]">
                    {['actividades', 'saldos', 'integrantes'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
                                activeTab === tab ? "text-[var(--primary)]" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary)] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'actividades' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center px-2">
                                    <h3 className="text-lg font-black uppercase tracking-tight">Registro de Gastos</h3>
                                    <button 
                                        onClick={() => navigate(`/add-expense/${idFinal}`)}
                                        className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Plus size={18} /> Nuevo Gasto
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-separate border-spacing-y-3">
                                        <thead>
                                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                                                <th className="pb-4 pl-6">Concepto</th>
                                                <th className="pb-4">Pagado por</th>
                                                <th className="pb-4">Monto</th>
                                                <th className="pb-4">Fecha</th>
                                                <th className="pb-4 pr-6 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activities.map((act) => {
                                                const comprador = integrantes_data.find(i => i.id === act.comprador_id);
                                                const category = act.categoria || "Otros";
                                                const categoryStyles: any = {
                                                    "Comida": "bg-orange-100 text-orange-600 border-orange-200",
                                                    "Transporte": "bg-blue-100 text-blue-600 border-blue-200",
                                                    "Entretenimiento": "bg-purple-100 text-purple-600 border-purple-200",
                                                    "Otros": "bg-slate-100 text-slate-600 border-slate-200"
                                                };
                                                
                                                return (
                                                    <tr 
                                                        key={act.id} 
                                                        onClick={() => setSelectedExpense(act)}
                                                        className="group bg-[var(--bg-body)] hover:bg-[var(--hover-bg)] transition-all cursor-pointer shadow-sm hover:shadow-md"
                                                    >
                                                        <td className="py-6 pl-6 rounded-l-[2rem] border-y border-l border-[var(--border-color)] group-hover:border-[var(--primary)]/30">
                                                            <div className="flex items-center gap-4">
                                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110", categoryStyles[category] || categoryStyles["Otros"])}>
                                                                    {category === "Comida" && <Utensils size={20} />}
                                                                    {category === "Transporte" && <Car size={20} />}
                                                                    {category === "Entretenimiento" && <Gamepad2 size={20} />}
                                                                    {category === "Otros" && <ShoppingBag size={20} />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-[var(--primary)] transition-colors">{act.nombre}</p>
                                                                    <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-md border tracking-widest", categoryStyles[category] || categoryStyles["Otros"])}>
                                                                        {category}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 border-y border-[var(--border-color)] group-hover:border-[var(--primary)]/30">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black">
                                                                    {comprador?.nombre?.charAt(0) || "U"}
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-500 uppercase">{comprador?.nombre || "Usuario"}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 border-y border-[var(--border-color)] group-hover:border-[var(--primary)]/30">
                                                            <span className="font-black text-lg font-mono tracking-tighter text-[var(--text-primary)]">${Number(act.monto).toFixed(2)}</span>
                                                        </td>
                                                        <td className="py-6 border-y border-[var(--border-color)] group-hover:border-[var(--primary)]/30">
                                                            <span className="text-xs font-bold text-slate-400 uppercase">{act.fecha}</span>
                                                        </td>
                                                        <td className="py-6 pr-6 rounded-r-[2rem] border-y border-r border-[var(--border-color)] group-hover:border-[var(--primary)]/30 text-right">
                                                            <button className="p-2 hover:bg-[var(--primary)]/10 rounded-xl text-slate-400 hover:text-[var(--primary)] transition-all">
                                                                <Info size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'saldos' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-8"
                            >
                                <div className="flex justify-between items-center px-2">
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight">Balance de Cuentas</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cómo se dividen los gastos actualmente</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsWizardOpen(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Check size={18} /> Liquidar Mesa
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {balances.map((balance, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 bg-[var(--bg-body)] rounded-[2rem] border border-[var(--border-color)] flex items-center justify-between group hover:border-[var(--primary)]/30 transition-all shadow-sm"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-[var(--border-color)] shadow-sm text-[var(--primary)]">
                                                    <UserCircle size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[var(--text-primary)] uppercase tracking-tight">{balance.persona}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{balance.monto >= 0 ? "Saldo a favor" : "Deuda pendiente"}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={cn(
                                                    "text-xl font-black font-mono tracking-tighter",
                                                    balance.monto >= 0 ? "text-emerald-500" : "text-rose-500"
                                                )}>
                                                    {balance.monto >= 0 ? "+" : ""}${Math.abs(balance.monto).toFixed(2)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'integrantes' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-6 px-2"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight">Miembros de la Mesa</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{members.length} personas conectadas</p>
                                    </div>
                                    <div className="p-3 bg-black/5 rounded-2xl border border-black/5 text-[var(--text-primary)] font-mono text-xs font-black flex items-center gap-2">
                                        <Scan size={14} /> {groupCode}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {members.map((member, i) => {
                                        const fullMemberData = integrantes_data.find(it => it.id === member.id);
                                        return (
                                            <motion.div 
                                                key={member.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="p-5 bg-[var(--bg-body)] rounded-3xl border border-[var(--border-color)] flex items-center gap-4 group hover:border-[var(--primary)]/30 transition-all shadow-sm"
                                            >
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-black border-2 border-white shadow-sm">
                                                        {member.nombre.charAt(0)}
                                                    </div>
                                                    {member.id === adminId && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center" title="Admin">
                                                            <Settings size={10} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-[var(--text-primary)] uppercase tracking-tight text-sm">{member.nombre}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{member.id === currentUserId ? "Tú" : (member.id === adminId ? "Organizador" : "Miembro")}</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    
                                    <button className="p-5 border-2 border-dashed border-[var(--border-color)] rounded-3xl flex items-center justify-center gap-3 text-slate-400 hover:border-[var(--primary)]/30 hover:text-[var(--primary)] transition-all group">
                                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                        <span className="text-xs font-black uppercase tracking-widest">Invitar</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <SettlementWizard 
                    isOpen={isWizardOpen}
                    onClose={() => setIsWizardOpen(false)}
                    balances={balances}
                    members={members}
                    totalSpent={totalSpent}
                    integrantesData={integrantes_data}
                />

                <TransactionDetailModal 
                    isOpen={!!selectedExpense}
                    onClose={() => setSelectedExpense(null)}
                    transaction={selectedExpense}
                />
            </div>
        </div>
    );
};