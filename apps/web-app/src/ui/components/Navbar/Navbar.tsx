import React from 'react';
import { Receipt, User } from 'lucide-react';
import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer} onClick={() => navigate('/')}>
                <div className={styles.iconWrapper}>
                    <Receipt className={styles.logoIcon} size={24} />
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
                <button
                    className={styles.loginBtn}
                    onClick={() => navigate('/auth')}
                >
                    Entrar
                </button>
                <button
                    className={styles.profileBtn}
                    onClick={() => navigate('/dashboard')}
                >
                    <User size={18} />
                </button>
            </div>
        </nav>
    );
};
