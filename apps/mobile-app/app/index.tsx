import { Redirect } from 'expo-router';
import { Text } from 'react-native';

export default function IndexPage() {
    // Cambiamos el componente ligeramente para forzar compilación
    console.log("Intentando entrar al login...");
    return <Redirect href="/login" />;
}