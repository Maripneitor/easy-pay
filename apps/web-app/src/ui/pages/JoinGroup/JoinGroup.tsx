import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, ArrowLeft, Send } from 'lucide-react';
import styles from './JoinGroup.module.css';

export const JoinGroup = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length === 6) {
            // In a real app, we would validate the code here
            navigate('/dashboard');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.overlay} />
            <div className={styles.container}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.card}
                >
                    <button className={styles.backBtn} onClick={() => navigate('/')}>
                        <ArrowLeft size={24} />
                    </button>

                    <div className={styles.header}>
                        <div className={styles.iconWrapper}>
                            <QrCode size={48} className={styles.icon} />
                        </div>
                        <h1 className={styles.title}>Unirse a Mesa</h1>
                        <p className={styles.subtitle}>
                            Escanea el código QR del anfitrión o ingresa el código manual abajo.
                        </p>
                    </div>

                    <div className={styles.scannerSimulator}>
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.05, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={styles.scanBeam}
                        />
                        <QrCode size={120} className={styles.qrPlaceholder} />
                    </div>

                    <form onSubmit={handleJoin} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="CÓDIGO DE 6 DÍGITOS"
                                className={styles.input}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={code.length !== 6}
                            className={styles.submitBtn}
                        >
                            <span className={styles.btnText}>Unirme Ahora</span>
                            <Send size={18} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};
