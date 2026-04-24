import React, { createContext, useContext, useMemo } from 'react';
import {
    GroupRepository,
    CreateGroupUseCase,
    JoinGroupUseCase,
    CloseGroupUseCase,
    GetGroupUseCase,
    CalculateSharesUseCase,
    AddItemUseCase,
    AssignItemUseCase,
    GetGroupUpdateUseCase
} from '@easy-pay/domain';

// Repositorio que conecta con tus microservicios de FastAPI
import { groupRepository as mobileGroupRepository } from '../api/repositories/GroupRepository';

// Repositorio de pruebas locales
import { InMemoryGroupRepository } from '../mock/InMemoryGroupRepository';

// ========================================================
// CONFIGURACIÓN DE PRUEBAS
// ========================================================
// Cambia a 'false' para conectar con tus microservicios reales
const USE_MOCKS = false;

interface Dependencies {
    repositories: {
        group: GroupRepository;
    };
    useCases: {
        createGroup: CreateGroupUseCase;
        joinGroup: JoinGroupUseCase;
        closeGroup: CloseGroupUseCase;
        getGroup: GetGroupUseCase;
        calculateShares: CalculateSharesUseCase;
        addItem: AddItemUseCase;
        assignItem: AssignItemUseCase;
        getGroupUpdate: GetGroupUpdateUseCase;
    };
}

const DependenciesContext = createContext<Dependencies | null>(null);

export const DependenciesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dependencies = useMemo(() => {

        // Elegimos el repositorio según el flag USE_MOCKS
        // Si es true: Usa datos en memoria (no necesita internet)
        // Si es false: Intenta conectar a tus microservicios en los puertos 8000/8001
        const groupRepo = USE_MOCKS ? new InMemoryGroupRepository() : mobileGroupRepository;

        console.log(`[Dependencies] Usando modo: ${USE_MOCKS ? 'MOCKS (Local)' : 'API (Real)'}`);

        return {
            repositories: {
                group: groupRepo,
            },
            useCases: {
                createGroup: new CreateGroupUseCase(groupRepo),
                joinGroup: new JoinGroupUseCase(groupRepo),
                closeGroup: new CloseGroupUseCase(groupRepo),
                getGroup: new GetGroupUseCase(groupRepo),
                calculateShares: new CalculateSharesUseCase(), // No requiere repositorio
                addItem: new AddItemUseCase(groupRepo),
                assignItem: new AssignItemUseCase(groupRepo),
                getGroupUpdate: new GetGroupUpdateUseCase(groupRepo),
            }
        };
    }, []);

    return (
        <DependenciesContext.Provider value={dependencies}>
            {children}
        </DependenciesContext.Provider>
    );
};

export const useDependencies = () => {
    const context = useContext(DependenciesContext);
    if (!context) {
        throw new Error('useDependencies must be used within a DependenciesProvider');
    }
    return context;
};