import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; // ¡Importante instalar!
import { PageHeader } from '@ui/components/PageHeader';
import {
    ShieldCheck,
    Key,
    Files,
    Copy,
    Check,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { GoogleIcon } from '@ui/components/icons/GoogleIcon';
import styles from './TwoFactorSetup.module.css';

export const TwoFactorSetup = () => {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qrData, setQrData] = useState({ secret: '', qr_uri: '' });

    const goBack = () => window.history.back();

    // Obtenemos el ID del usuario logueado
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchSetup = async () => {
            try {
                setLoading(true);
                // Llamamos a tu endpoint de FastAPI
                const response = await axios.post(`http://localhost:8000/api/auth/2fa/setup/${userId}`);
                setQrData({
                    secret: response.data.secret,
                    qr_uri: response.data.qr_uri
                });
            } catch (err) {
                setError('No se pudo conectar con el microservicio de seguridad.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchSetup();
    }, [userId]);

    const handleCopy = () => {
        navigator.clipboard.writeText(qrData.secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)]">
            <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
        </div>
    );

    return (
        <div className={`${styles.setupPage} !bg-[var(--bg-body)] min-h-screen transition-colors duration-300`}>
            <PageHeader
                title="SEGURIDAD: 2FA"
                subtitle="Easy-Pay"
                onBack={goBack}
                showAvatar={false}
                showNotification={true}
            />

            <main className={`${styles.mainContent} !bg-transparent`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-[var(--primary)] opacity-5 blur-[100px] pointer-events-none" />

                <div className={`${styles.setupCard} !bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl relative z-10`}>
                    <div className={styles.headerContainer}>
                        <div className={`${styles.iconCircle} bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20`}>
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className={`${styles.title} !text-[var(--text-primary)]`}>Autenticación de dos pasos</h2>
                        <p className={`${styles.description} !text-[var(--text-secondary)]`}>
                            Añade una capa extra de seguridad escaneando el código con tu app (<GoogleIcon size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />Google Authenticator/Authy).
                        </p>
                    </div>

                    {error ? (
                        <div className="flex flex-col items-center gap-4 text-red-500 p-8">
                            <AlertCircle size={48} />
                            <p className="text-sm font-bold uppercase">{error}</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.qrContainer}>
                                <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center">
                                    {/* Aquí renderizamos el QR REAL que viene del backend */}
                                    <QRCodeSVG
                                        value={qrData.qr_uri}
                                        size={160}
                                        level="H"
                                        includeMargin={false}
                                    />
                                </div>
                            </div>

                            <div className={styles.secretSection}>
                                <div className={`${styles.secretLabel} !text-[var(--text-secondary)]`}>
                                    <Key size={14} className="text-[var(--primary)]" />
                                    <span className="font-bold uppercase tracking-widest text-[10px]">Llave secreta (Manual)</span>
                                </div>
                                <div className="bg-[var(--bg-body)] border border-[var(--border-color)] rounded-xl flex items-center justify-between p-3 mt-2">
                                    <code className="text-[var(--text-primary)] font-mono text-sm">{qrData.secret}</code>
                                    <button
                                        onClick={handleCopy}
                                        className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                                    >
                                        {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="border-t border-[var(--border-color)] mt-8 pt-8">
                        <button
                            onClick={() => window.location.href = '/2fa-verify'} // Aquí iría tu siguiente paso
                            className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/20"
                        >
                            Siguiente: Verificar código
                        </button>
                    </div>
                </div>

                <footer className="mt-12 py-6 text-center">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">
                        © 2026 Easy-Pay Security. UNACH Software Engineering.
                    </p>
                </footer>
            </main>
        </div>
    );
};