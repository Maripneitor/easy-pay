import { Group, GroupStatus } from '@easy-pay/domain';
import { ApiItem, toItemList } from './item-mapper';
import { ApiMember, toMemberList } from './member-mapper';

/**
 * Shape of a group as returned by the FastAPI backend.
 * The backend uses "table" terminology — mappers act as the translator.
 */
export interface ApiGroup {
    id: string;
    code: string;
    name?: string;
    leader_id: string;
    members: ApiMember[];
    items: ApiItem[];
    status: string;         // 'active' | 'closed' | 'paying'
    subtotal: number;
    tip: number;
    total: number;
    created_at?: string;
}

/**
 * Maps the API response (which may use "table" terminology)
 * to the domain `Group` entity (which uses "group" terminology).
 *
 * This is the ONLY place in the codebase that knows about the API's naming.
 */
export const toGroup = (apiGroup: ApiGroup): Group => ({
    id:        apiGroup.id,
    code:      apiGroup.code,
    name:      apiGroup.name,
    leaderId:  apiGroup.leader_id,
    members:   toMemberList(apiGroup.members ?? []),
    items:     toItemList(apiGroup.items ?? []),
    status:    (apiGroup.status as GroupStatus) ?? 'active',
    subtotal:  apiGroup.subtotal ?? 0,
    tip:       apiGroup.tip ?? 0,
    total:     apiGroup.total ?? 0,
    createdAt: apiGroup.created_at,
});

export const toGroupList = (apiGroups: ApiGroup[]): Group[] =>
    apiGroups.map(toGroup);
