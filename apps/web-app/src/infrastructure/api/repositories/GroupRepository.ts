import { Group, Item, Member, GroupRepository } from '@easy-pay/domain';
import { httpClient } from '../http-client';
import { subscribeToGroup } from '../websocket-client';
import { toGroup, toApiItem, ApiGroup } from '../mappers';
import { handleApiError } from '../error-handler';

/**
 * Concrete implementation of the `GroupRepository` port connecting to the FastAPI backend.
 */
export class ApiGroupRepository implements GroupRepository {

    // ── getGroup ──────────────────────────────────────────────────────────────
    async getGroup(id: string): Promise<Group> {
        try {
            const res = await httpClient.get<ApiGroup>(`/groups/${id}`);
            return toGroup(res.data);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── createGroup ───────────────────────────────────────────────────────────
    async createGroup(leader: Member, name?: string): Promise<Group> {
        try {
            const res = await httpClient.post<any>('/groups/create', { admin_id: leader.id, nombre: name });
            return {
                id: res.data.group_id,
                code: res.data.invite_code,
                name: name || '',
                leaderId: leader.id,
                status: 'active',
                subtotal: 0,
                tip: 0,
                total: 0,
                version: 1,
                members: [{ ...leader, role: 'leader' }],
                items: [],
                createdAt: new Date().toISOString()
            };
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── joinGroup ─────────────────────────────────────────────────────────────
    async joinGroup(code: string, member: Member): Promise<Group> {
        try {
            const res = await httpClient.post<any>(`/groups/join`, { codigo: code, user_id: member.id });
            return this.getGroup(res.data.group_id);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── closeGroup ────────────────────────────────────────────────────────────
    async closeGroup(groupId: string): Promise<void> {
        try {
            // Nota: El backend no tiene un endpoint explícito de 'close', se lanza error si se intenta usar.
            throw new Error("Endpoint 'close' no implementado en backend");
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── addItem ───────────────────────────────────────────────────────────────
    async addItem(groupId: string, item: Item): Promise<void> {
        try {
            await httpClient.post(`/groups/add-item`, {
                group_id: groupId,
                nombre: item.description,
                precio: item.amount,
                cantidad: 1,
                comprador_id: item.addedBy,
                participantes_ids: item.assignedTo
            });
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── removeItem ────────────────────────────────────────────────────────────
    async removeItem(groupId: string, itemId: string): Promise<void> {
        try {
            await httpClient.delete(`/groups/${groupId}/items/${itemId}`);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── assignItem ────────────────────────────────────────────────────────────
    async assignItem(groupId: string, itemId: string, memberIds: string[]): Promise<void> {
        try {
            await httpClient.put(`/groups/${groupId}/items/${itemId}`, { assigned_to: memberIds });
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── markMemberAsPaid ──────────────────────────────────────────────────────
    async markMemberAsPaid(groupId: string, memberId: string): Promise<void> {
        try {
            await httpClient.patch(`/groups/${groupId}/members/${memberId}/paid`);
        } catch (e) {
            return handleApiError(e);
        }
    }

    // ── onGroupUpdate (WebSocket) ─────────────────────────────────────────────
    onGroupUpdate(groupId: string, callback: (group: Group) => void): () => void {
        return subscribeToGroup(groupId, callback);
    }
}

export const groupRepository = new ApiGroupRepository();
