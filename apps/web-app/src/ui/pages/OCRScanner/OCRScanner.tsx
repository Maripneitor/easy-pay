import React from 'react';
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
} from 'lucide-react';
import { cn } from '@infrastructure/utils';
import { GlassCard } from '../../components/GlassCard';
import { StatusBadge } from '../../components/StatusBadge';
import { PageHeader } from '@ui/components/PageHeader';
import { useOCRScanner } from './useOCRScanner';
import styles from './OCRScanner.module.css';

/* ─── Viewfinder component ─── */

const Viewfinder: React.FC<{ flashOn: boolean; onFlashToggle: () => void }> = ({ flashOn, onFlashToggle }) => (
    <div className={cn(styles.glassPanel, 'relative flex-grow rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border-slate-700/50 flex flex-col')}>
        {/* Top overlay */}
        <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
            <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono text-white/90">LIVE FEED</span>
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

            {/* Scan line */}
            <div className={cn('absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10', styles.scanLine)} />

            {/* Instruction */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-2 rounded-full border border-white/10 text-sm font-medium shadow-lg whitespace-nowrap z-20">
                Enfoca el ticket completo y evita sombras
            </div>
        </div>
    </div>
);

/* ─── Action toolbar ─── */

const ScanToolbar: React.FC<{
    onGallery: () => void;
    onCapture: () => void;
    onCrop: () => void;
}> = ({ onGallery, onCapture, onCrop }) => (
    <div className={cn(styles.glassPanel, 'w-full md:w-24 lg:w-32 flex md:flex-col items-center justify-center gap-8 md:gap-12 p-4 rounded-3xl')}>
        <button onClick={onGallery} className="group flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-slate-400 transition-all">
                <FolderOpen size={20} />
            </div>
            <span className="text-xs text-slate-400 font-medium">Galería</span>
        </button>
        <button onClick={onCapture} className="relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center relative bg-slate-900 shadow-glow group-active:scale-95 transition-transform">
                <div className="w-16 h-16 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors flex items-center justify-center">
                    <Camera size={28} className="text-white" />
                </div>
            </div>
        </button>
        <button onClick={onCrop} className="group flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-slate-400 transition-all">
                <Crop size={20} />
            </div>
            <span className="text-xs text-slate-400 font-medium">Recortar</span>
        </button>
    </div>
);

/* ─── Main Page Component ─── */

export const OCRScanner: React.FC = () => {
    const {
        scanResult,
        flashOn,
        toggleFlash,
        handleCapture,
        handleGallery,
        handleCrop,
        handleSplitAll,
        handleAssignToMe,
        handleConfirmSync,
        formatCurrency,
    } = useOCRScanner();

    const goBack = () => window.history.back();

    return (
        <div className="bg-[#0f172a] text-slate-200 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-white">
            {/* Unified Header */}
            <PageHeader
                title="OCR SCANNER"
                subtitle="Easy-Pay"
                onBack={goBack}
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
                    <Viewfinder flashOn={flashOn} onFlashToggle={toggleFlash} />
                    <ScanToolbar onGallery={handleGallery} onCapture={handleCapture} onCrop={handleCrop} />
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
                                {scanResult.detectedItems.map((item) => (
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
                                {scanResult.appItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300">{item.description}</span>
                                        <span className="text-white">{formatCurrency(item.amount)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Unassigned warnings */}
                            {scanResult.unassignedItems.map((item) => (
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
    );
};
