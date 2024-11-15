import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, useColorScheme, Text, TouchableOpacity, ImageBackground, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import moment from 'moment';
import { Colors } from '@/constants/Colors';


const apiUrl = process.env.EXPO_PUBLIC_API_URL

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

export default function Undone() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/select-failed-tasks/`);
      
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
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Niewykonane</ThemedText>
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
