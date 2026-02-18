export const APP_NAME = "Easy Pay v2";

// ─── User ────────────────────────────────
export interface User {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    role?: 'admin' | 'member';
}

// ─── Payments (MyPayments page) ──────────
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface PaymentCard {
    id: string;
    lastFour: string;
    holder: string;
    brand: 'VISA' | 'MasterCard' | 'AMEX';
    isDefault: boolean;
    expiresAt?: string;
}

export interface PaymentTransaction {
    id: string;
    description: string;
    category: string;
    date: string;
    status: PaymentStatus;
    amount: number;
    avatarUrl?: string;
    icon?: string;
}

// ─── OCR Scanner page ────────────────────
export interface OCRItem {
    id: string;
    description: string;
    amount: number;
    isUnassigned?: boolean;
}

export interface OCRScanResult {
    ticketTotal: number;
    appTotal: number;
    confidence: number;
    detectedItems: OCRItem[];
    appItems: { description: string; amount: number }[];
    unassignedItems: OCRItem[];
}

// ─── Register Expense page ──────────────
export type SplitType = 'equally' | 'percentage' | 'shares';
export type TipMode = 'percentage' | 'fixed';

export interface Participant {
    id: string;
    name: string;
    initials: string;
    color: string; // tailwind color key, e.g. 'pink', 'emerald'
    isSelected: boolean;
    isCurrentUser?: boolean;
}

export interface ExpenseFormData {
    description: string;
    amount: number;
    dateTime: string;
    splitType: SplitType;
    participants: Participant[];
    tipMode: TipMode;
    tipValue: number; // percentage or fixed amount
    groupName: string;
}
