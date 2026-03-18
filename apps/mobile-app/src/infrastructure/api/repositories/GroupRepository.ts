import { Group, Item, Member, GroupRepository } from '@easy-pay/domain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@easy_pay_groups';

/**
 * Mobile implementation of GroupRepository with Offline-first support.
 */
export class MobileGroupRepository implements GroupRepository {
    private MOCK_GROUPS: Group[] = [];
    private subscribers: Map<string, Set<(group: Group) => void>> = new Map();

    constructor() {
        this.init();
    }

    private async init() {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.MOCK_GROUPS = JSON.parse(stored);
            } else {
                // Initial seeding
                this.MOCK_GROUPS = [
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
                        version: 1,
                        createdAt: new Date().toISOString(),
                    }
                ];
                await this.persist();
            }
        } catch (e) {
            console.error('Failed to load groups from storage:', e);
        }
    }

    private async persist() {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.MOCK_GROUPS));
        } catch (e) {
            console.error('Failed to save groups to storage:', e);
        }
    }

    private notifySubscribers(groupId: string) {
        const group = this.MOCK_GROUPS.find(g => g.id === groupId);
        if (group && this.subscribers.has(groupId)) {
            this.subscribers.get(groupId)?.forEach(callback => callback(group));
        }
    }

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
            version: 1,
            createdAt: new Date().toISOString(),
        };
        this.MOCK_GROUPS.push(newGroup);
        await this.persist();
        return newGroup;
    }

    async joinGroup(code: string, member: Member): Promise<Group> {
        const group = this.MOCK_GROUPS.find(g => g.code === code.toUpperCase());
        if (!group) throw new Error('Código no válido');
        group.members.push(member);
        group.version += 1;
        await this.persist();
        this.notifySubscribers(group.id);
        return group;
    }

    async closeGroup(groupId: string): Promise<void> {
        const group = await this.getGroup(groupId);
        group.status = 'closed';
        group.version += 1;
        await this.persist();
        this.notifySubscribers(groupId);
    }

    async addItem(groupId: string, item: Item): Promise<void> {
        const group = await this.getGroup(groupId);
        group.items.push(item);
        group.version += 1;
        await this.persist();
        this.notifySubscribers(groupId);
    }

    async removeItem(groupId: string, itemId: string): Promise<void> {
        const group = await this.getGroup(groupId);
        group.items = group.items.filter(i => i.id !== itemId);
        await this.persist();
        this.notifySubscribers(groupId);
    }

    async assignItem(groupId: string, itemId: string, memberIds: string[]): Promise<void> {
        const group = await this.getGroup(groupId);
        const item = group.items.find(i => i.id === itemId);
        if (item) {
            item.assignedTo = memberIds;
            await this.persist();
            this.notifySubscribers(groupId);
        }
    }

    async markMemberAsPaid(groupId: string, memberId: string): Promise<void> {
        const group = await this.getGroup(groupId);
        const member = group.members.find(m => m.id === memberId);
        if (member) {
            member.hasPaid = true;
            await this.persist();
            this.notifySubscribers(groupId);
        }
    }

    onGroupUpdate(groupId: string, callback: (group: Group) => void): () => void {
        if (!this.subscribers.has(groupId)) {
            this.subscribers.set(groupId, new Set());
        }
        this.subscribers.get(groupId)?.add(callback);

        // Cleanup: remove the connection when unsubscribed
        return () => {
            const groupSubscribers = this.subscribers.get(groupId);
            if (groupSubscribers) {
                groupSubscribers.delete(callback);
                if (groupSubscribers.size === 0) {
                    this.subscribers.delete(groupId);
                }
            }
        };
    }
}

export const groupRepository = new MobileGroupRepository();
