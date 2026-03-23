import React, { useState, useCallback } from 'react';
import { 
    ScrollView, 
    View, 
    Text, 
    Pressable, 
    Image, 
    TouchableOpacity, 
    ActivityIndicator,
    Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView, AnimatePresence } from 'moti';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';
import { useNotifications } from '../../src/infrastructure/context/NotificationContext';

const INITIAL_NOTIFICATIONS = [
    {
        id: '1',
        type: 'invitation',
        title: 'Luis te invitó al grupo',
        groupName: 'Viaje a Cancún',
        time: 'Hace 2 horas',
        unread: true,
        userName: 'Luis García',
        avatar: '', // Test empty avatar for initials
        route: '/(tabs)/group/viaje-a-cancun',
    },
    {
        id: '10',
        type: 'expense',
        title: 'Ana te asignó $200.00 por Hamburguesas',
        amount: '$200.00',
        time: '09:15 AM',
        unread: true,
        icon: 'restaurant',
        iconColor: '#fb923c',
        route: '/new-mesa',
    },
    {
        id: '3',
        type: 'payment',
        title: 'Carlos te pagó su parte',
        amount: '+$50.00',
        time: '4:00 PM',
        unread: false,
        icon: 'attach-money',
        iconColor: '#4ade80',
        route: '/expense/receipt/3',
    },
    {
        id: '4',
        type: 'alert',
        title: 'Inicio de sesión detectado en un nuevo dispositivo',
        time: 'Martes, 14:00',
        unread: false,
        icon: 'security',
        iconColor: '#2196F3',
        route: '/settings',
    },
];

const { width } = Dimensions.get('window');

export default function NotificationsScreen() {
    const { theme, fontScale } = useTheme();
    const { setUnreadCount, setHasAlerts } = useNotifications();
    const router = useRouter();
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [acceptedIds, setAcceptedIds] = useState<string[]>([]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const updateContext = (newNotifications: any[]) => {
        const count = newNotifications.filter(n => n.unread).length;
        setUnreadCount(count);
        setHasAlerts(count > 0);
    };

    const handleAccept = (id: string) => {
        setLoadingIds(prev => [...prev, id]);
        setTimeout(() => {
            setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
            setAcceptedIds(prev => [...prev, id]);
            // Mark as read too
            const next = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
            setNotifications(next);
            updateContext(next);
        }, 1500);
    };

    const handleMarkAllRead = () => {
        const next = notifications.map(n => ({ ...n, unread: false }));
        setNotifications(next);
        updateContext(next);
    };

    const removeNotification = (id: string) => {
        const next = notifications.filter(n => n.id !== id);
        setNotifications(next);
        updateContext(next);
    };

    const markAsRead = (id: string) => {
        const next = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
        setNotifications(next);
        updateContext(next);
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const renderCard = (n: any) => {
        const isLoading = loadingIds.includes(n.id);
        const isAccepted = acceptedIds.includes(n.id);

        return (
            <AnimatePresence key={n.id}>
                <MotiView 
                    from={{ opacity: 0, scale: 0.9, height: 100 }}
                    animate={{ opacity: 1, scale: 1, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.8, height: 0 }}
                    transition={{ type: 'timing', duration: 400 }}
                    className="relative mb-4 overflow-hidden"
                >
                    {/* Unread Indicator Bar */}
                    {n.unread && (
                        <MotiView 
                            from={{ opacity: 1, scaleX: 1 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            exit={{ opacity: 0, scaleX: 0 }}
                            style={{ backgroundColor: theme.primary }} 
                            className="absolute z-10 -left-0.5 top-1/2 -translate-y-6 w-1 h-12 rounded-full shadow-lg shadow-pink-500/40"
                        />
                    )}

                    <Pressable 
                        onPress={() => {
                            markAsRead(n.id);
                            if (n.type !== 'invitation' || isAccepted) {
                                router.push(n.route as any);
                            }
                        }}
                        style={{ 
                            backgroundColor: theme.cardSecondary, 
                            borderColor: n.unread ? `${theme.primary}20` : theme.border 
                        }}
                        className="border rounded-[32px] p-5 flex-row gap-4 items-center"
                    >
                        {/* Avatar or Icon */}
                        {n.type === 'invitation' ? (
                            <View className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-700/50 items-center justify-center bg-slate-800">
                                {n.avatar ? (
                                    <Image source={{ uri: n.avatar }} className="w-full h-full" />
                                ) : (
                                    <Text className="text-white font-black text-lg">{getInitials(n.userName || n.title)}</Text>
                                )}
                            </View>
                        ) : (
                            <View 
                                className="w-14 h-14 rounded-[22px] items-center justify-center" 
                                style={{ 
                                    backgroundColor: `${n.iconColor}15`, 
                                    borderWidth: 1, 
                                    borderColor: `${n.iconColor}30` 
                                }}
                            >
                                <MaterialIcons name={n.icon as any} size={28} color={n.iconColor} />
                            </View>
                        )}

                        {/* Content */}
                        <View className="flex-1">
                            {isAccepted ? (
                                <MotiView 
                                    from={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex-row items-center gap-2"
                                >
                                    <View className="bg-emerald-500/10 p-1 rounded-full">
                                        <MaterialIcons name="check-circle" size={16} color="#4ade80" />
                                    </View>
                                    <Text style={{ color: '#4ade80' }} className="font-black text-sm uppercase tracking-widest">¡Te uniste al grupo!</Text>
                                </MotiView>
                            ) : (
                                <>
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1">
                                            <Text style={{ fontSize: 13 * fontScale, color: theme.text }} className="font-bold leading-tight">
                                                {n.title}
                                            </Text>
                                            <Text className="text-slate-500 text-[10px] mt-1 font-black uppercase tracking-widest">{n.time}</Text>
                                        </View>
                                        
                                        {(n.type === 'alert' || n.unread) && (
                                            <TouchableOpacity onPress={() => removeNotification(n.id)} className="ml-2 bg-white/5 p-1.5 rounded-full">
                                                <MaterialIcons name="close" size={14} color={theme.textSecondary} />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {n.type === 'invitation' && (
                                        <View className="flex-row gap-3 mt-4">
                                            <TouchableOpacity 
                                                onPress={() => handleAccept(n.id)}
                                                disabled={isLoading}
                                                style={{ backgroundColor: theme.primary }} 
                                                className="px-6 py-2.5 rounded-2xl shadow-lg active:scale-95 flex-row items-center justify-center gap-2 min-w-[100px]"
                                            >
                                                {isLoading ? (
                                                    <ActivityIndicator size="small" color="white" />
                                                ) : (
                                                    <Text className="text-white font-black text-[10px] uppercase">Aceptar</Text>
                                                )}
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress={() => removeNotification(n.id)}
                                                className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl active:bg-white/10"
                                            >
                                                <Text className="text-slate-400 font-bold text-[10px] uppercase">Rechazar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    </Pressable>
                </MotiView>
            </AnimatePresence>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
            <StatusBar style={theme.isDark ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View style={{ borderColor: theme.border }} className="px-6 py-6 flex-row justify-between items-center bg-transparent">
                <View className="flex-row items-center gap-3">
                    <Text style={{ fontSize: 12 * fontScale, color: theme.text }} className="font-black tracking-[4px]">ALERTAS</Text>
                    {unreadCount > 0 && (
                        <MotiView 
                            from={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            style={{ backgroundColor: theme.primary }} 
                            className="px-2.5 py-0.5 rounded-full shadow-lg shadow-pink-500/20"
                        >
                            <Text className="text-white text-[10px] font-black">{unreadCount}</Text>
                        </MotiView>
                    )}
                </View>
                <TouchableOpacity onPress={handleMarkAllRead}>
                    <Text style={{ fontSize: 11 * fontScale, color: theme.primary }} className="font-black uppercase tracking-wider">Marcar todas</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                {notifications.length > 0 ? (
                    <View className="mt-4">
                        {notifications.map(n => renderCard(n))}
                    </View>
                ) : (
                    <View className="items-center justify-center py-20 opacity-40">
                        <View className="bg-slate-800/50 w-20 h-20 rounded-full items-center justify-center mb-6">
                            <MaterialIcons name="notifications-none" size={40} color={theme.textSecondary} />
                        </View>
                        <Text style={{ color: theme.text }} className="font-black text-center mb-1">Todo al día</Text>
                        <Text style={{ color: theme.textSecondary }} className="text-center font-bold text-xs px-10">No tienes notificaciones pendientes.</Text>
                    </View>
                )}

                {/* Footer Empty State */}
                {notifications.length > 0 && (
                    <View className="items-center py-10 opacity-30 relative">
                        <View style={{ backgroundColor: theme.border }} className="h-[1px] w-full absolute top-1/2" />
                        <View style={{ backgroundColor: theme.bg }} className="px-4">
                            <Text style={{ fontSize: 9 * fontScale }} className="text-slate-500 font-black uppercase tracking-widest text-center">Fin del historial</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

