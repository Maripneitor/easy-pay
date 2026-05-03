import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User as UserIcon, Mail, Camera, Save, AlertCircle, Phone, 
    Calendar, MapPin, ShieldCheck, X, Building2, CreditCard, Landmark
} from 'lucide-react';
import { PageHeader } from '@ui/components/PageHeader';
import { useAuthContext } from '../../context/AuthContext';
import { userRepository } from '../../../infrastructure/api/repositories';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PersonalData.module.css';

import { TwoFactorModal } from '../../components/Security/TwoFactorModal';

export const PersonalData = () => {
    const navigate = useNavigate();
    const { user, updateUserSession } = useAuthContext();

    const [name, setName] = useState(user?.nombre || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [birthDate, setBirthDate] = useState(user?.birthDate || '');
    const [address, setAddress] = useState(user?.address || '');
    
    // Financial Profile state
    const [beneficiary, setBeneficiary] = useState(user?.financial_profile?.beneficiario || (user?.id === '69eac36de44d7ae382683850' ? 'MARIO EFRAIN MOGUEL HERNANDEZ' : ''));
    const [clabe, setClabe] = useState(user?.financial_profile?.clabe || (user?.id === '69eac36de44d7ae382683850' ? '638180000140716928' : ''));
    const [bank, setBank] = useState(user?.financial_profile?.entidad_financiera || (user?.id === '69eac36de44d7ae382683850' ? 'Nu México' : ''));
    
    const [loading, setLoading] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
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

    const handleSaveInitiate = () => {
        if (!user?.id) return toast.error("Error: Sesión no válida");
        if (!validate()) return;
        setShow2FAModal(true);
    };

    const handleFinalSave = async () => {
        setLoading(true);
        const toastId = toast.loading("Guardando cambios...");

        try {
            const result = await userRepository.updateUser(user!.id, {
                nombre: name,
                email: email,
                phone: phone,
                birthDate: birthDate,
                address: address,
                financial_profile: {
                    beneficiario: beneficiary,
                    clabe: clabe,
                    entidad_financiera: bank
                }
            });

            if (result.status === "success") {
                updateUserSession({
                    ...user!,
                    nombre: name,
                    email: email,
                    phone: phone,
                    birthDate: birthDate,
                    address: address,
                    financial_profile: {
                        beneficiario: beneficiary,
                        clabe: clabe,
                        entidad_financiera: bank
                    }
                }, result.new_token);

                toast.success("¡Perfil actualizado con éxito!", { id: toastId });
                setTimeout(() => navigate(-1), 1000);
            } else {
                toast.error(result.message || "No se pudo actualizar", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.container} no-scrollbar overflow-y-auto`}>
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

                    <div className={`${styles.formSection} grid grid-cols-1 md:grid-cols-2 gap-6`}>
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

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <Phone size={18} className={styles.icon} />
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={styles.input}
                                placeholder="+52 ..."
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <Calendar size={18} className={styles.icon} />
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={`${styles.inputGroup} md:col-span-2`}>
                            <label className={styles.label}>
                                <MapPin size={18} className={styles.icon} />
                                Dirección
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={styles.input}
                                placeholder="Calle, Número, Ciudad..."
                            />
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
                        <div className="mb-8">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--primary)]">Perfil Financiero</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Datos para recibir transferencias bancarias</p>
                        </div>

                        <div className={`${styles.formSection} grid grid-cols-1 md:grid-cols-2 gap-6`}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>
                                    <UserIcon size={18} className={styles.icon} />
                                    Beneficiario
                                </label>
                                <input
                                    type="text"
                                    value={beneficiary}
                                    onChange={(e) => setBeneficiary(e.target.value)}
                                    className={styles.input}
                                    placeholder="Nombre del titular"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>
                                    <CreditCard size={18} className={styles.icon} />
                                    CLABE Interbancaria
                                </label>
                                <input
                                    type="text"
                                    value={clabe}
                                    onChange={(e) => setClabe(e.target.value)}
                                    className={styles.input}
                                    placeholder="18 dígitos"
                                    maxLength={18}
                                />
                            </div>

                            <div className={`${styles.inputGroup} md:col-span-2`}>
                                <label className={styles.label}>
                                    <Landmark size={18} className={styles.icon} />
                                    Entidad Financiera
                                </label>
                                <input
                                    type="text"
                                    value={bank}
                                    onChange={(e) => setBank(e.target.value)}
                                    className={styles.input}
                                    placeholder="Nombre del banco (Ej. BBVA, Nu, Banorte)"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            className={styles.saveBtn}
                            onClick={handleSaveInitiate}
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

            <TwoFactorModal
                isOpen={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                onVerified={handleFinalSave}
                userId={user?.id || ''}
                actionTitle="Actualizar Perfil"
                actionDescription="Estás a punto de modificar tus datos personales. Por seguridad, ingresa el código 2FA."
            />
        </div>
    );
};