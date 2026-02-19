
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
    const navigate = useNavigate();

    return {
        mode,
        setMode,
        loginType,
        setLoginType,
        navigate
    };
};
