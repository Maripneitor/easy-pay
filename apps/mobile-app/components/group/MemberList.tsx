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
            className="gap-y-4 px-5 pt-4"
        >
            {members.map((m) => (
                <View 
                    key={m.id} 
                    style={{ backgroundColor: theme.card, borderColor: theme.border }} 
                    className="rounded-[2rem] p-5 border shadow-sm"
                >
                    <View className="flex-row items-center gap-4">
                        {m.isMe ? (
                            <View 
                                style={{ backgroundColor: theme.primary + '25' }} 
                                className="w-14 h-14 rounded-full items-center justify-center border-2"
                                style={{ borderColor: theme.primary + '40', backgroundColor: theme.primary + '15' }}
                            >
                                <Text style={{ color: theme.primary, fontSize: 16 * fontScale }} className="font-black">TÚ</Text>
                            </View>
                        ) : (
                            <Image 
                                source={{ uri: m.avatar }} 
                                className="w-14 h-14 rounded-full border-2" 
                                style={{ borderColor: theme.border + '30' }}
                            />
                        )}
                        <View className="flex-1">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text style={{ color: theme.text, fontSize: 17 * fontScale }} className="font-bold">{m.name}</Text>
                                <View 
                                    className={`px-3 py-1 rounded-full ${m.isMe ? 'bg-emerald-500/15' : m.paidBgClass || 'bg-blue-500/15'}`}
                                >
                                    <Text className={`text-[10px] font-black uppercase tracking-widest ${m.isMe ? 'text-emerald-500' : m.paidTextClass || 'text-blue-500'}`}>
                                        {m.paidText}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ color: theme.textSecondary, fontSize: 13 * fontScale }} className="font-semibold opacity-80">
                                {m.pendingText}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="mt-5">
                        <View style={{ backgroundColor: theme.cardSecondary }} className="w-full rounded-full h-2 overflow-hidden shadow-inner">
                            <MotiView 
                                from={{ width: '0%' }}
                                animate={{ width: `${m.progress}%` }}
                                transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 200 }}
                                style={{ backgroundColor: m.progressColor }} 
                                className="h-full rounded-full" 
                            />
                        </View>
                        <View className="flex-row justify-between mt-2.5 px-1">
                            <Text style={{ color: theme.textSecondary, fontSize: 10 * fontScale }} className="uppercase tracking-[0.15em] font-black opacity-60">
                                Progreso de cuota
                            </Text>
                            <Text style={{ color: theme.text, fontSize: 11 * fontScale }} className="font-black">
                                {m.progress}%
                            </Text>
                        </View>
                    </View>
                </View>
            ))}
        </MotiView>
    );
};
