import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';


interface Task {
  Task_ID: number;
  User_ID: number;
  Task_title: string;
  Task_due_date: string;
  Task_desc: string;
  Task_refresh: boolean;
  Task_refresh_rate: number;
  Task_done: boolean;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://172.20.10.5:3000/task/select-task`);
      
      if (response.status === 200) {
        setTasks(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Nie udało się pobrać danych: ', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if(tasks === null){
      fetchTasks();
    }
    else{
      const unsubscribe = navigation.addListener('focus', () => {
        fetchTasks(); // Wywołanie funkcji przy każdym powrocie na ten ekran
      });
  
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  const renderTask = ({ item } : {item: Task}) => (
    <View>
      <Text>Tytuł: {item.Task_title}</Text>
      <Text>Opis: {item.Task_desc}</Text>
      <Text>Termin: {item.Task_due_date}</Text>
    </View>
  );

  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
      >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Wszystkie zadania!</ThemedText>
        <HelloWave />
      </ThemedView>

      {loading ? (
        <Text>Ładowanie...</Text>
      ) : (
        tasks.map((task) => {
          return(
            <View key={task.Task_ID}>
              <Text>Task title: {task.Task_title}</Text>
            </View>
          )
        })
      )}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
