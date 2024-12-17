import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL

const router = useRouter()


// DELETE ONE TASK
export const deleteTaskAlert = (taskID: number) => {
    Alert.alert(
        "Usuwanie zadania",
        "Czy na pewno chcesz usunąć zadanie?",
        [
            { text: "Anuluj", style: "cancel" },
            { text: "Usuń", onPress: () => deleteTask(taskID) }
        ]
    )
} 

const deleteTask = async (taskID: number) => {
    try {
      const response = await axios.put(`${apiUrl}/task/delete-task`, {
        Task_ID: taskID
      });
      if (response.status === 200) {
        console.log("Udało się usunąć")
        router.back()
      }
    } catch (error) {
      const axiosError = error as AxiosError
      if(axiosError.response && axiosError.response.status === 404) {
        console.log('Error 404')
      } else {
        console.error('Nie udało się usunąć zadania: ', axiosError.message);
      }
    }
};

// DELETE ALL TASKS
export const deleteAllTasksAlert = () => {
  Alert.alert(
      "Usuwanie zadań",
      "Czy na pewno chcesz usunąć wszystkie zadania?",
      [
          { text: "Anuluj", style: "cancel" },
          { text: "Usuń", onPress: () => deleteAllTask() }
      ]
  )
} 

const deleteAllTask = async () => {
  try {
    const response = await axios.put(`${apiUrl}/database/delete-everything`);
    if(response.status === 200) {
      console.log('Udalo sie usunac wszystkie zadania!');
    }
  } catch(error) {
    console.log('Nie udalo sie usunac zadan: ', error);
  }
};