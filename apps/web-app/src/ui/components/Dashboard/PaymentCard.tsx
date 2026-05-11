import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { cn } from '@infrastructure/utils';

interface PaymentCardProps {
    card: {
        id: string;
        bankName?: string;
        lastFour: string;
        holder: string;
        brand?: string;
        isDefault?: boolean;
        bankStyle?: string;
    };
    onDelete?: (id: string) => void;
    className?: string;
}

export const getBankStyle = (bankName: string = ''): string => {
    const name = bankName.toLowerCase();
    
    if (name.includes('bbva')) return 'linear-gradient(135deg, #004481 0%, #043263 100%)';
    if (name.includes('santander')) return 'linear-gradient(135deg, #ec0000 0%, #b30000 100%)';
    if (name.includes('banorte')) return 'linear-gradient(135deg, #eb1921 0%, #7d0c0f 100%)';
    if (name.includes('hsbc')) return 'linear-gradient(135deg, #db0011 0%, #8b0000 100%)';
    if (name.includes('nu') || name.includes('nubank')) return 'linear-gradient(135deg, #820ad1 0%, #4c067a 100%)';
    if (name.includes('hey') || name.includes('banregio')) return 'linear-gradient(135deg, #ffcd00 0%, #ff8200 100%)';
    if (name.includes('amex') || name.includes('american express')) return 'linear-gradient(135deg, #0070d2 0%, #003087 100%)';
    if (name.includes('citibanamex') || name.includes('banamex')) return 'linear-gradient(135deg, #004691 0%, #002d5c 100%)';
    if (name.includes('mercado pago') || name.includes('mercado libre')) return 'linear-gradient(135deg, #00bcff 0%, #0099cc 100%)';
    if (name.includes('rappicard') || name.includes('rappi')) return 'linear-gradient(135deg, #ff3333 0%, #cc0000 100%)';
    
    // Default Gray (Gris) as requested
    return 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)';
};

export const PaymentCard: React.FC<PaymentCardProps> = ({ card, onDelete, className }) => {
    const gradient = getBankStyle(card.bankName);
    const isWhiteText = !card.bankName?.toLowerCase().includes('hey'); // Hey Banco is yellow, might need dark text

    return (
        <motion.div 
            layout
            whileHover={{ scale: 1.02, translateY: -5 }}
            className={cn(
                "group payment-card relative h-60 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer",
                className
            )}
            style={{ 
                background: gradient,
                border: '1px solid rgba(255,255,255,0.1)'
            }}
        >
            {/* Texture & Gloss */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')", zIndex: 1 }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30" style={{ zIndex: 1 }} />
            
            {/* Animated Shimmer */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg]" style={{ zIndex: 1 }} />

            {/* Card Content Container */}
            <div className={cn("relative z-10 h-full flex flex-col justify-between", isWhiteText ? "text-white" : "text-slate-900")}>
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className={cn("text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-sm", isWhiteText ? "text-white/70" : "text-black/50")}>
                            {card.bankName || 'PLATINO GLOBAL'}
                        </div>
                        <div className="w-12 h-9 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 rounded-lg border border-white/30 flex items-center justify-center p-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
                            <div className="w-full h-full bg-black/10 rounded-sm grid grid-cols-4 gap-0.5 opacity-50">
                                {[...Array(8)].map((_, i) => <div key={i} className="border-r border-b border-white/10"></div>)}
                            </div>
                        </div>
                    </div>
                    {onDelete && (
                        <div className="flex gap-2">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(card.id);
                                }}
                                className="p-3 bg-white/10 hover:bg-rose-500 border border-white/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md"
                                title="Eliminar Tarjeta"
                            >
                                <Trash2 size={18} className={isWhiteText ? "text-white" : "text-slate-900"} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className={cn("text-2xl font-mono tracking-[0.25em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] filter contrast-125", isWhiteText ? "text-white/95" : "text-black/80")}>
                        •••• •••• •••• {card.lastFour}
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className={cn("text-[9px] font-black uppercase tracking-[0.4em]", isWhiteText ? "text-white/50" : "text-black/40")}>Card Holder</p>
                            <p className="text-sm font-black uppercase tracking-widest truncate max-w-[200px] drop-shadow-sm">{card.holder}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            {card.isDefault && (
                                <span className={cn("mb-2 text-[8px] font-black uppercase px-2 py-0.5 rounded border backdrop-blur-sm", isWhiteText ? "bg-white/20 text-white border-white/30" : "bg-black/10 text-black border-black/20")}>
                                    PRINCIPAL
                                </span>
                            )}
                            <div className="h-10 flex items-center">
                                {card.brand?.toUpperCase() === 'VISA' && <span className="text-3xl font-black italic tracking-tighter opacity-90 drop-shadow-lg">VISA</span>}
                                {card.brand?.toUpperCase() === 'MASTERCARD' && (
                                    <div className="flex -space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-rose-500/80 mix-blend-screen" />
                                        <div className="w-8 h-8 rounded-full bg-amber-500/80 mix-blend-screen" />
                                    </div>
                                )}
                                {card.brand?.toUpperCase() === 'AMEX' && <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded text-xs font-black italic">AMEX</div>}
                                {!['VISA', 'MASTERCARD', 'AMEX'].includes(card.brand?.toUpperCase()) && <span className="text-lg font-black uppercase tracking-widest opacity-70">{card.brand}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
