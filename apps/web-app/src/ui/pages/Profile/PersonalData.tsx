import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Camera, Save, AlertCircle } from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import { useAuthContext } from '../../context/AuthContext';
import { userRepository } from '../../../infrastructure/api/repositories';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PersonalData.module.css';

export const PersonalData = () => {
    const navigate = useNavigate();
    const { user, updateUserSession } = useAuthContext();

    // --- ESTADOS CONECTADOS AL CONTEXTO ---
    const [name, setName] = useState(user?.nombre || user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&bold=true`;

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = "El nombre es obligatorio";
        if (name.trim().length < 3) newErrors.name = "El nombre debe tener al menos 3 caracteres";
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) newErrors.email = "El correo es obligatorio";
        else if (!emailRegex.test(email)) newErrors.email = "Formato de correo inválido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!user?.id) return toast.error("Error: Sesión no válida");
        if (!validate()) return;

        setLoading(true);
        try {
            // Enviamos la actualización (el ID se extrae del JWT en el backend, 
            // pero el repo actual lo sigue pidiendo por compatibilidad)
            const result = await userRepository.updateUser(user.id, {
                nombre: name,
                email: email
            });

            if (result.status === "success") {
                // ✅ ACTUALIZAMOS EL CONTEXTO Y LOCALSTORAGE (Manejando el posible nuevo token)
                updateUserSession({
                    ...user,
                    nombre: name,
                    email: email
                }, result.new_token);

                toast.success("¡Perfil actualizado con éxito!");
                navigate(-1);
            } else {
                toast.error(result.message || "No se pudo actualizar");
            }
        } catch (error: any) {
            toast.error(error.message || "No se pudo actualizar el perfil");
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

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.contentWrapper}
                >
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarWrapper}>
                            <motion.img 
                                key={name}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={avatar} 
                                alt="Profile" 
                                className={styles.avatar} 
                            />
                            <button className={styles.cameraBtn}>
                                <Camera size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <UserIcon size={18} className={styles.icon} />
                                Nombre Completo
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`${styles.input} ${errors.name ? 'border-rose-500 ring-rose-500/20' : ''}`}
                                    placeholder="Escribe tu nombre"
                                />
                                <AnimatePresence>
                                    {errors.name && (
                                        <motion.span 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -bottom-5 left-0 text-[10px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1"
                                        >
                                            <AlertCircle size={10} /> {errors.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <Mail size={18} className={styles.icon} />
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`${styles.input} ${errors.email ? 'border-rose-500 ring-rose-500/20' : ''}`}
                                    placeholder="tu@correo.com"
                                />
                                <AnimatePresence>
                                    {errors.email && (
                                        <motion.span 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -bottom-5 left-0 text-[10px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1"
                                        >
                                            <AlertCircle size={10} /> {errors.email}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            className={styles.saveBtn}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Guardando...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save size={20} />
                                    Guardar Cambios
                                </div>
                            )}
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};