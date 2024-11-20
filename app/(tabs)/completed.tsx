import { StyleSheet, useColorScheme, Text, TouchableOpacity, ImageBackground, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import { Colors } from '@/constants/Colors';
import { EmptySection } from '@/components/emptySection';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const apiUrl = process.env.EXPO_PUBLIC_API_URL

interface Task {
  Task_ID: number;
  User_ID: number;
  Task_title: string;
  Task_due_date: string;
}

export default function Completed() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksInfo, setTasksInfo] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/select-completed-tasks/`);
      
      if (response.status === 200) {
        setTasks(response.data);
        setLoading(false);
      }
      if (response.status === 404) {
        setLoading(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError

      if(axiosError.response && axiosError.response.status === 404) {
        setLoading(false);
        setTasksInfo(true)
      } else {
        console.error('Nie udało się pobrać danych: ', axiosError.message);
      }
    }
  };
  
  useEffect(() => {
    if(tasks === null){
      fetchTasks();
    }
    else{
      const unsubscribe = navigation.addListener('focus', () => {
        fetchTasks();
      });
  
      return unsubscribe;
    }
  }, [navigation]);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<MaterialIcons name="task-alt" size={250} style={styles.headerImage} />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Wykonane</ThemedText>
      </ThemedView>
      
      {loading ? (
        <Text>Ładowanie...</Text>
      ) : (
        tasks.map((task) => {
          const formattedDate = moment(task.Task_due_date).format('DD.MM.YYYY');
          return(
            <TouchableOpacity key={task.Task_ID}>
              <ImageBackground
                source={require('../../assets/images/sticky-note.png')}
                resizeMode='contain'
                style={styles.stickynote}
              >
                <View style={styles.taskTitleView}>
                  <Text style={styles.taskTitle}>{task.Task_title}</Text>
                </View>
                <Text style={{...styles.taskDate, color: Colors[colorScheme ?? 'light'].darkText, shadowColor: Colors[colorScheme ?? 'light'].inputBg}}>{formattedDate}</Text>
              </ImageBackground>
            </TouchableOpacity>
          )
        })
      )}

      {tasksInfo && tasks && (
        <EmptySection />
      )}

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

  stickynote: {
    flex: 1,
    height: 150,
    paddingLeft: 35,
    paddingRight: 30,
    paddingTop: 70,
    paddingBottom: 5,
    justifyContent: 'space-between',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 5,
      width: 5
    }
  },
  taskTitleView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskTitle: {
    fontSize: 18
  },
  taskDate: {
    textAlign: 'right'
  }
});
