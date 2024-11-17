import { View, Text, useColorScheme, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';


export function EmptySection() {
    const colorScheme = useColorScheme()

    return(
        <View style={styles.container}>
            <Ionicons name="file-tray-stacked" size={40} color={Colors[colorScheme ?? 'light'].darkText} />
            <Text style={styles.text}>Brak zadań do wyświetlenia</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        height: 400,
    },
    text: {
        fontSize: 18
    }
})