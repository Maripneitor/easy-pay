import React, { useState, useEffect } from 'react';
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
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { AddMemberModal } from './components/AddMemberModal';
import { useMyPayments } from '../MyPayments/useMyPayments';
import { AddCardModal } from '../MyPayments/components/AddCardModal';
import { groupRepository } from '../../../infrastructure/api/repositories';

import { TwoFactorModal } from '../../components/Security/TwoFactorModal';
import { EditGroupModal } from '../Groups/components/EditGroupModal';


export const GroupDetail = () => {
    const params = useParams();
    const idFinal = params.groupId || params.group_id || params.id || "";
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const navigate = useNavigate();

    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    const [isEditingGroupOpen, setIsEditingGroupOpen] = useState(false);

    // Register shortcuts (Esc to close wizard)
    useKeyboardShortcuts(() => setIsWizardOpen(false));

    const {
        activeTab, setActiveTab, groupName, groupDescription, groupCode, totalSpent,
        userShare, userOwed, activities, balances, members,
        integrantes_data, isFetchingGroup, adminId, currentUserId,
        isRefreshing, refresh, removeMember,
        deleteGroup, confirmDeleteGroup, deleteItem,
        is2FAModalOpen, setIs2FAModalOpen
    } = useGroupDetail(idFinal);

    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const { 
        cards, loading: isFetchingCards, refreshCards, 
        handleDeleteCard, isAddingCard: isAddCardOpen, 
        setIsAddingCard: setIsAddCardOpen 
    } = useMyPayments();
    


    const isAdmin = adminId === currentUserId;
    useDocumentTitle(groupName ? `${groupName} - Detalle` : 'Detalle de Grupo');

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

    if (isFetchingGroup) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando grupo...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <PageHeader 
                title={groupName || "Detalle de Grupo"}
                onMenuClick={toggleSidebar}
                onBack={() => navigate('/groups')}
                rightSlot={
                    <div className="flex gap-2">
                        {isAdmin && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsEditingGroupOpen(true)}
                                    className="p-2.5 bg-white/10 hover:bg-blue-500/10 border border-white/20 rounded-xl transition-all text-blue-400"
                                    title="Editar Grupo"
                                >
                                    <Pencil size={20} />
                                </button>
                                <button 
                                    onClick={deleteGroup}
                                    className="p-2.5 bg-white/10 hover:bg-rose-500/10 border border-white/20 rounded-xl transition-all text-rose-400"
                                    title="Eliminar Grupo"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )}
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
                            <p className="text-2xl font-black tracking-tighter text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">${Number(stat.value || 0).toFixed(2)}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Section */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] overflow-hidden shadow-sm">
                <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
                    {['actividades', 'saldos', 'integrantes', 'pagos'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "flex-1 min-w-[120px] py-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
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
                                     <div className="flex items-center gap-3">
                                         <button 
                                             onClick={handleExportPDF}
                                             className="p-4 bg-white border border-[var(--border-color)] text-blue-500 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all shadow-sm"
                                             title="Exportar PDF"
                                         >
                                             <Download size={22} />
                                         </button>
                                         <button 
                                             onClick={() => navigate(`/group/${idFinal}/register-expense`)}
                                             className="group flex items-center gap-3 px-8 py-4 bg-[var(--primary)] text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-[var(--primary)]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                         >
                                             <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                                                <Plus size={18} />
                                             </div>
                                             Nuevo Gasto
                                         </button>
                                         <button 
                                             onClick={() => navigate('/ocr-scanner')}
                                             className="p-4 bg-white border border-[var(--border-color)] text-[var(--text-secondary)] rounded-2xl hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all shadow-sm"
                                             title="Escanear Ticket"
                                         >
                                             <Receipt size={22} />
                                         </button>
                                     </div>
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
                                                              <span className="font-black text-lg font-mono tracking-tighter text-[var(--text-primary)]">${Number(act.monto || act.precio || 0).toFixed(2)}</span>
                                                          </td>
                                                         <td className="py-6 border-y border-[var(--border-color)] group-hover:border-[var(--primary)]/30">
                                                             <span className="text-xs font-bold text-slate-400 uppercase">{act.fecha}</span>
                                                         </td>
                                                         <td className="py-6 pr-6 rounded-r-[2rem] border-y border-r border-[var(--border-color)] group-hover:border-[var(--primary)]/30 text-right">
                                                                 <div className="flex justify-end gap-2">
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            e.preventDefault();
                                                                            navigate(`/group/${idFinal}/edit-item/${act.id}`);
                                                                        }}
                                                                        className="p-2 hover:bg-blue-500/10 rounded-xl text-blue-400 hover:text-blue-500 transition-all"
                                                                        title="Editar"
                                                                    >
                                                                        <Pencil size={18} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            e.preventDefault();
                                                                            if (window.confirm("¿Eliminar este gasto?")) {
                                                                                deleteItem(act.id);
                                                                            }
                                                                        }}
                                                                        className="p-2 hover:bg-rose-500/10 rounded-xl text-rose-400 hover:text-rose-500 transition-all"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                    <button className="p-2 hover:bg-[var(--primary)]/10 rounded-xl text-slate-400 hover:text-[var(--primary)] transition-all">
                                                                        <Info size={18} />
                                                                    </button>
                                                                 </div>
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
                                        <Check size={18} /> Liquidar Grupo
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Array.isArray(balances) && balances.map((balance, i) => (
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
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <span className={cn(
                                                        "text-xl font-black font-mono tracking-tighter block",
                                                        balance.monto >= 0 ? "text-emerald-500" : "text-rose-500"
                                                    )}>
                                                        {balance.monto >= 0 ? "+" : ""}${Math.abs(Number(balance.monto || 0)).toFixed(2)}
                                                    </span>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{balance.monto >= 0 ? "Saldo a favor" : "Deuda pendiente"}</p>
                                                </div>
                                                {balance.monto < 0 && (
                                                    <button 
                                                        onClick={() => navigate(`/group/${idFinal}/settle-up`)}
                                                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 hover:scale-105 active:scale-95 transition-all"
                                                    >
                                                        Pagar
                                                    </button>
                                                )}
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
                                        <h3 className="text-lg font-black uppercase tracking-tight">Miembros del Grupo</h3>
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
                                                <div className="flex-1">
                                                    <p className="font-black text-[var(--text-primary)] uppercase tracking-tight text-sm">{member.nombre}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{member.id === currentUserId ? "Tú" : (member.id === adminId ? "Organizador" : "Miembro")}</p>
                                                </div>
                                                
                                                {isAdmin && member.id !== currentUserId && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm(`¿Estás seguro de eliminar a ${member.nombre}?`)) {
                                                                removeMember(member.id);
                                                            }
                                                        }}
                                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                        title="Eliminar Miembro"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                    
                                    {isAdmin && (
                                        <button 
                                            onClick={() => setIsAddMemberOpen(true)}
                                            className="p-5 border-2 border-dashed border-[var(--border-color)] rounded-3xl flex items-center justify-center gap-3 text-slate-400 hover:border-[var(--primary)]/30 hover:text-[var(--primary)] transition-all group"
                                        >
                                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                            <span className="text-xs font-black uppercase tracking-widest">Agregar</span>
                                        </button>
                                    )}
                                </div>

                                {isAdmin && (
                                    <div className="mt-12 pt-8 border-t border-rose-500/10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 mb-6 px-2">Zona de Peligro</h4>
                                        <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div>
                                                <p className="font-black text-rose-500 uppercase tracking-tight">Eliminar permanentemente este grupo</p>
                                                <p className="text-[10px] font-black text-rose-500/60 uppercase tracking-widest mt-1">Esta acción no se puede deshacer y borrará todos los datos.</p>
                                            </div>
                                            <button 
                                                onClick={deleteGroup}
                                                className="w-full md:w-auto px-8 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Eliminar Grupo
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                        {activeTab === 'pagos' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-8"
                            >
                                <div className="flex justify-between items-center px-2">
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight">Métodos de Pago</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gestiona tus tarjetas para liquidar deudas</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsAddCardOpen(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Plus size={18} /> Nueva Tarjeta
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {isFetchingCards ? (
                                        [1, 2].map(i => (
                                            <div key={i} className="h-48 rounded-3xl bg-[var(--bg-body)] border border-[var(--border-color)] animate-pulse" />
                                        ))
                                    ) : cards.length > 0 ? (
                                        cards.map((card: any) => (
                                            <motion.div 
                                                key={card.id}
                                                layout
                                                whileHover={{ scale: 1.02, translateY: -8, rotateX: 2, rotateY: -2 }}
                                                className={cn(
                                                    "p-8 rounded-[2rem] border border-white/20 transition-all relative overflow-hidden group/card shadow-xl hover:shadow-[var(--primary)]/30 preserve-3d perspective-1000",
                                                    card.bankStyle || "bg-gradient-to-br from-slate-800 to-slate-900"
                                                )}
                                            >
                                                {/* Premium Texture Overlay */}
                                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                                
                                                {/* Animated Gloss Effect */}
                                                <div className="absolute inset-0 translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg]" />

                                                <div className="relative z-10 flex flex-col justify-between h-44 text-white">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex flex-col">
                                                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-1 drop-shadow-sm">{card.bankName || 'PLATINO GLOBAL'}</div>
                                                            <div className="w-12 h-9 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 rounded-lg border border-white/30 flex items-center justify-center p-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
                                                                <div className="w-full h-full bg-black/10 rounded-sm grid grid-cols-4 gap-0.5 opacity-50">
                                                                    {[...Array(8)].map((_, i) => <div key={i} className="border-r border-b border-white/10"></div>)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if(window.confirm("¿Eliminar esta tarjeta?")) handleDeleteCard(card.id);
                                                            }}
                                                            className="p-3 bg-white/10 hover:bg-rose-500 border border-white/10 rounded-2xl transition-all opacity-0 group-hover/card:opacity-100 shadow-xl backdrop-blur-md"
                                                            title="Eliminar Tarjeta"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="space-y-6">
                                                        <div className="text-2xl font-mono tracking-[0.25em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white/95 filter contrast-125">
                                                            •••• •••• •••• {card.lastFour}
                                                        </div>
    
                                                        <div className="flex justify-between items-end">
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50">TITULAR</p>
                                                                <p className="text-sm font-black uppercase tracking-widest truncate max-w-[200px] text-white/90 drop-shadow-sm">{card.holder}</p>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <div className="h-10 flex items-center">
                                                                    {card.brand?.toUpperCase() === 'VISA' && <span className="text-3xl font-black italic tracking-tighter text-white opacity-90 drop-shadow-lg">VISA</span>}
                                                                    {card.brand?.toUpperCase() === 'MASTERCARD' && (
                                                                        <div className="flex -space-x-3">
                                                                            <div className="w-8 h-8 rounded-full bg-rose-500/80 mix-blend-screen" />
                                                                            <div className="w-8 h-8 rounded-full bg-amber-500/80 mix-blend-screen" />
                                                                        </div>
                                                                    )}
                                                                    {card.brand?.toUpperCase() === 'AMEX' && <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded text-xs font-black italic">AMEX</div>}
                                                                    {!['VISA', 'MASTERCARD', 'AMEX'].includes(card.brand?.toUpperCase()) && <span className="text-lg font-black uppercase tracking-widest text-white/70">{card.brand}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 bg-black/5 border-2 border-dashed border-[var(--border-color)] rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center text-slate-400">
                                                <CreditCard size={32} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">No tienes tarjetas guardadas</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Agrega una para liquidar tus deudas fácilmente</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AddMemberModal 
                    isOpen={isAddMemberOpen}
                    onClose={() => setIsAddMemberOpen(false)}
                    groupId={idFinal}
                    onSuccess={() => {
                        refresh();
                    }}
                    existingMemberIds={members.map((m: any) => m.id)}
                />

                <SettlementWizard 
                    isOpen={isWizardOpen}
                    onClose={() => setIsWizardOpen(false)}
                    groupId={idFinal}
                    activities={activities}
                    members={members}
                    totalSpent={totalSpent}
                    integrantesData={integrantes_data}
                />

                <TransactionDetailModal 
                    isOpen={!!selectedExpense}
                    onClose={() => setSelectedExpense(null)}
                    transaction={selectedExpense}
                    members={integrantes_data}
                />

                <AddCardModal 
                    isOpen={isAddCardOpen}
                    onClose={() => setIsAddCardOpen(false)}
                    onSuccess={refreshCards}
                    currentCardsCount={cards.length}
                />

                <EditGroupModal 
                    isOpen={isEditingGroupOpen}
                    onClose={() => setIsEditingGroupOpen(false)}
                    group={{ id: idFinal, nombre: groupName, descripcion: groupDescription }}
                    onSuccess={refresh}
                />

                <TwoFactorModal
                    isOpen={is2FAModalOpen}
                    onClose={() => setIs2FAModalOpen(false)}
                    onVerified={async () => {
                        const success = await confirmDeleteGroup();
                        if (success) navigate('/groups');
                    }}
                    userId={currentUserId || ''}
                    actionTitle="Eliminar Grupo"
                    actionDescription="Esta acción es irreversible y eliminará todos los gastos y saldos asociados. Por favor verifica tu identidad."
                />
            </div>
        </div>
    );
};