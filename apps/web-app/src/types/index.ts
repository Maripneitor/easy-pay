/**
 * UI-only types (ViewModels)
 *
 * These types extend domain entities with presentation-layer properties
 * (icons, colors, formatted strings) that cannot live in @easy-pay/domain
 * because they depend on React or CSS class strings.
 *
 * Pattern:
 *   Domain Entity → (mapper) → ViewModel → Component Props
 */

import React from 'react';
import type { Group as DomainGroup, Member as DomainMember, GroupStatus } from '@easy-pay/domain';

// ─── Group ViewModel ──────────────────────────────────────────────────────────

export interface GroupViewModel extends Omit<DomainGroup, 'members'> {
    /** Tailwind bg class for the group icon (e.g. 'bg-blue-100') */
    iconBg?: string;
    /** Tailwind text class for the group icon color (e.g. 'text-blue-600') */
    iconColor?: string;
    /** React icon node rendered in the card */
    icon?: React.ReactNode;
    /** Pre-formatted last activity string (e.g. 'Hace 2 horas') */
    lastAct?: string;
    /** Whether the current user is the leader of this group */
    isAdmin?: boolean;
    /** Pre-formatted close date for settled groups */
    date?: string;
    /** Resolved member list (UI layer adds avatarUrl resolution) */
    members: MemberViewModel[];
    /** How many members beyond the visible max (e.g. +3) */
    extraMembers?: number;
    /** Balance of the current user in this group (positive = owed, negative = owes) */
    userBalance?: number;
}

/**
 * Maps a domain `Group` to a `GroupViewModel`.
 * The `categoryToAppearance` function allows UI to inject styling logic.
 */
export const toGroupViewModel = (
    group: DomainGroup,
    options?: {
        currentUserId?: string;
        icon?: React.ReactNode;
        iconBg?: string;
        iconColor?: string;
        lastAct?: string;
    }
): GroupViewModel => ({
    ...group,
    members:    group.members.map(toMemberViewModel),
    icon:       options?.icon,
    iconBg:     options?.iconBg,
    iconColor:  options?.iconColor,
    lastAct:    options?.lastAct,
    isAdmin:    group.leaderId === options?.currentUserId,
    userBalance: undefined, // Calculated by CalculateSharesUseCase — set separately
});

// ─── Member ViewModel ─────────────────────────────────────────────────────────

export interface MemberViewModel extends DomainMember {
    /** Resolved avatar URL (falls back to ui-avatars if missing) */
    avatar: string;
    /** Formatted "paid" / "pending" label */
    paymentLabel: string;
}

export const toMemberViewModel = (member: DomainMember): MemberViewModel => ({
    ...member,
    avatar:       member.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`,
    paymentLabel: member.hasPaid ? 'Pagado' : 'Pendiente',
});

// ─── Backward-compatibility re-exports ────────────────────────────────────────

/** @deprecated Use `MemberViewModel` or `Member` from `@easy-pay/domain` */
export interface Member {
    id?: string;
    name: string;
    avatar?: string;
}

/** @deprecated Use `GroupViewModel` or `Group` from `@easy-pay/domain` */
export interface Group {
    id: string;
    name: string;
    icon?: React.ReactNode;
    iconBg?: string;
    iconColor?: string;
    isAdmin?: boolean;
    lastAct?: string;
    members: (Member | string)[];
    extraMembers?: number;
    total: number;
    userBalance?: number;
    date?: string;
}

/** @deprecated Use `Payment` from `@easy-pay/domain` */
export interface Payment {
    id: string;
    amount: number;
    description: string;
    date: string;
    payer: Member;
}

// Unused in new code but kept so existing imports don't break:
export type { GroupStatus };

