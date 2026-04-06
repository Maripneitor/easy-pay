/**
 * Easy-Pay Mobile: Global Type Definitions
 * Based on Version 1.0 of the Product Specification
 */

export type UserRole = 'LIDER' | 'MIEMBRO' | 'INVITADO';

export interface User {
    id: string;
    nombre: string;
    email?: string;
    avatar?: string;
    isGuest: boolean;
    role?: UserRole;
}

export interface Participant {
    id: string;
    nombre: string;
    avatar: string;
    color: string;
    isLeader: boolean;
    debt: number;
    status: 'CONECTADO' | 'DESCONECTADO' | 'OFFLINE';
}

export interface Item {
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    autorId: string;
    asignadoA: string[]; // Array of participant IDs
}

export type MesaStatus = 'ACTIVA' | 'CERRANDO' | 'CERRADA';

export interface Mesa {
    id: string;
    codigo: string; // 4-6 digit numeric code
    nombre: string;
    liderId: string;
    participantes: Participant[];
    items: Item[];
    subtotal: number;
    propina: number;
    total: number;
    status: MesaStatus;
    creadaEn: string;
}

export type PaymentStatusType = 'PENDIENTE' | 'PAGANDO' | 'PAGADO' | 'ERROR_PAGO';

export interface PaymentStatus {
    participanteId: string;
    mesaId: string;
    montoDeuda: number;
    montoPagado: number;
    status: PaymentStatusType;
}

export interface DigitalTicket {
    mesaId: string;
    participanteId: string;
    subtotalIndividual: number;
    propinaIndividual: number;
    totalIndividual: number;
    generadoEn: string;
}

export type SyncActionType = 'ADD_ITEM' | 'EDIT_ITEM' | 'DELETE_ITEM' | 'ASSIGN_ITEM' | 'CLOSE_MESA' | 'JOIN_MESA';

export interface SyncQueueItem {
    id: string;
    tipo: SyncActionType;
    payload: any;
    timestamp: string;
    reintentos: number;
}

export type AppSyncStatus = 'SYNCED' | 'PENDING' | 'OFFLINE' | 'CONFLICT';
