import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderOpen,
    Sparkles,
    ReceiptText,
    Smartphone,
    AlertTriangle,
    UserPlus,
    Users,
    CheckCircle,
    Loader2,
} from 'lucide-react';
import { cn } from '../../../infrastructure/utils';
import { StatusBadge } from '../../components/StatusBadge';
import { PageHeader } from '@ui/components/PageHeader';
import { useOCRScanner } from './useOCRScanner';
import styles from './OCRScanner.module.css';

interface OCRItem {
    id?: string;
    description: string;
    amount: number;
    isUnassigned?: boolean;
}

/* ─── UploadZone component ─── */
const UploadZone: React.FC<{ isProcessing: boolean; onUpload: () => void }> = ({ isProcessing, onUpload }) => (
    <div className={cn(styles.glassPanel, 'relative flex-grow rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border-[var(--border-color)] flex flex-col min-h-[400px]')}>
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)' }} />
        
        <div className="relative flex-grow flex flex-col items-center justify-center p-12 text-center">
            {isProcessing ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-[var(--primary)] rounded-full blur-2xl opacity-20 animate-pulse" />
                        <Loader2 size={64} className="text-[var(--primary)] animate-spin relative z-10" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Analizando Ticket</h3>
                    <p className="text-[var(--text-secondary)] font-medium">Extrayendo datos con IA...</p>
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-xl">
                        <FolderOpen size={40} className="text-[var(--primary)]" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Sube tu Ticket</h3>
                    <p className="text-[var(--text-secondary)] max-w-sm mb-10 font-medium">
                        Arrastra tus archivos aquí o haz clic para seleccionar. Soportamos JPG, PNG y PDF.
                    </p>
                    <button 
                        onClick={onUpload}
                        className="group relative px-10 py-4 bg-[var(--primary)] hover:opacity-90 rounded-2xl transition-all shadow-glow active:scale-95"
                    >
                        <div className="flex items-center gap-3">
                            <ReceiptText size={20} className="text-white" />
                            <span className="text-white font-black uppercase tracking-widest text-sm">Seleccionar Archivo</span>
                        </div>
                    </button>
                </motion.div>
            )}
        </div>

        <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OCR Local</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronización Cloud</span>
            </div>
        </div>
    </div>
);

/* ─── Main Page Component ─── */
export const OCRScanner: React.FC = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const {
        scanResult,
        isProcessing,
        handleGallery,
        handleSplitAll,
        handleAssignToMe,
        handleConfirmSync,
        formatCurrency,
    } = useOCRScanner();

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-body)] text-[var(--text-primary)] antialiased selection:bg-[var(--primary)] selection:text-white transition-colors duration-300">
            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="SUBIR TICKETS"
                    subtitle="Easy-Pay"
                    onBack={() => navigate(-1)}
                    showAvatar={false} 
                    showNotification
                />

                <main className="flex-grow flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 relative w-full max-w-7xl mx-auto gap-6">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute top-[-10%] left-[20%] w-[30%] h-[30%] bg-[var(--primary)]/5 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="w-full flex flex-col gap-6">
                        <UploadZone isProcessing={isProcessing} onUpload={handleGallery} />
                    </div>

                    <div className={cn(styles.glassPanel, 'w-full rounded-2xl shadow-glass flex flex-col overflow-hidden mt-2 bg-[var(--bg-card)] border border-[var(--border-color)]')}>
                        <div className="p-4 sm:px-6 border-b border-[var(--border-color)] flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-2">
                                <Sparkles size={20} className="text-[var(--primary)]" />
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Análisis del Ticket</h3>
                            </div>
                            <StatusBadge label={`OCR Confianza: ${scanResult.confidence}%`} variant="success" />
                        </div>

                        <div className="flex flex-col md:flex-row h-full">
                            <div className="w-full md:w-1/2 border-r border-[var(--border-color)] p-4 sm:p-6 bg-black/5">
                                <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <ReceiptText size={16} /> Detectado (OCR)
                                </h4>
                                <div className="space-y-3 font-mono text-sm">
                                    {scanResult.detectedItems.map((item: OCRItem) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                'flex justify-between items-center p-2 rounded transition',
                                                item.isUnassigned
                                                    ? 'bg-amber-500/10 border border-amber-500/30'
                                                    : 'hover:bg-white/5 border-b border-dashed border-[var(--border-color)]',
                                            )}
                                        >
                                            <span className={item.isUnassigned ? 'text-amber-200' : 'text-[var(--text-secondary)]'}>{item.description}</span>
                                            <span className={cn('font-bold', item.isUnassigned ? 'text-amber-200' : 'text-[var(--text-primary)]')}>
                                                {formatCurrency(item.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 p-4 sm:p-6 bg-[var(--hover-bg)] relative">
                                <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Smartphone size={16} /> En la App (Cuenta)
                                </h4>
                                <div className="space-y-3 mb-6 opacity-60">
                                    {scanResult.appItems.map((item: OCRItem, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-[var(--text-secondary)]">{item.description}</span>
                                            <span className="text-[var(--text-primary)]">{formatCurrency(item.amount)}</span>
                                        </div>
                                    ))}
                                </div>

                                {scanResult.unassignedItems.map((item: OCRItem) => (
                                    <div
                                        key={item.id}
                                        className={cn(styles.glassPanel, 'bg-amber-900/10 border-l-4 border-l-red-500 border-y border-r border-red-500/30 rounded-r-lg p-4 mb-4 shadow-lg animate-pulse-slow')}
                                    >
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle size={20} className="text-amber-500 mt-0.5" />
                                            <div className="flex-grow">
                                                <h5 className="text-amber-100 font-bold text-sm mb-1">Item no asignado detectado</h5>
                                                <p className="text-[var(--text-secondary)] text-xs mb-3 font-medium">
                                                    <span className="text-[var(--text-primary)] font-mono font-bold">{item.description} ({formatCurrency(item.amount)})</span> aparece en el ticket pero nadie lo reclamó en la app.
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSplitAll(item)}
                                                        className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-xs px-3 py-1.5 rounded transition border border-[var(--border-color)]"
                                                    >
                                                        <Users size={14} /> Dividir entre todos
                                                    </button>
                                                    <button
                                                        onClick={() => handleAssignToMe(item)}
                                                        className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white text-xs px-3 py-1.5 rounded transition shadow"
                                                    >
                                                        <UserPlus size={14} /> Asignar a mí
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[var(--bg-card)] p-4 sm:px-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-6 w-full sm:w-auto justify-center sm:justify-start">
                                <div className="text-center sm:text-left">
                                    <span className="block text-xs text-[var(--text-secondary)] uppercase font-bold">Total Ticket</span>
                                    <span className="block text-xl font-mono text-[var(--text-primary)]">{formatCurrency(scanResult.ticketTotal)}</span>
                                </div>
                                <div className="h-8 w-px bg-[var(--border-color)]" />
                                <div className="text-center sm:text-left">
                                    <span className="block text-xs text-[var(--text-secondary)] uppercase font-bold">Total App</span>
                                    <span className="block text-xl font-mono text-red-500">{formatCurrency(scanResult.appTotal)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleConfirmSync}
                                className="w-full sm:w-auto flex-grow sm:flex-grow-0 py-3 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} /> Confirmar y Sincronizar
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="py-6 text-center text-[var(--text-secondary)] text-sm">
                    <p>© 2026 Easy-Pay Technology. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};