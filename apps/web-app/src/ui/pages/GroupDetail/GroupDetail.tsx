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
        integrantes_data, isFetchingGroup, adminId, currentUserId,
        isRefreshing, refresh, removeMember
    } = useGroupDetail(idFinal);

    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [newItem, setNewItem] = useState({ nombre: '', precio: '', participantes: [] as string[] });
    const [isSavingItem, setIsSavingItem] = useState(false);

    // Sync participants when members change or tab opens
    useEffect(() => {
        if (activeTab === 'asignación' && newItem.participantes.length === 0 && members.length > 0) {
            setNewItem(prev => ({ ...prev, participantes: members.map((m: any) => m.id) }));
        }
    }, [activeTab, members]);

    const handleSaveItem = async () => {
        if (!newItem.nombre || !newItem.precio || newItem.participantes.length === 0) {
            toast.error("Rellena todos los campos y selecciona al menos un participante");
            return;
        }

        setIsSavingItem(true);
        try {
            await httpClient.post('/groups/add-item', {
                group_id: idFinal,
                nombre: newItem.nombre,
                precio: parseFloat(newItem.precio),
                cantidad: 1,
                comprador_id: currentUserId,
                participantes_ids: newItem.participantes
            });
            toast.success("Ítem asignado correctamente");
            setNewItem({ nombre: '', precio: '', participantes: members.map((m: any) => m.id) });
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Error al guardar ítem");
        } finally {
            setIsSavingItem(false);
        }
    };

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
                            <p className="text-2xl font-black tracking-tighter text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">${Number(stat.value || 0).toFixed(2)}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Section */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] overflow-hidden shadow-sm">
                <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
                    {['actividades', 'asignación', 'saldos', 'integrantes'].map((tab) => (
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
                                    <div className="flex gap-2">
                                         <button 
                                             onClick={() => navigate(`/group/${idFinal}/register-expense`)}
                                             className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-105 active:scale-95 transition-all"
                                         >
                                             <Plus size={18} /> Nuevo Gasto
                                         </button>
                                         <button 
                                             onClick={() => navigate(`/group/${idFinal}/register-expense`)}
                                             className="flex items-center gap-2 px-4 py-3 bg-white border border-[var(--border-color)] text-[var(--text-secondary)] rounded-2xl text-xs font-black uppercase tracking-widest hover:border-[var(--primary)] transition-all"
                                             title="Escanear Ticket"
                                         >
                                             <Receipt size={18} />
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
                                                                        navigate(`/group/${idFinal}/edit-item/${act.id}`);
                                                                    }}
                                                                    className="p-2 hover:bg-blue-500/10 rounded-xl text-blue-400 hover:text-blue-500 transition-all"
                                                                    title="Editar"
                                                                >
                                                                    <Pencil size={18} />
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

                        {activeTab === 'asignación' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-2xl mx-auto space-y-10 py-4"
                            >
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Nueva Asignación</h3>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Crea un gasto y divídelo al instante</p>
                                </div>

                                <div className="space-y-6 bg-[var(--bg-body)] p-8 rounded-[2.5rem] border border-[var(--border-color)] shadow-inner">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nombre del Ítem</label>
                                            <input 
                                                type="text"
                                                placeholder="Ej. Pizza Familiar"
                                                value={newItem.nombre}
                                                onChange={(e) => setNewItem({...newItem, nombre: e.target.value})}
                                                className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--primary)]/30 rounded-2xl outline-none font-bold transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Precio ($)</label>
                                            <input 
                                                type="number"
                                                placeholder="0.00"
                                                value={newItem.precio}
                                                onChange={(e) => setNewItem({...newItem, precio: e.target.value})}
                                                className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[var(--primary)]/30 rounded-2xl outline-none font-bold transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">¿Quiénes comparten este gasto?</label>
                                        <div className="flex flex-wrap gap-3">
                                            {members.map((member) => {
                                                const isSelected = newItem.participantes.includes(member.id);
                                                return (
                                                    <button
                                                        key={member.id}
                                                        onClick={() => {
                                                            const ids = isSelected 
                                                                ? newItem.participantes.filter(id => id !== member.id)
                                                                : [...newItem.participantes, member.id];
                                                            setNewItem({...newItem, participantes: ids});
                                                        }}
                                                        className={cn(
                                                            "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                                                            isSelected 
                                                                ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                                                : "bg-white border-[var(--border-color)] text-slate-400 hover:border-slate-300"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-full flex items-center justify-center text-[8px]",
                                                            isSelected ? "bg-white/20" : "bg-slate-100"
                                                        )}>
                                                            {member.nombre.charAt(0)}
                                                        </div>
                                                        {member.nombre}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleSaveItem}
                                        disabled={isSavingItem || !newItem.nombre || !newItem.precio || newItem.participantes.length === 0}
                                        className="w-full py-5 bg-[var(--primary)] text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
                                    >
                                        {isSavingItem ? "Guardando..." : "Guardar Ítem"}
                                    </button>
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
                />
            </div>
        </div>
    );
};