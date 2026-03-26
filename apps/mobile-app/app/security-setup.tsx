import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions, 
    ActivityIndicator, 
    Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function SecuritySetupScreen() {
    const router = useRouter();
    const { userId, email, name } = useLocalSearchParams<{ userId: string, email: string, name: string }>();
    const [loading, setLoading] = useState(false);
    
    // El "truco" local se gestiona vía EXPO_PUBLIC_API_URL en el .env
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

    const handleSendCode = async () => {
        if (!userId) {
            Alert.alert('Error', 'ID de usuario no encontrado. Reintenta el registro.');
            return;
        }

        setLoading(true);
        try {
            // Llamamos al endpoint de setup (como en la web) - DEBE SER POST
            const response = await fetch(`${API_URL}/api/auth/2fa/setup/${userId}`, {
                method: 'POST'
            });
            const data = (await response.json()) as any;

            if (data.status === 'success') {
                // Redirigir a la pantalla de verificación
                router.push({
                    pathname: '/security-2fa',
                    params: { userId, email, name }
                });
            } else {
                Alert.alert('Error', data.message || 'No se pudo enviar el código.');
            }
        } catch (err) {
            console.error('Setup 2FA error:', err);
            Alert.alert('Error', 'Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            <View style={styles.background}>
                <View style={[styles.blob, { top: -100, right: -50, backgroundColor: 'rgba(59, 130, 246, 0.15)' }]} />
                <View style={[styles.blob, { bottom: -100, left: -50, backgroundColor: 'rgba(37, 99, 235, 0.1)' }]} />
            </View>

            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Seguridad Easy-Pay</Text>
                </View>

                {/* Card Container */}
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <MaterialIcons name="security" size={40} color="#60a5fa" />
                        </View>
                    </View>

                    <Text style={styles.title}>Verificación por Correo</Text>
                    <Text style={styles.description}>
                        Para proteger tu cuenta de Easy-Pay, te enviaremos un código de seguridad de 6 dígitos a tu correo registrado.
                    </Text>

                    {/* Email Info Box */}
                    <View style={styles.emailBox}>
                        <View style={styles.emailIconWrapper}>
                            <MaterialIcons name="mail-outline" size={24} color="#60a5fa" />
                        </View>
                        <View style={styles.emailTextWrapper}>
                            <Text style={styles.emailLabel}>Correo de recuperación</Text>
                            <Text style={styles.emailValue}>{email || 'tu@ejemplo.com'}</Text>
                        </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity 
                        onPress={handleSendCode}
                        disabled={loading}
                        style={styles.buttonContainer}
                        activeOpacity={0.8}
                    >
                        <View style={styles.solidButton}>
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>ENVIAR CÓDIGO DE SEGURIDAD</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.protocolText}>Protocolo de Seguridad v4.0 Active</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 Easy-Pay Security Systems. UNACH.</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    blob: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        gap: 16,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    backButton: {
        padding: 4,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 32,
        padding: 32,
        borderWidth: 1,
        borderColor: 'rgba(148, 163, 184, 0.1)',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(96, 165, 250, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    emailBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        borderWidth: 1,
        borderColor: 'rgba(148, 163, 184, 0.1)',
        borderRadius: 20,
        padding: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 32,
    },
    emailIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    emailTextWrapper: {
        flex: 1,
    },
    emailLabel: {
        color: '#64748b',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    emailValue: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    buttonContainer: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
        marginBottom: 24,
    },
    solidButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    protocolText: {
        color: '#60a5fa',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        opacity: 0.6,
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 32,
        alignItems: 'center',
    },
    footerText: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '500',
        letterSpacing: 0.5,
    }
});
