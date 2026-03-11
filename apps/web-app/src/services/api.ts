/**
 * @deprecated
 * Este archivo ha sido migrado a `infrastructure/api/repositories/GroupRepository.ts`
 * y `infrastructure/api/http-client.ts`.
 *
 * Se mantiene temporalmente para no romper imports existentes.
 * Eliminarlo una vez que todos los consumers hayan sido actualizados (Fase 3).
 */

// Re-export from the new location for backward compatibility
export { groupRepository as groupService } from '../infrastructure/api/repositories/GroupRepository';

// Helper type preserved for backward compatibility
export interface ApiResponse<T> {
    data: T | null;
    status: number;
    error?: string;
}
