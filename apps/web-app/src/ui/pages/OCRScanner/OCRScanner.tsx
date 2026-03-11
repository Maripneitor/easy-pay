import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    FolderOpen,
    Camera,
    Crop,
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

/* ─── Viewfinder component ─── */

const Viewfinder: React.FC<{ flashOn: boolean; onFlashToggle: () => void; isProcessing: boolean }> = ({ flashOn, onFlashToggle, isProcessing }) => (
    <div className={cn(styles.glassPanel, 'relative flex-grow rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border-slate-700/50 flex flex-col')}>
        {/* Top overlay */}
        <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
            <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-cyan-400 animate-ping" : "bg-red-500 animate-pulse")} />
                <span className="text-xs font-mono text-white/90">
                    {isProcessing ? 'PROCESSING...' : 'LIVE FEED'}
                </span>
            </div>
            <button
                onClick={onFlashToggle}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            >
                <Zap size={20} className={cn(flashOn && 'text-yellow-300')} />
            </button>
        </div>

        {/* Simulated camera feed */}
        <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden min-h-[350px]">
            <div className={cn('absolute inset-0 opacity-30 z-0', styles.viewfinderGrid)} />

            {/* Simulated receipt */}
            <div className="w-[60%] h-[80%] bg-slate-200 transform rotate-1 shadow-2xl relative flex flex-col p-6 items-center opacity-90 blur-[0.5px]">
                <div className="w-16 h-16 bg-slate-800 rounded-full mb-4" />
                <div className="w-32 h-4 bg-slate-800/20 mb-2" />
                <div className="w-24 h-3 bg-slate-800/10 mb-8" />
                <div className="w-full space-y-2">
                    <div className="flex justify-between"><div className="w-1/2 h-3 bg-slate-800/20" /><div className="w-10 h-3 bg-slate-800/20" /></div>
                    <div className="flex justify-between"><div className="w-1/3 h-3 bg-slate-800/20" /><div className="w-10 h-3 bg-slate-800/20" /></div>
                    <div className="flex justify-between"><div className="w-2/3 h-3 bg-slate-800/20" /><div className="w-10 h-3 bg-slate-800/20" /></div>
                </div>
            </div>

            {/* Corner brackets */}
            <div className={cn(styles.cornerBracket, styles.cornerTL)} />
            <div className={cn(styles.cornerBracket, styles.cornerTR)} />
            <div className={cn(styles.cornerBracket, styles.cornerBL)} />
            <div className={cn(styles.cornerBracket, styles.cornerBR)} />

            {/* Laser Scan Animation */}
            {!isProcessing && (
                <motion.div
                    initial={{ top: 0, opacity: 0.8 }}
                    animate={{ top: "100%", opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-10"
                />
            )}

            {/* Processing Overlay */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader2 size={48} className="text-cyan-400 mb-4" />
                        </motion.div>
                        <p className="text-white font-medium tracking-widest text-sm uppercase">Analizando Recibo...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instruction */}
            {!isProcessing && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-2 rounded-full border border-white/10 text-sm font-medium shadow-lg whitespace-nowrap z-20">
                    Enfoca el ticket completo y evita sombras
                </div>
            )}
        </div>
    </div>
);

/* ─── Action toolbar ─── */

const ScanToolbar: React.FC<{
    onGallery: () => void;
    onCapture: () => void;
    onCrop: () => void;
    disabled: boolean;
}> = ({ onGallery, onCapture, onCrop, disabled }) => (
    <div className={cn(styles.glassPanel, 'w-full md:w-24 lg:w-32 flex md:flex-col items-center justify-center gap-8 md:gap-12 p-4 rounded-3xl')}>
        <button onClick={onGallery} disabled={disabled} className="group flex flex-col items-center gap-2 disabled:opacity-50">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-slate-400 transition-all">
                <FolderOpen size={20} />
            </div>
            <span className="text-xs text-slate-400 font-medium">Galería</span>
        </button>
        <button onClick={onCapture} disabled={disabled} className="relative group disabled:opacity-50">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center relative bg-slate-900 shadow-glow group-active:scale-95 transition-transform">
                <div className="w-16 h-16 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors flex items-center justify-center">
                    <Camera size={28} className="text-white" />
                </div>
            </div>
        </button>
        <button onClick={onCrop} disabled={disabled} className="group flex flex-col items-center gap-2 disabled:opacity-50">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-slate-400 transition-all">
                <Crop size={20} />
            </div>
            <span className="text-xs text-slate-400 font-medium">Recortar</span>
        </button>
    </div>
);

/* ─── Main Page Component ─── */

export const OCRScanner: React.FC = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const {
        scanResult,
        flashOn,
        isProcessing,
        toggleFlash,
        handleCapture,
        handleGallery,
        handleCrop,
        handleSplitAll,
        handleAssignToMe,
        handleConfirmSync,
        formatCurrency,
    } = useOCRScanner();

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] text-slate-200 antialiased selection:bg-cyan-500 selection:text-white">

            <div className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0">
                {/* Unified Header */}
                <PageHeader
                    onMenuClick={toggleSidebar}
                    title="OCR SCANNER"
                    subtitle="Easy-Pay"
                    onBack={() => navigate(-1)}
                    showAvatar
                    showNotification
                />

                <main className="flex-grow flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 relative w-full max-w-7xl mx-auto gap-6">
                    {/* Decorative glows */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute top-[-10%] left-[20%] w-[30%] h-[30%] bg-cyan-500/5 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
                    </div>

                    {/* Camera + Toolbar */}
                    <div className="w-full flex flex-col md:flex-row gap-6 h-auto md:h-[500px]">
                        <Viewfinder flashOn={flashOn} onFlashToggle={toggleFlash} isProcessing={isProcessing} />
                        <ScanToolbar onGallery={handleGallery} onCapture={handleCapture} onCrop={handleCrop} disabled={isProcessing} />
                    </div>

                    {/* Analysis Panel */}
                    <div className={cn(styles.glassPanel, 'w-full rounded-2xl shadow-glass flex flex-col overflow-hidden mt-2')}>
                        {/* Panel header */}
                        <div className="p-4 sm:px-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-2">
                                <Sparkles size={20} className="text-cyan-400" />
                                <h3 className="text-lg font-bold text-white">Análisis del Ticket</h3>
                            </div>
                            <StatusBadge label={`OCR Confianza: ${scanResult.confidence}%`} variant="success" />
                        </div>

                        {/* Two-column content */}
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Left – Detected (OCR) */}
                            <div className="w-full md:w-1/2 border-r border-white/5 p-4 sm:p-6 bg-black/20">
                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
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
                                                    : 'hover:bg-white/5 border-b border-dashed border-slate-700',
                                            )}
                                        >
                                            <span className={item.isUnassigned ? 'text-amber-200' : 'text-slate-300'}>{item.description}</span>
                                            <span className={cn('font-bold', item.isUnassigned ? 'text-amber-200' : 'text-white')}>
                                                {formatCurrency(item.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right – App totals + warnings */}
                            <div className="w-full md:w-1/2 p-4 sm:p-6 bg-slate-800/30 relative">
                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Smartphone size={16} /> En la App (Cuenta)
                                </h4>
                                <div className="space-y-3 mb-6 opacity-60">
                                    {scanResult.appItems.map((item: OCRItem, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-300">{item.description}</span>
                                            <span className="text-white">{formatCurrency(item.amount)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Unassigned warnings */}
                                {scanResult.unassignedItems.map((item: OCRItem) => (
                                    <div
                                        key={item.id}
                                        className={cn(styles.glassPanel, 'bg-amber-900/10 border-l-4 border-l-red-500 border-y border-r border-red-500/30 rounded-r-lg p-4 mb-4 shadow-lg animate-pulse-slow')}
                                    >
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle size={20} className="text-amber-500 mt-0.5" />
                                            <div className="flex-grow">
                                                <h5 className="text-amber-100 font-bold text-sm mb-1">Item no asignado detectado</h5>
                                                <p className="text-slate-300 text-xs mb-3">
                                                    <span className="text-white font-mono">{item.description} ({formatCurrency(item.amount)})</span> aparece en el ticket pero nadie lo reclamó en la app.
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSplitAll(item)}
                                                        className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded transition"
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

                        {/* Footer totals */}
                        <div className="bg-slate-900/80 p-4 sm:px-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-6 w-full sm:w-auto justify-center sm:justify-start">
                                <div className="text-center sm:text-left">
                                    <span className="block text-xs text-slate-500 uppercase font-bold">Total Ticket</span>
                                    <span className="block text-xl font-mono text-white">{formatCurrency(scanResult.ticketTotal)}</span>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="text-center sm:text-left">
                                    <span className="block text-xs text-slate-500 uppercase font-bold">Total App</span>
                                    <span className="block text-xl font-mono text-red-400">{formatCurrency(scanResult.appTotal)}</span>
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

                <footer className="py-6 text-center text-slate-600 text-sm">
                    <p>© 2025 Easy-Pay Technology. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};
