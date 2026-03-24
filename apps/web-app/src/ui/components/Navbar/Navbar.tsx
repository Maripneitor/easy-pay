import React from 'react';
import { User } from 'lucide-react';
import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();

    const handleProfile = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate('/auth');
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer} onClick={() => navigate('/')}>
                <div className={styles.iconWrapper}>
                    <img 
                        src="/assets/images/logo-ep.png"
                        alt="Easy-Pay Logo"
                        className={styles.logoImage}
                    />
                </div>
                <span className={styles.logoText}>Easy-Pay</span>
            </div>

            <div className={styles.navLinks}>
                <a href="#pain-points" className={styles.navLink}>El Problema</a>
                <a href="#how-it-works" className={styles.navLink}>Cómo funciona</a>
                <a href="#testimonials" className={styles.navLink}>Testimonios</a>
                <a href="#comparison" className={styles.navLink}>Comparativa</a>
            </div>

            <div className={styles.actions}>
                {!isAuthenticated && (
                    <button
                        className={styles.loginBtn}
                        onClick={() => navigate('/auth')}
                    >
                        Entrar
                    </button>
                )}
                <button
                    className={styles.profileBtn}
                    onClick={handleProfile}
                    title={isAuthenticated ? "Mi Perfil" : "Iniciar Sesión"}
                >
                    <User size={18} />
                </button>
            </div>
        </nav>
    );
};
