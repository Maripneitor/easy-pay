import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Image, Dimensions } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function OCRScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedImage, setScannedImage] = useState<string | null>(null);
    const cameraRef = useRef<any>(null);

    useEffect(() => {
        let timer: any;
        if (isScanning) {
            timer = setTimeout(() => {
                setIsScanning(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [isScanning]);

    if (!permission) {
        return <View className="flex-1 bg-[#0f172a]" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-[#0f172a] items-center justify-center p-10">
                <View className="w-20 h-20 bg-blue-500/10 rounded-full items-center justify-center mb-8">
                    <MaterialIcons name="videocam-off" size={40} color="#3b82f6" />
                </View>
                <Text className="text-white text-2xl font-black text-center mb-4">Acceso a Cámara</Text>
                <Text className="text-slate-400 text-center text-base leading-6 mb-10">Necesitamos permiso para usar la cámara y así poder escanear tus tickets de forma automática.</Text>
                <Pressable 
                    onPress={requestPermission} 
                    className="bg-blue-600 px-10 py-5 rounded-2xl shadow-2xl shadow-blue-500/40 w-full"
                >
                    <Text className="text-white font-black text-center">CONCEDER PERMISO</Text>
                </Pressable>
                <Pressable onPress={() => router.back()} className="mt-6 py-2">
                    <Text className="text-slate-500 font-bold">Ahora no</Text>
                </Pressable>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({ 
                    quality: 0.8,
                    base64: true,
                    exif: false
                });
                setScannedImage(photo.uri);
                setIsScanning(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            {!scannedImage ? (
                <CameraView 
                    style={StyleSheet.absoluteFill} 
                    ref={cameraRef}
                    facing="back"
                >
                    <SafeAreaView className="flex-1 justify-between p-6" edges={['top', 'bottom']}>
                        <View className="flex-row justify-between items-center mt-4">
                            <Pressable onPress={() => router.back()} className="w-12 h-12 bg-black/50 rounded-full items-center justify-center border border-white/10">
                                <MaterialIcons name="close" size={28} color="white" />
                            </Pressable>
                            <View className="bg-black/50 px-5 py-2.5 rounded-full border border-white/20">
                                <Text className="text-white text-[10px] font-black tracking-[2px] uppercase">AI Scanner Pro</Text>
                            </View>
                            <View className="w-12 h-12 bg-black/50 rounded-full items-center justify-center border border-white/10">
                                <MaterialIcons name="flash-on" size={24} color="#fbbf24" />
                            </View>
                        </View>

                        <View className="items-center">
                            {/* Viewfinder Frame */}
                            <View 
                                style={{ width: width * 0.7, height: height * 0.45 }}
                                className="border-2 border-white/20 rounded-[40px] items-center justify-center relative bg-white/5"
                            >
                                <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-[30px]" />
                                <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-[30px]" />
                                <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-[30px]" />
                                <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-[30px]" />
                                
                                <View className="w-full h-1 bg-blue-500/50 absolute shadow-glow" />
                            </View>
                            <View className="bg-blue-600/80 mt-10 px-6 py-3 rounded-2xl">
                                <Text className="text-white font-black text-xs tracking-widest uppercase">Detectando Recibo...</Text>
                            </View>
                        </View>

                        <View className="items-center mb-8">
                            <Pressable 
                                onPress={takePicture}
                                className="w-24 h-24 rounded-full border-4 border-white items-center justify-center bg-black/20"
                            >
                                <View className="w-18 h-18 rounded-full bg-white items-center justify-center shadow-2xl">
                                    <View className="w-16 h-16 rounded-full border-2 border-slate-200" />
                                </View>
                            </Pressable>
                            <Text className="text-white/60 text-[10px] font-black tracking-widest uppercase mt-4">Capturar para Procesar</Text>
                        </View>
                    </SafeAreaView>
                </CameraView>
            ) : (
                <View className="flex-1 bg-[#0f172a]">
                    <Image source={{ uri: scannedImage }} className="flex-1 opacity-60" resizeMode="cover" />
                    
                    {isScanning ? (
                        <View className="absolute inset-0 items-center justify-center bg-black/40 backdrop-blur-xl">
                            <View className="bg-slate-900/80 p-10 rounded-[50px] items-center border border-white/10 shadow-2xl">
                                <ActivityIndicator size="large" color="#3b82f6" />
                                <Text className="text-white text-xl font-black mt-8 text-center uppercase tracking-[3px]">Analizando</Text>
                                <Text className="text-slate-400 text-sm mt-3 text-center leading-5 px-4 font-medium italic">Nuestra IA está extrayendo productos, precios e impuestos...</Text>
                                
                                <View className="flex-row gap-1 mt-6">
                                    {[0, 1, 2].map(i => (
                                        <View key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    ))}
                                </View>
                            </View>
                        </View>
                    ) : (
                        <SafeAreaView className="absolute inset-0 justify-end p-6" edges={['bottom']}>
                            <View className="bg-slate-900 border border-white/10 rounded-[45px] p-10 shadow-2xl">
                                <View className="flex-row items-center gap-5 mb-8">
                                    <View className="w-16 h-16 bg-emerald-500/10 rounded-3xl items-center justify-center border border-emerald-500/20">
                                        <MaterialIcons name="auto-awesome" size={32} color="#10b981" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-black text-2xl tracking-tighter">Lectura Éxitosa</Text>
                                        <Text className="text-slate-400 text-sm font-bold opacity-70">12 ITEMS IDENTIFICADOS</Text>
                                    </View>
                                </View>
                                
                                <View className="bg-white/5 rounded-3xl p-6 mb-10 border border-white/5">
                                    <View className="flex-row justify-between mb-4">
                                        <Text className="text-slate-400 font-bold">Subtotal</Text>
                                        <Text className="text-white font-black">$1,250.00</Text>
                                    </View>
                                    <View className="flex-row justify-between pt-4 border-t border-white/5">
                                        <Text className="text-slate-400 font-bold text-lg">Total Ticket</Text>
                                        <Text className="text-emerald-400 font-black text-2xl">$1,450.00</Text>
                                    </View>
                                </View>

                                <View className="gap-4">
                                    <Pressable 
                                        onPress={() => router.replace('/ocr-review')}
                                        className="bg-blue-600 py-6 rounded-[25px] items-center shadow-2xl shadow-blue-500/40 active:scale-95"
                                    >
                                        <Text className="text-white font-black text-lg">REVISAR RESULTADOS</Text>
                                    </Pressable>
                                    
                                    <Pressable 
                                        onPress={() => setScannedImage(null)}
                                        className="py-4 items-center bg-white/5 rounded-2xl border border-white/10"
                                    >
                                        <Text className="text-white font-black text-xs tracking-widest">DESCARTAR Y REPETIR</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </SafeAreaView>
                    )}
                </View>
            )}
        </View>
    );
}
