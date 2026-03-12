import { Group, Item, Member, GroupRepository } from '@easy-pay/domain';
import { httpClient } from '../http-client';
import { subscribeToGroup } from '../websocket-client';
import { toGroup, toApiItem, ApiGroup } from '../mappers';
import { handleApiError } from '../error-handler';

/**
 * Concrete implementation of the `GroupRepository` port.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  HOW TO CONNECT WITH YOUR FASTAPI BACKEND                       │
 * │                                                                 │
 * │  Each method has:                                               │
 * │    1. A MOCK block (active now, behind `USE_MOCK_DATA` flag)     │
 * │    2. A REAL block (commented out — uncomment when API is ready) │
 * │                                                                 │
 * │  To switch to real API:                                         │
 * │    Set VITE_USE_MOCK_DATA=false in your .env file               │
 * └─────────────────────────────────────────────────────────────────┘
 */

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// ─── Mock helpers (only used in development) ──────────────────────────────────
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_GROUPS: Group[] = [
    {
        id: '1',
        code: 'CANC24',
        name: 'Viaje a Cancún',
        leaderId: 'user-1',
        status: 'active',
        subtotal: 14_000,
        tip: 1_400,   // 10% (< $3000 rule doesn't apply here — this is total subtotal)
        total: 15_400,
        members: [
            { id: 'user-1', name: 'Juan',  role: 'leader', avatarUrl: 'https://ui-avatars.com/api/?name=Juan',  hasPaid: false },
            { id: 'user-2', name: 'María', role: 'member', avatarUrl: 'https://ui-avatars.com/api/?name=Maria', hasPaid: false },
        ],
        items: [
            { id: 'item-1', description: 'Hotel 3 noches', amount: 9_000,  assignedTo: ['user-1', 'user-2'], addedBy: 'user-1' },
            { id: 'item-2', description: 'Vuelos',         amount: 5_000,  assignedTo: ['user-1', 'user-2'], addedBy: 'user-1' },
        ],
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        code: 'XMAS23',
        name: 'Cena de Navidad',
        leaderId: 'user-3',
        status: 'paying',
        subtotal: 3_200,
        tip: 160,     // 5% (>= $3000)
        total: 3_360,
        members: [
            { id: 'user-3', name: 'Ana',    role: 'leader', avatarUrl: 'https://ui-avatars.com/api/?name=Ana',    hasPaid: true  },
            { id: 'user-4', name: 'Luis',   role: 'member', avatarUrl: 'https://ui-avatars.com/api/?name=Luis',   hasPaid: false },
            { id: 'user-5', name: 'Carlos', role: 'member', avatarUrl: 'https://ui-avatars.com/api/?name=Carlos', hasPaid: false },
        ],
        items: [
            { id: 'item-3', description: 'Cena restaurante', amount: 2_000, assignedTo: ['user-3', 'user-4', 'user-5'], addedBy: 'user-3' },
            { id: 'item-4', description: 'Postres',          amount: 600,  assignedTo: ['user-3', 'user-4'],            addedBy: 'user-4' },
            { id: 'item-5', description: 'Vinos',            amount: 600,  assignedTo: ['user-5'],                      addedBy: 'user-5' },
        ],
        createdAt: new Date().toISOString(),
    },
];

// ─── Repository Implementation ─────────────────────────────────────────────────

export class ApiGroupRepository implements GroupRepository {

    // ── getGroup ──────────────────────────────────────────────────────────────
    async getGroup(id: string): Promise<Group> {
        try {
            if (USE_MOCK_DATA) {
                await delay();
                const group = MOCK_GROUPS.find(g => g.id === id);
                if (!group) throw new Error(`Grupo con id "${id}" no encontrado.`);
                return { ...group };
            }

            const res = await httpClient.get<ApiGroup>(`/groups/${id}`);
            return toGroup(res.data);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── createGroup ───────────────────────────────────────────────────────────
    async createGroup(leader: Member, name?: string): Promise<Group> {
        try {
            if (USE_MOCK_DATA) {
                await delay(1_200);
                const newGroup: Group = {
                    id:        `mock-${Date.now()}`,
                    code:      Math.random().toString(36).substring(2, 8).toUpperCase(),
                    name,
                    leaderId:  leader.id,
                    status:    'active',
                    subtotal:  0,
                    tip:       0,
                    total:     0,
                    members:   [{ ...leader, role: 'leader' }],
                    items:     [],
                    createdAt: new Date().toISOString(),
                };
                MOCK_GROUPS.push(newGroup);
                return newGroup;
            }

            const res = await httpClient.post<ApiGroup>('/groups', { leader_id: leader.id, name });
            return toGroup(res.data);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── joinGroup ─────────────────────────────────────────────────────────────
    async joinGroup(code: string, member: Member): Promise<Group> {
        try {
            if (USE_MOCK_DATA) {
                await delay();
                const group = MOCK_GROUPS.find(g => g.code === code.toUpperCase());
                if (!group) throw new Error(`No se encontró ningún grupo con el código "${code}".`);
                if (!group.members.find(m => m.id === member.id)) {
                    group.members.push({ ...member, role: 'member' });
                }
                return { ...group };
            }

            const res = await httpClient.post<ApiGroup>(`/groups/${code}/join`, { member_id: member.id, name: member.name });
            return toGroup(res.data);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── closeGroup ────────────────────────────────────────────────────────────
    async closeGroup(groupId: string): Promise<void> {
        try {
            if (USE_MOCK_DATA) {
                await delay();
                const group = MOCK_GROUPS.find(g => g.id === groupId);
                if (group) group.status = 'closed';
                return;
            }

            await httpClient.patch(`/groups/${groupId}/close`);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── addItem ───────────────────────────────────────────────────────────────
    async addItem(groupId: string, item: Item): Promise<void> {
        try {
            if (USE_MOCK_DATA) {
                await delay(600);
                const group = MOCK_GROUPS.find(g => g.id === groupId);
                if (!group) throw new Error(`Grupo ${groupId} no encontrado.`);
                group.items.push({ ...item, id: `item-${Date.now()}` });
                this.recalculateTotals(group);
                return;
            }

            await httpClient.post(`/groups/${groupId}/items`, toApiItem(item));
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── removeItem ────────────────────────────────────────────────────────────
    async removeItem(groupId: string, itemId: string): Promise<void> {
        try {
            if (USE_MOCK_DATA) {
                await delay(600);
                const group = MOCK_GROUPS.find(g => g.id === groupId);
                if (!group) throw new Error(`Grupo ${groupId} no encontrado.`);
                group.items = group.items.filter(i => i.id !== itemId);
                this.recalculateTotals(group);
                return;
            }

            await httpClient.delete(`/groups/${groupId}/items/${itemId}`);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── assignItem ────────────────────────────────────────────────────────────
    async assignItem(groupId: string, itemId: string, memberIds: string[]): Promise<void> {
        try {
            if (USE_MOCK_DATA) {
                await delay(600);
                const group = MOCK_GROUPS.find(g => g.id === groupId);
                if (!group) throw new Error(`Grupo ${groupId} no encontrado.`);
                const item = group.items.find(i => i.id === itemId);
                if (!item) throw new Error(`Ítem ${itemId} no encontrado.`);
                item.assignedTo = memberIds;
                return;
            }

            await httpClient.patch(`/groups/${groupId}/items/${itemId}/assign`, { member_id: memberIds });
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── markMemberAsPaid ──────────────────────────────────────────────────────
    async markMemberAsPaid(groupId: string, memberId: string): Promise<void> {
        try {
            if (USE_MOCK_DATA) {
                await delay(600);
                const group = MOCK_GROUPS.find(g => g.id === groupId);
                if (!group) throw new Error(`Grupo ${groupId} no encontrado.`);
                const member = group.members.find(m => m.id === memberId);
                if (!member) throw new Error(`Miembro ${memberId} no encontrado.`);
                member.hasPaid = true;
                return;
            }

            await httpClient.patch(`/groups/${groupId}/members/${memberId}/paid`);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── onGroupUpdate (WebSocket) ─────────────────────────────────────────────
    onGroupUpdate(groupId: string, callback: (group: Group) => void): () => void {
        if (USE_MOCK_DATA) {
            // No-op in mock mode — hooks will trigger re-renders via direct state updates
            console.info(`[GroupRepository] Mock mode: WebSocket disabled for group ${groupId}`);
            return () => {};
        }

        return subscribeToGroup(groupId, callback);
    }

    // ── Private helpers ───────────────────────────────────────────────────────
    private recalculateTotals(group: Group): void {
        const subtotal = group.items.reduce((sum, item) => sum + item.amount, 0);
        const tipRate  = subtotal < 3_000 ? 0.10 : 0.05;
        const tip      = Math.round(subtotal * tipRate * 100) / 100;

        group.subtotal = subtotal;
        group.tip      = tip;
        group.total    = subtotal + tip;
    }
}

// ─── Singleton instance ───────────────────────────────────────────────────────
// Export a single shared instance so the entire app uses the same repository.
export const groupRepository = new ApiGroupRepository();
