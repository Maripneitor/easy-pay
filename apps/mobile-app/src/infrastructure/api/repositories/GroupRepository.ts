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

    async addItem(groupId: string, item: any): Promise<void> {
        await httpClient.post('/groups/add-item', {
            group_id: groupId,
            nombre: item.description || item.nombre,
            precio: item.amount || item.precio,
            cantidad: item.quantity || 1,
            comprador_id: item.addedBy || item.comprador_id,
            participantes_ids: item.assignedTo || item.participantes_ids
        });
    }

    async removeItem(groupId: string, itemId: string): Promise<void> {
        await httpClient.delete(`/groups/${groupId}/items/${itemId}`);
    }

    async assignItem(groupId: string, itemId: string, memberIds: string[]): Promise<void> {
        await httpClient.put(`/groups/${groupId}/items/${itemId}`, {
            participantes_ids: memberIds
        });
    }

    async editItem(groupId: string, itemId: string, itemData: any): Promise<void> {
        await httpClient.put(`/groups/${groupId}/items/${itemId}`, itemData);
    }


    async markMemberAsPaid(groupId: string, memberId: string): Promise<void> {
        // Backend logic here
    }

    async findByUser(userId: string): Promise<any[]> {
        const response = await httpClient.get(`/groups/user/${userId}`);
        return response.data;
    }

    async getItems(groupId: string): Promise<any[]> {
        const response = await httpClient.get(`/groups/${groupId}/items`);
        return response.data;
    }

    async getBalances(groupId: string): Promise<any> {
        const response = await httpClient.get(`/groups/${groupId}/balances`);
        return response.data;
    }

    async deleteGroup(groupId: string): Promise<void> {
        await httpClient.delete(`/groups/${groupId}`);
    }

    onGroupUpdate(groupId: string, callback: (group: Group) => void): () => void {
        return () => {};
    }
}

export const groupRepository = new ApiMobileGroupRepository();
