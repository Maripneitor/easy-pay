import React, { useState } from 'react';
import { PageHeader } from '@ui/components/PageHeader';
import {
    ShieldCheck,
    Key,
    Files,
    Copy,
    Check,
    QrCode
} from 'lucide-react';
import { GoogleIcon } from '@ui/components/icons/GoogleIcon';
import styles from './TwoFactorSetup.module.css';

export const TwoFactorSetup = () => {
    const [copied, setCopied] = useState(false);
    const goBack = () => window.history.back();

    const secretKey = "J2K4 M5N6 P7Q8 R9S0";
    const backupCodes = ["1928-3849", "5738-2910", "4829-1029", "5839-2023"];

    const handleCopy = () => {
        navigator.clipboard.writeText(secretKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        /* IMPORTANTE: Agregué !bg-[var(--bg-body)] para FORZAR el fondo del tema sobre el CSS */
        <div className={`${styles.setupPage} !bg-[var(--bg-body)] min-h-screen transition-colors duration-300`}>
            <PageHeader
                title="SEGURIDAD: 2FA"
                subtitle="Easy-Pay"
                onBack={goBack}
                showAvatar={false} 
                showNotification={true}
            />

            <main className={`${styles.mainContent} !bg-transparent`}>
                {/* Glow adaptable al color primario del tema */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-[var(--primary)] opacity-5 blur-[100px] pointer-events-none" />

                {/* Cambiamos el fondo de la Card también para que no sea azul */}
                <div className={`${styles.setupCard} !bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl relative z-10`}>
                    <div className={styles.headerContainer}>
                        <div className={`${styles.iconCircle} bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20`}>
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className={`${styles.title} !text-[var(--text-primary)]`}>Autenticación de dos pasos</h2>
                        <p className={`${styles.description} !text-[var(--text-secondary)]`}>
                            Añade una capa extra de seguridad a tu cuenta escaneando el código con tu app de autenticación (<GoogleIcon size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />Google Authenticator/Authy).
                        </p>
                    </div>

                    <div className={styles.qrContainer}>
                        {/* El QR ahora sobre fondo blanco para que se pueda escanear bien, pero el cuadro es adaptable */}
                        <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center">
                            <QrCode size={160} className="text-slate-900" strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className={styles.secretSection}>
                        <div className={`${styles.secretLabel} !text-[var(--text-secondary)]`}>
                            <Key size={14} className="text-[var(--primary)]" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Llave secreta</span>
                        </div>
                        <div className="bg-[var(--bg-body)] border border-[var(--border-color)] rounded-xl flex items-center justify-between p-3 mt-2">
                            <code className="text-[var(--text-primary)] font-mono text-sm">{secretKey}</code>
                            <button
                                onClick={handleCopy}
                                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                            >
                                {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-[var(--border-color)] mt-8 pt-8">
                        <div className="flex items-center gap-2 text-[var(--text-primary)] mb-4">
                            <Files size={18} className="text-[var(--primary)]" />
                            <h3 className="font-bold uppercase text-xs tracking-widest">Códigos de respaldo</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {backupCodes.map((code, index) => (
                                <div key={index} className="bg-[var(--bg-body)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-center py-2 rounded-lg text-xs">
                                    {code}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="mt-12 py-6 text-center">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">
                        © 2026 Easy-Pay Security. All rights reserved.
                    </p>
                </footer>
            </main>
        </div>
    );
};