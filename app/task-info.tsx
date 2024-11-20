import { StyleSheet, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Entypo from '@expo/vector-icons/Entypo';
import GoBackBtn from '@/components/buttons';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router/build/hooks';
import axios, { AxiosError } from 'axios';
import { useNavigation } from 'expo-router';
import moment from 'moment';



const apiUrl = process.env.EXPO_PUBLIC_API_URL

interface Task {
  Task_ID: number;
  User_ID: number;
  Task_title: string;
  Task_due_date: string;
  Task_desc: string
}

export default function TaskInfo() {
  const navigation = useNavigation()

  const params = useSearchParams();
  const taskID = params.get('Task_ID');

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  const fetchTask = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/select-task`, {
        params: {
          Task_ID: taskID
        }
      });
      
      if (response.status === 200) {
        setTask(response.data[0]);
        setLoading(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError

      if(axiosError.response && axiosError.response.status === 404) {
        setLoading(false);
      } else {
        console.error('Nie udało się pobrać danych: ', axiosError.message);
      }
    }
  };
  
  useEffect(() => {
    if (taskID) {
      fetchTask();
    }
  }, [taskID]);

  useEffect(() => {
    console.log(task);
  }, [task]);


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Entypo size={200} name="info" style={styles.headerImage} />
      }>

      <ThemedView style={styles.titleContainer}>
        <GoBackBtn />
        <ThemedText type="title">Informacje</ThemedText>
      </ThemedView>

      {loading ? (
      <Text>Ładowanie...</Text>
      ) : task && (
        <>
          <Text>Przekazane ID: {taskID}</Text>
          <Text>ID zadania: {task.Task_ID}</Text>
          <Text>Tytuł: {task.Task_title}</Text>
          <Text>Termin: {moment(task.Task_due_date).format('DD.MM.YYYY')}</Text>
          <Text>ID Użytkownika: {task.User_ID}</Text>
          <Text>Opis: {task.Task_desc}</Text>
        </>
      )}
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -30,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 20,
  },
});
