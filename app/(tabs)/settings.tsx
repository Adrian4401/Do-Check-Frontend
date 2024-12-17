import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const apiUrl = process.env.EXPO_PUBLIC_API_URL

export default function Settings() {
  const colorScheme = useColorScheme();

  const logout = async () => {
    await AsyncStorage.removeItem("Token");
  }

  const deleteAllTasks = async () => {
    try {
      const response = await axios.put(`${apiUrl}/database/delete-everything`);
      if(response.status === 200) {
        console.log('Udalo sie usunac wszystkie zadania!');
      }
    } catch(error) {
      console.log('Nie udalo sie usunac zadan: ', error);
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Ionicons size={250} name="settings-sharp" style={styles.headerImage} />
      }>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Ustawienia</ThemedText>
      </ThemedView>

      <TouchableOpacity onPress={deleteAllTasks} style={{...styles.styledButton, backgroundColor: Colors[colorScheme ?? 'light'].inputBg}}>
        <MaterialIcons name="delete" size={30} color={Colors[colorScheme ?? 'light'].primary} />
        <Text style={styles.styledButtonText}>Usuń wszystkie dane</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={{...styles.styledButton, backgroundColor: Colors[colorScheme ?? 'light'].inputBg}}>
        <MaterialIcons name="logout" size={30} color={Colors[colorScheme ?? 'light'].primary} />
        <Text style={styles.styledButtonText}>Wyloguj się</Text>
      </TouchableOpacity>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  styledButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10,
    borderRadius: 5,
    padding: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  styledButtonText: {
    fontSize: 17,
    fontWeight: 500
  }
});
