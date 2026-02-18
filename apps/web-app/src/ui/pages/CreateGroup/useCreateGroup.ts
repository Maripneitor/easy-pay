import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Member {
    id: number;
    name: string;
    email: string;
    role: 'Administrador' | 'Miembro';
    avatar: string;
    isAdmin: boolean;
}

export const useCreateGroup = () => {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock initial members match the Stitch design
    const [members, setMembers] = useState<Member[]>([
        {
            id: 1,
            name: 'Ana Pérez',
            email: 'ana.perez@example.com',
            role: 'Administrador',
            avatar: 'https://ui-avatars.com/api/?name=Ana+Perez&background=random',
            isAdmin: true
        },
        {
            id: 2,
            name: 'Carlos López',
            email: 'carlos.lopez@example.com',
            role: 'Miembro',
            avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=random',
            isAdmin: false
        }
    ]);

    const handleCreateGroup = async () => {
        if (!groupName) return;

        const newGroup = {
            id: Date.now(),
            name: groupName,
            description: groupDesc,
            members: members,
            lastAct: 'Recién creado',
            total: 0,
            userBalance: 0,
            isAdmin: true,
            createdAt: new Date().toISOString()
        };

        try {
            // Talking to the backend proxy defined in vite.config.ts
            await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGroup),
            });

            console.log('Group saved to JSON via backend');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving group:', error);
            // Fallback to navigation even if backend is down for frontend demo purposes
            navigate('/dashboard');
        }
    };

    const handleAddMember = (name: string) => {
        const newMember: Member = {
            id: Date.now(),
            name: name || 'Nuevo Usuario',
            email: 'nuevo@example.com',
            role: 'Miembro',
            avatar: `https://ui-avatars.com/api/?name=${name || 'User'}&background=random`,
            isAdmin: false
        };
        setMembers([...members, newMember]);
        setSearchQuery('');
    };

    const handleRemoveMember = (id: number) => {
        if (members.find(m => m.id === id)?.isAdmin) return;
        setMembers(members.filter(m => m.id !== id));
    };

    const goBack = () => navigate(-1);

    return {
        groupName,
        setGroupName,
        groupDesc,
        setGroupDesc,
        searchQuery,
        setSearchQuery,
        members,
        handleCreateGroup,
        handleAddMember,
        handleRemoveMember,
        goBack
    };
};
