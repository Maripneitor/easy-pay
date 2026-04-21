import React from 'react';
import { View, Text, Image } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';

interface Member {
    id: string;
    name: string;
    avatar: string;
    isMe: boolean;
    paid: number;
    due: number;
    progress: number;
    progressColor: string;
    paidText: string;
    pendingText: string;
    paidTextClass?: string;
    paidBgClass?: string;
}

interface MemberListProps {
    members: Member[];
}

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
    const { theme, fontScale } = useTheme();

    return (
        <MotiView 
            from={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            className="gap-y-4 px-6 pt-4"
        >
            {members.map((m) => (
                <View 
                    key={m.id} 
                    style={{ backgroundColor: theme.card, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 }} 
                    className="rounded-2xl p-4 flex-col gap-3"
                >
                    <View className="flex-row items-center gap-4">
                        {m.isMe ? (
                            <View 
                                style={{ backgroundColor: theme.primary + '15' }} 
                                className="w-12 h-12 rounded-full items-center justify-center overflow-hidden"
                            >
                                <Text style={{ color: theme.primary, fontSize: 16 * fontScale }} className="font-black">TÚ</Text>
                            </View>
                        ) : (
                            <Image 
                                source={{ uri: m.avatar }} 
                                className="w-12 h-12 rounded-full object-cover" 
                            />
                        )}
                        <View className="flex-1">
                            <View className="flex-row justify-between items-start">
                                <Text style={{ color: theme.text, fontSize: 16 * fontScale }} className="font-bold">{m.name}</Text>
                                <View className={`px-2 py-0.5 rounded-md ${m.isMe ? 'bg-emerald-50' : (m.paidBgClass ? 'bg-amber-50' : 'bg-emerald-50')}`}>
                                    <Text style={{ fontSize: 12 * fontScale }} className={`font-medium ${m.isMe ? 'text-emerald-600' : (m.paidTextClass || 'text-emerald-600')}`}>
                                        {m.paidText}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="mt-0.5 opacity-70">
                                {m.pendingText}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                        <MotiView 
                            from={{ width: '0%' }}
                            animate={{ width: `${m.progress}%` }}
                            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 200 }}
                            style={{ backgroundColor: m.progressColor }} 
                            className="h-full rounded-full" 
                        />
                    </View>
                    <View className="flex-row justify-between">
                        <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="uppercase tracking-widest font-semibold opacity-60">
                            Progreso de cuota
                        </Text>
                        <Text style={{ color: theme.text, fontSize: 10 * fontScale }} className="font-bold">
                            {m.progress}%
                        </Text>
                    </View>
                </View>
            ))}
        </MotiView>
    );
};
