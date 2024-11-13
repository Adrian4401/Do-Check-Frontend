import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import axios from 'axios';


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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
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
  
    fetchTasks();
  }, []);

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
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.Task_ID.toString()}
        />
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
