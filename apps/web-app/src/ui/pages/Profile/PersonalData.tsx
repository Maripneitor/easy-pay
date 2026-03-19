import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Camera, Save } from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import styles from './PersonalData.module.css';

export const PersonalData = () => {
    const navigate = useNavigate();

    // --- ESTADOS CONECTADOS AL LOCALSTORAGE ---
    const [name, setName] = useState(localStorage.getItem('userName') || '');
    const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
    const [loading, setLoading] = useState(false);

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&bold=true`;

    const handleSave = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return alert("Error: No se encontró el ID de usuario");

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/auth/update/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: name,
                    email: email
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || 'Error al actualizar');

            // ✅ ACTUALIZAMOS EL LOCALSTORAGE PARA QUE EL RESTO DE LA APP SE ENTERE
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);

            alert("¡Perfil actualizado con éxito!");
            navigate(-1); // Volvemos al perfil
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
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
                                placeholder="Escribe tu nombre"
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
                                placeholder="tu@correo.com"
                            />
                        </div>
                    </div>

                    <button
                        className={styles.saveBtn}
                        onClick={handleSave}
                        disabled={loading}
                    >
                        <Save size={20} />
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </main>
        </div>
    );
};