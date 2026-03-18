import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Money, ValidationException } from '@easy-pay/domain';

export type SplitType = 'equally' | 'individual' | 'exact';
export type TipMode = 'percentage' | 'fixed';

export interface Participant {
    id: string;
    name: string;
    initials: string;
    color: string;
    isSelected: boolean;
    isCurrentUser?: boolean;
}

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

    // ─── Domain-driven values (Derivados) ───

    // Intentamos instanciar Money. Si falla, capturamos el error para la UI.
    const { money, amountError } = useMemo(() => {
        try {
            const val = parseFloat(amount.replace(/[,$\s]/g, ''));
            if (isNaN(val)) return { money: Money.zero(), amountError: null };
            return { money: Money.of(val), amountError: null };
        } catch (e) {
            if (e instanceof ValidationException) {
                return { money: Money.zero(), amountError: e.message };
            }
            return { money: Money.zero(), amountError: 'Monto inválido' };
        }
    }, [amount]);

    const parsedAmount = money.amount;

    const selectedCount = useMemo(
        () => participants.filter((p) => p.isSelected).length,
        [participants],
    );

    // Cálculo de propina usando Money para asegurar reglas de negocio (ej. no negativos)
    const tipMoney = useMemo(() => {
        try {
            const val = parseFloat(tipValue) || 0;
            if (tipMode === 'percentage') {
                return money.multiply(val / 100);
            }
            return Money.of(val);
        } catch {
            return Money.zero();
        }
    }, [money, tipMode, tipValue]);

    const tipAmount = tipMoney.amount;

    // Suma total usando inmutabilidad de Money
    const totalMoney = useMemo(() => money.add(tipMoney), [money, tipMoney]);

    const perPerson = useMemo(() => {
        if (selectedCount === 0) return 0;
        try {
            return totalMoney.divide(selectedCount).amount;
        } catch {
            return 0;
        }
    }, [totalMoney, selectedCount]);

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
        if (amountError) {
            alert(amountError);
            return;
        }
        
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
    }, [description, parsedAmount, dateTime, splitType, participants, tipMode, tipAmount, navigate, amountError]);

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
        amountError, // New: Error reported by Money VO

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
