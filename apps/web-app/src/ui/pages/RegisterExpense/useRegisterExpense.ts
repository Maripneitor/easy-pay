import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SplitType, TipMode, Participant } from '@easy-pay/shared';

const MOCK_PARTICIPANTS: Participant[] = [
    { id: 'p1', name: 'Ana Pérez', initials: 'AP', color: 'pink', isSelected: true },
    { id: 'p2', name: 'Carlos López', initials: 'CL', color: 'emerald', isSelected: true },
    { id: 'p3', name: 'Tú (Juan)', initials: 'TÚ', color: 'blue', isSelected: true, isCurrentUser: true },
    { id: 'p4', name: 'Luis Martínez', initials: 'LM', color: 'amber', isSelected: false },
];

export const useRegisterExpense = () => {
    const navigate = useNavigate();

    // ─── Form state ───
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dateTime, setDateTime] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    });
    const [splitType, setSplitType] = useState<SplitType>('equally');
    const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
    const [tipMode, setTipMode] = useState<TipMode>('percentage');
    const [tipValue, setTipValue] = useState('');

    const groupName = 'Cena viernes';

    // ─── Derived values ───
    const parsedAmount = useMemo(() => {
        const cleaned = amount.replace(/[,$\s]/g, '');
        return parseFloat(cleaned) || 0;
    }, [amount]);

    const selectedCount = useMemo(
        () => participants.filter((p) => p.isSelected).length,
        [participants],
    );

    const tipAmount = useMemo(() => {
        const val = parseFloat(tipValue) || 0;
        if (tipMode === 'percentage') return parsedAmount * (val / 100);
        return val;
    }, [parsedAmount, tipMode, tipValue]);

    const perPerson = useMemo(() => {
        if (selectedCount === 0) return 0;
        return (parsedAmount + tipAmount) / selectedCount;
    }, [parsedAmount, tipAmount, selectedCount]);

    // ─── Handlers ───
    const goBack = () => navigate(-1);

    const toggleParticipant = useCallback((id: string) => {
        setParticipants((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isSelected: !p.isSelected } : p)),
        );
    }, []);

    const selectAll = useCallback(() => {
        setParticipants((prev) => prev.map((p) => ({ ...p, isSelected: true })));
    }, []);

    const handleSubmit = useCallback(() => {
        console.log('Submit expense:', {
            description,
            amount: parsedAmount,
            dateTime,
            splitType,
            participants: participants.filter((p) => p.isSelected),
            tipMode,
            tipValue: tipAmount,
        });
        navigate('/dashboard');
    }, [description, parsedAmount, dateTime, splitType, participants, tipMode, tipAmount, navigate]);

    const formatCurrency = (value: number) =>
        value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    return {
        // State
        description,
        setDescription,
        amount,
        setAmount,
        dateTime,
        setDateTime,
        splitType,
        setSplitType,
        participants,
        tipMode,
        setTipMode,
        tipValue,
        setTipValue,
        groupName,

        // Derived
        parsedAmount,
        selectedCount,
        tipAmount,
        perPerson,

        // Actions
        goBack,
        toggleParticipant,
        selectAll,
        handleSubmit,
        formatCurrency,
    };
};
