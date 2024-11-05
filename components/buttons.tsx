import { useNavigation } from "@react-navigation/native"
import { StyleSheet, TouchableOpacity, Text } from "react-native"

import Ionicons from '@expo/vector-icons/Ionicons';



export default function GoBackBtn() {
    const navigation = useNavigation();

    return(
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.container}>
            <Ionicons name="chevron-back" size={24} color="black" />
            <Text style={styles.text}>Wróć</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2
    },
    text: {
        fontSize: 20
    }
})