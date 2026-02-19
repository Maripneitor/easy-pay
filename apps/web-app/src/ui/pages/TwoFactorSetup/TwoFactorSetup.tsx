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
        <div className={styles.setupPage}>
            <PageHeader
                title="SEGURIDAD: 2FA"
                subtitle="Easy-Pay"
                onBack={goBack}
                showAvatar
            />

            <main className={styles.mainContent}>
                <div className={styles.glow} />

                <div className={styles.setupCard}>
                    <div className={styles.headerContainer}>
                        <div className={styles.iconCircle}>
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className={styles.title}>Autenticación de dos pasos</h2>
                        <p className={styles.description}>
                            Añade una capa extra de seguridad a tu cuenta escaneando el código con tu app de autenticación (<GoogleIcon size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />Google Authenticator/Authy).
                        </p>
                    </div>

                    <div className={styles.qrContainer}>
                        <div className={styles.qrBox}>
                            <QrCode size={160} className="text-slate-900" strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className={styles.secretSection}>
                        <div className={styles.secretLabel}>
                            <Key size={14} />
                            <span>Llave secreta</span>
                        </div>
                        <div className={styles.secretValueContainer}>
                            <code className={styles.secretValue}>{secretKey}</code>
                            <button
                                onClick={handleCopy}
                                className={styles.copyBtn}
                                title="Copiar llave"
                            >
                                {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.backupSection}>
                        <div className={styles.backupTitle}>
                            <Files size={18} />
                            <h3>Códigos de respaldo</h3>
                        </div>
                        <p className={styles.backupDesc}>
                            Guarda estos códigos en un lugar seguro. Podrás usarlos para acceder si pierdes tu dispositivo.
                        </p>
                        <div className={styles.backupGrid}>
                            {backupCodes.map((code, index) => (
                                <div key={index} className={styles.backupCode}>
                                    {code}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className={styles.footer}>
                    <p className={styles.footerText}>
                        © 2026 Easy-Pay Security. All rights reserved.
                    </p>
                </footer>
            </main>
        </div>
    );
};
