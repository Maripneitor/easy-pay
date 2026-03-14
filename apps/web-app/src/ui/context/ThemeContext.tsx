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
        // Si no hay nada guardado, lo ponemos en oscuro por defecto
        return saved ? saved === 'true' : true;
    });

    useEffect(() => {
        const root = window.document.body;
        
        // 1. Limpiamos todas las clases de colores
        root.classList.remove('vibrant', 'serene', 'earth');
        // También quitamos 'dark' para decidir si la ponemos de nuevo
        root.classList.remove('dark');

        // 2. Aplicamos la oscuridad SOLO si isDark es true
        // Esto evita que el color 'default' ponga la pantalla negra en modo claro
        if (isDark) {
            root.classList.add('dark');
        }

        // 3. Aplicamos el color especial si no es el azul
        if (colorTheme !== 'default') {
            root.classList.add(colorTheme);
        }

        localStorage.setItem('color-theme', colorTheme);
        localStorage.setItem('is-dark', isDark.toString());
    }, [colorTheme, isDark]);

    // Función para cambiar color sin tocar el brillo
    const setTheme = (newColor: ColorTheme) => {
        setColorTheme(newColor);
    };

    // Función para cambiar brillo sin tocar el color
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
    if (context === undefined) throw new Error('useTheme error');
    return context;
};