import { Group, Item, Member, GroupRepository } from '@easy-pay/domain';

/**
 * Mobile implementation of GroupRepository.
 */
export class MobileGroupRepository implements GroupRepository {
    private MOCK_GROUPS: Group[] = [
        {
            id: '1',
            code: 'M-CANC24',
            name: 'Viaje a Cancún (Mobile)',
            leaderId: 'user-1',
            status: 'active',
            subtotal: 14000,
            tip: 1400,
            total: 15400,
            members: [
                { id: 'user-1', name: 'Juan', role: 'leader', avatarUrl: 'https://ui-avatars.com/api/?name=Juan', hasPaid: false },
                { id: 'user-2', name: 'Maria', role: 'member', avatarUrl: 'https://ui-avatars.com/api/?name=Maria', hasPaid: false },
            ],
            items: [],
            createdAt: new Date().toISOString(),
        }
    ];

    async getGroup(id: string): Promise<Group> {
        const group = this.MOCK_GROUPS.find(g => g.id === id);
        if (!group) throw new Error('Grupo no encontrado');
        return group;
    }

    async createGroup(leader: Member, name?: string): Promise<Group> {
        const newGroup: Group = {
            id: `m-${Date.now()}`,
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            name,
            leaderId: leader.id,
            status: 'active',
            subtotal: 0,
            tip: 0,
            total: 0,
            members: [leader],
            items: [],
            createdAt: new Date().toISOString(),
        };
        this.MOCK_GROUPS.push(newGroup);
        return newGroup;
    }

    async joinGroup(code: string, member: Member): Promise<Group> {
        const group = this.MOCK_GROUPS.find(g => g.code === code);
        if (!group) throw new Error('Código no válido');
        group.members.push(member);
        return group;
    }

    async closeGroup(groupId: string): Promise<void> {
        const group = await this.getGroup(groupId);
        group.status = 'closed';
    }

    async addItem(groupId: string, item: Item): Promise<void> {
        const group = await this.getGroup(groupId);
        group.items.push(item);
    }

    async removeItem(groupId: string, itemId: string): Promise<void> {
        const group = await this.getGroup(groupId);
        group.items = group.items.filter(i => i.id !== itemId);
    }

    async assignItem(groupId: string, itemId: string, memberIds: string[]): Promise<void> {
        const group = await this.getGroup(groupId);
        const item = group.items.find(i => i.id === itemId);
        if (item) item.assignedTo = memberIds;
    }

    async markMemberAsPaid(groupId: string, memberId: string): Promise<void> {
        const group = await this.getGroup(groupId);
        const member = group.members.find(m => m.id === memberId);
        if (member) member.hasPaid = true;
    }

    onGroupUpdate(_groupId: string, _callback: (group: Group) => void): () => void {
        // Implementación con WS para mobile aquí
        return () => {};
    }
}

export const groupRepository = new MobileGroupRepository();
