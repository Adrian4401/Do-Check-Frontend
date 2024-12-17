import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import React from 'react';
import { router, useNavigation } from 'expo-router';
import moment from 'moment';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { EmptySection } from '@/components/emptySection';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';



const apiUrl = process.env.EXPO_PUBLIC_API_URL

interface Task {
  Task_ID: number;
  User_ID: number;
  Title: string;
  Due_date: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksInfo, setTasksInfo] = useState(false);

  const fetchTasks = async () => {
    setTasks([]);
    try {
      const response = await axios.get(`${apiUrl}/task/select-current-tasks`);
      if (response.status === 200) {
        setTasks(response.data);
        setLoading(false);
        setTasksInfo(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Nie udało się pobrać danych: ', axiosError.message);
      setLoading(false);
      setTasksInfo(true);
    }
    const token = await AsyncStorage.getItem("Token");
    const userId = await AsyncStorage.getItem("UserID");

    console.log("Token: ", token, " | UserID: ", userId);
  };
  
  useEffect(() => {
    const loadData = navigation.addListener('focus', () => {
      fetchTasks()
    })
    return loadData;
  }, [navigation]);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<FontAwesome5 name="tasks" size={250} style={styles.headerImage} />}
      >
      <ThemedText type="title">Zadania</ThemedText>

      {loading ? (
        <Text>Ładowanie...</Text>
      ) : (
        tasks.map((task) => {
          const formattedDate = moment(task.Due_date).format('DD.MM.YYYY');
          return(
            <TouchableOpacity 
              onPress={() => router.push({ 
                pathname: '/task-info', 
                params: { Task_ID: task.Task_ID } 
              })} 
              key={task.Task_ID}
            >
              <ImageBackground
                source={require('../../assets/images/sticky-note.png')}
                resizeMode='contain'
                style={styles.stickynote}
              >
                <View style={styles.taskTitleView}>
                  <Text style={styles.taskTitle}>{task.Title}</Text>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -10,
    position: 'absolute'
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
