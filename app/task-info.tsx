import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Entypo from '@expo/vector-icons/Entypo';
import GoBackBtn from '@/components/buttons';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'expo-router/build/hooks';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';



const apiUrl = process.env.EXPO_PUBLIC_API_URL

interface Task {
  // Task_ID: number;
  // User_ID: number;
  Title: string;
  Due_date: string;
  Descript: string;
  Name: string | null;
  Path: string | null;
  Type: string | null;
}

export default function TaskInfo() {
  const router = useRouter()
  const colorScheme = useColorScheme()

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

  const completeTask = async () => {
    console.log('Przycisk został wciśnięty');

    try {
      const response = await axios.put(`${apiUrl}/task/complete-task`, {
        Task_ID: taskID
      });
      if (response.status === 200) {
        console.log("Udało się zakończyć")
        router.back()
      }
    } catch (error) {
      const axiosError = error as AxiosError
      console.log('Wystąpił błąd przy kończeniu ogłoszenia')
      if(axiosError.response && axiosError.response.status === 404) {
        console.log('Błąd 404')
      } else {
        console.error('Nie udało się zakończyć zadania: ', axiosError.message);
      }
    }
  };


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Entypo size={200} name="info" style={styles.headerImage} />
      }>

      <ThemedView style={styles.titleContainer}>
        <View style={styles.header}>
          <GoBackBtn />
          <View style={styles.utilityButtons}>
            <TouchableOpacity>
              <MaterialIcons name="delete" size={30} color="#EB2D2D" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/task-form')}>
              <MaterialIcons name="edit" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <ThemedText type="title">{task?.Title}</ThemedText>
      </ThemedView>

      {loading ? (
        <Text>Ładowanie...</Text>
      ) : task && (
        <>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-clear" size={20} color="black" />
            <Text style={styles.taskDate}>{moment(task.Due_date).format('DD.MM.YYYY')}</Text>
          </View>
          {task.Descript ? (
            <Text style={styles.taskDesc}>{task.Descript}</Text>
          ) : (
            <Text style={styles.taskDesc}>Brak opisu</Text>
          )}
          {task.Path && (
            <>
              <Text style={styles.sectionText}>Załączniki</Text>
              <Image
                source={{ uri: `${apiUrl}/${task.Path.replace('\\', '/')}` }} 
                style={styles.attachmentImage}
              />
            </>
          )}
          <TouchableOpacity 
            onPress={completeTask}
            style={{...styles.finishButton, backgroundColor: Colors[colorScheme ?? 'light'].primary}}>
            <Text style={styles.buttonText}>Zakończ</Text>
          </TouchableOpacity>
          
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  utilityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30
  },
  taskDesc: {
    fontSize: 18
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  taskDate: {
    fontSize: 16
  },
  sectionText: {
    fontSize: 20,
    fontWeight: 500,
    marginVertical: 20
  },
  finishButton: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 7,
    marginTop: 20,
    marginBottom: 100
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 500,
    color: 'white'
  },
  attachmentImage: {
    flex: 1,
    aspectRatio: 16/9,
    marginBottom: 10,
  },
});
