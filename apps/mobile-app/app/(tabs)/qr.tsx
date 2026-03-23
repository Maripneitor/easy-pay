import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { MotiView } from 'moti';
import { useTheme } from '../../src/infrastructure/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function QRScreen() {
    const { theme, fontScale } = useTheme();
    const router = useRouter();
    const [code, setCode] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header */}
            <View className="px-6 py-6 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={{ color: theme.text, fontSize: 18 * fontScale }} className="font-black">Unirse a Mesa</Text>
                <View className="w-6" />
            </View>

            <View className="flex-1 items-center justify-center px-10">
                {/* QR Scanner Mockup */}
                <View className="relative items-center justify-center mb-12">
                    <MotiView 
                        animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                            loop: true,
                            duration: 2000,
                            type: 'timing'
                        }}
                        style={{ borderColor: theme.primary }}
                        className="w-64 h-64 border-2 rounded-[40px] border-dashed items-center justify-center"
                    >
                        <MaterialIcons name="qr-code-scanner" size={80} color={theme.primary} />
                    </MotiView>
                    
                    {/* Corners */}
                    <View style={styles.cornerTL} className="border-t-4 border-l-4 rounded-tl-3xl absolute -top-2 -left-2 w-12 h-12" />
                    <View style={styles.cornerTR} className="border-t-4 border-r-4 rounded-tr-3xl absolute -top-2 -right-2 w-12 h-12" />
                    <View style={styles.cornerBL} className="border-b-4 border-l-4 rounded-bl-3xl absolute -bottom-2 -left-2 w-12 h-12" />
                    <View style={styles.cornerBR} className="border-b-4 border-r-4 rounded-br-3xl absolute -bottom-2 -right-2 w-12 h-12" />
                </View>

                <Text style={{ color: theme.textSecondary, fontSize: 12 * fontScale }} className="text-center font-bold mb-10 px-6 leading-5">
                    Apunta con tu cámara al código QR de la mesa o ingresa el código manual abajo.
                </Text>

                {/* Manual Code Input */}
                <View style={{ backgroundColor: theme.cardSecondary, borderColor: theme.border }} className="w-full flex-row items-center px-6 py-4 rounded-[24px] border border-dashed">
                    <MaterialIcons name="tag" size={20} color={theme.primary} className="mr-3" />
                    <TextInput 
                        placeholder="CÓDIGO DE 6 DÍGITOS"
                        placeholderTextColor={theme.textSecondary + '80'}
                        value={code}
                        onChangeText={setCode}
                        className="flex-1 font-black text-white uppercase tracking-[4px]"
                        maxLength={6}
                    />
                </View>

                <TouchableOpacity 
                    onPress={() => router.push('/new-mesa')}
                    style={{ backgroundColor: code.length === 6 ? theme.primary : theme.glassBg }}
                    className="w-full py-5 rounded-[24px] items-center mt-6 shadow-xl shadow-blue-500/10"
                >
                    <Text style={{ color: code.length === 6 ? 'black' : theme.textSecondary }} className="font-black uppercase tracking-[4px]">Unirse Ahora</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cornerTL: { borderColor: '#3b82f6' },
    cornerTR: { borderColor: '#3b82f6' },
    cornerBL: { borderColor: '#3b82f6' },
    cornerBR: { borderColor: '#3b82f6' },
});
