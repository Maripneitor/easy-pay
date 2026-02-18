import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Camera, Save, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import { cn } from '@infrastructure/utils';
import styles from './PersonalData.module.css';

export const PersonalData = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('Juan Pérez');
    const [email, setEmail] = useState('juan.perez@example.com');
    const [avatar, setAvatar] = useState('https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&bold=true');

    const handleSave = () => {
        // Logic to save data would go here
        console.log('Saving data:', { name, email, avatar });
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            <PageHeader
                title="DATOS PERSONALES"
                subtitle="Editar Perfil"
                onBack={() => navigate(-1)}
                showAvatar={false}
            />

            <main className={styles.mainContent}>
                <div className={styles.glow} />

                <div className={styles.contentWrapper}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarWrapper}>
                            <img src={avatar} alt="Profile" className={styles.avatar} />
                            <button className={styles.cameraBtn}>
                                <Camera size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <User size={18} className={styles.icon} />
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <Mail size={18} className={styles.icon} />
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <button className={styles.saveBtn} onClick={handleSave}>
                        <Save size={20} />
                        Guardar Cambios
                    </button>
                </div>
            </main>
        </div>
    );
};
