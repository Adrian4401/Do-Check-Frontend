import { Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useNavigation } from 'expo-router';
import moment from 'moment';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';


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
  const colorScheme = useColorScheme();
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
      <ThemedText type="title">Wszystkie zadania!</ThemedText>

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
