import { Item } from '@easy-pay/domain';

/**
 * Shape of an item as returned by the FastAPI backend.
 */
export interface ApiItem {
    id: string;
    description: string;
    amount: number;
    assigned_to: string[];  // Array of member ids
    added_by: string;       // Member id
}

/**
 * Maps a raw API item to the domain `Item` entity.
 */
export const toItem = (apiItem: ApiItem): Item => ({
    id:          apiItem.id,
    description: apiItem.description,
    amount:      apiItem.amount,
    assignedTo:  apiItem.assigned_to ?? [],
    addedBy:     apiItem.added_by,
});

export const toItemList = (apiItems: ApiItem[]): Item[] =>
    apiItems.map(toItem);

// ─── Reverse mapper (Domain → API) for write operations ──────────────────────

export const toApiItem = (item: Omit<Item, 'id'>): Omit<ApiItem, 'id'> => ({
    description: item.description,
    amount:      item.amount,
    assigned_to: item.assignedTo,
    added_by:    item.addedBy,
});
