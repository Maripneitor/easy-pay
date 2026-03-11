import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Group } from '@easy-pay/domain';
import { CalculateSharesUseCase } from '@easy-pay/domain';
import type { SplitResult, MemberShare } from '@easy-pay/domain';
import { groupRepository } from '../../../infrastructure/api/repositories/GroupRepository';
import { upsertGroupInStorage } from '../../../infrastructure/localStorage/group-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'activity' | 'balances' | 'settings';

const calculateShares = new CalculateSharesUseCase();

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGroupDetail = () => {
    const navigate  = useNavigate();
    const { id }    = useParams<{ id: string }>();

    const [group,      setGroup]      = useState<Group | null>(null);
    const [shares,     setShares]     = useState<SplitResult | null>(null);
    const [activeTab,  setActiveTab]  = useState<Tab>('activity');
    const [isLoading,  setIsLoading]  = useState<boolean>(true);
    const [error,      setError]      = useState<string | null>(null);

    // ── Load group + real-time subscription ───────────────────────────────────
    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        const load = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const fetchedGroup = await groupRepository.getGroup(id);
                if (cancelled) return;

                applyGroupUpdate(fetchedGroup);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Error cargando el grupo');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();

        // Subscribe to real-time updates (WebSocket in production, no-op in mock mode)
        const unsubscribe = groupRepository.onGroupUpdate(id, (updatedGroup) => {
            if (cancelled) return;
            applyGroupUpdate(updatedGroup);
            // Also persist the update to localStorage for offline-first
            upsertGroupInStorage(updatedGroup);
        });

        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, [id]);

    // ── Shared update handler ──────────────────────────────────────────────────
    const applyGroupUpdate = (updatedGroup: Group) => {
        setGroup(updatedGroup);
        // Recalculate shares every time the group changes
        try {
            const result = calculateShares.execute(updatedGroup);
            setShares(result);
        } catch {
            // Group may not have items yet — that's OK
            setShares(null);
        }
    };

    // ── Actions (delegated to use cases via repository) ───────────────────────

    const addItem = useCallback(async (description: string, amount: number, addedBy: string) => {
        if (!id) return;
        await groupRepository.addItem(id, {
            id:          `item-${Date.now()}`,
            description,
            amount,
            addedBy,
            assignedTo:  [],
        });
        // Refresh group after mutation
        const updated = await groupRepository.getGroup(id);
        applyGroupUpdate(updated);
    }, [id]);

    const markAsPaid = useCallback(async (memberId: string) => {
        if (!id) return;
        await groupRepository.markMemberAsPaid(id, memberId);
        const updated = await groupRepository.getGroup(id);
        applyGroupUpdate(updated);
    }, [id]);

    // ── Derived UI values ──────────────────────────────────────────────────────

    const totalSpent = group?.total     ?? 0;
    const subtotal   = group?.subtotal  ?? 0;
    const tip        = group?.tip       ?? 0;
    const groupName  = group?.name      ?? 'Detalle del Grupo';

    // Placeholder: "my share" = first member's share (will use AuthContext in FC)
    const myShare = shares?.shares[0]?.total.amount ?? 0;

    // Amount owed to current user = sum of shares from members who haven't paid
    const amountOwedToMe = shares?.shares
        .filter((s: MemberShare) => !group?.members.find(m => m.id === s.memberId)?.hasPaid)
        .reduce((sum: number, s: MemberShare) => sum + s.total.amount, 0) ?? 0;

    const activities = [
        { id: 1, title: 'Cena Pagada', amount: 120.50, date: 'Hoy', paidBy: 'Juan', userOwes: 20, bg: 'bg-emerald-100', color: 'text-emerald-600', icon: () => null },
        { id: 2, title: 'Taxis Múltiples', amount: 45.00, date: 'Ayer', paidBy: 'Maria', userLent: 15, bg: 'bg-blue-100', color: 'text-blue-600', icon: () => null }
    ];

    const balances = [
        { name: 'Maria', status: 'owes', amount: 15, avatar: 'https://ui-avatars.com/api/?name=Maria' },
        { name: 'Pedro', status: 'owe', amount: 20, avatar: 'https://ui-avatars.com/api/?name=Pedro' }
    ];

    return {
        // State
        group,
        shares,
        activeTab,
        setActiveTab,
        isLoading,
        error,
        // Navigation
        navigate,
        // Derived
        groupName,
        totalSpent,
        subtotal,
        tip,
        userShare: myShare,
        userOwed: amountOwedToMe,
        activities,
        balances,
        // Actions
        addItem,
        markAsPaid,
    };
};
