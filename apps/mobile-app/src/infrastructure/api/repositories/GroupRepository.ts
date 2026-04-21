import { Group, Item, Member, GroupRepository } from '@easy-pay/domain';
import { httpClient } from '../http-client';

/**
 * Mobile implementation of GroupRepository connecting to the FastAPI backend.
 */
export class ApiMobileGroupRepository implements GroupRepository {
    
    async getGroup(id: string): Promise<Group> {
        const response = await httpClient.get(`/groups/${id}`);
        // Backend returns GroupDetailOut which might need mapping
        return response.data;
    }

    async createGroup(leader: Member, name?: string): Promise<Group> {
        const response = await httpClient.post('/groups/create', { 
            admin_id: leader.id, 
            nombre: name || 'Nuevo Grupo'
        });
        
        // Manual mapping from create response
        return {
            id: response.data.group_id,
            code: response.data.invite_code,
            name: name || 'Nuevo Grupo',
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
    }

    async joinGroup(code: string, member: Member): Promise<Group> {
        const response = await httpClient.post('/groups/join', { 
            codigo: code, 
            user_id: member.id 
        });
        return this.getGroup(response.data.group_id);
    }

    async closeGroup(groupId: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async addItem(groupId: string, item: Item): Promise<void> {
        await httpClient.post('/groups/add-item', {
            group_id: groupId,
            nombre: item.description,
            precio: item.amount,
            cantidad: 1,
            comprador_id: item.addedBy,
            participantes_ids: item.assignedTo
        });
    }

    async removeItem(groupId: string, itemId: string): Promise<void> {
        // Assuming group_id is required by backend for deletion
        await httpClient.delete(`/groups/unknown/items/${itemId}`);
    }

    async assignItem(groupId: string, itemId: string, memberIds: string[]): Promise<void> {
        await httpClient.put(`/groups/unknown/items/${itemId}`, {
            participantes_ids: memberIds
        });
    }

    async markMemberAsPaid(groupId: string, memberId: string): Promise<void> {
        // Backend logic here
    }

    async findByUser(userId: string): Promise<Group[]> {
        const response = await httpClient.get(`/groups/user/${userId}`);
        return response.data;
    }

    onGroupUpdate(groupId: string, callback: (group: Group) => void): () => void {
        return () => {};
    }
}

export const groupRepository = new ApiMobileGroupRepository();
