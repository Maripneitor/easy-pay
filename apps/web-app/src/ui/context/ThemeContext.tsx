import React, { createContext, useContext, useEffect, useState } from 'react';

type ColorTheme = 'vibrant' | 'serene' | 'earth' | 'default';

interface ThemeContextType {
    colorTheme: ColorTheme;
    isDark: boolean;
    setTheme: (theme: ColorTheme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [colorTheme, setColorTheme] = useState<ColorTheme>(() => 
        (localStorage.getItem('color-theme') as ColorTheme) || 'default'
    );

    const [isDark, setIsDark] = useState<boolean>(() => {
        const saved = localStorage.getItem('is-dark');
        // Mantener oscuro por defecto para ese look profesional que te gustó
        return saved ? saved === 'true' : true;
    });

    useEffect(() => {
        const root = window.document.body;
        
        // 1. Limpiamos todas las clases para evitar conflictos
        root.classList.remove('vibrant', 'serene', 'earth', 'dark');

        // 2. Aplicamos 'dark' solo si el estado es oscuro
        if (isDark) {
            root.classList.add('dark');
        }

        // 3. Aplicamos el color especial (rojo, verde, tierra)
        // Solo si no es el azul por defecto ('default')
        if (colorTheme !== 'default') {
            root.classList.add(colorTheme);
        }

        // 4. Guardamos en persistencia
        localStorage.setItem('color-theme', colorTheme);
        localStorage.setItem('is-dark', isDark.toString());
    }, [colorTheme, isDark]);

    const setTheme = (newColor: ColorTheme) => {
        setColorTheme(newColor);
    };

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ colorTheme, isDark, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) throw new Error('useTheme debe usarse dentro de ThemeProvider');
    return context;
};