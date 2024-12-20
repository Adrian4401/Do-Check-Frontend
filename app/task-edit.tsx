import { StyleSheet, TextInput, View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import GoBackBtn from '@/components/buttons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

import Ionicons from '@expo/vector-icons/Ionicons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';
import { useRouter } from 'expo-router';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSearchParams } from 'expo-router/build/hooks';



const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const data = [
  { label: 'Codziennie', value: '1' },
  { label: 'Co tydzień', value: '7' },
  { label: 'Co miesiąc', value: '30' },
  { label: 'Brak', value: '0' },
];

export default function taskEdit() {
  const router = useRouter();
  const params = useSearchParams();
  const taskID = parseInt(params.get('Task_ID') || '0', 10);
  const colorScheme = useColorScheme();
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [form, setForm] = useState({
    title: '',
    date: new Date(),
    desc: ''
  })
  const [file, setFile] = useState<{ 
    uri: string; 
    name: string 
    } | null>(null);
  const [image, setImage] = useState<Blob | null>(null);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [imageName, setImageName] = useState<string | undefined>(undefined);
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
  
    if (!result.canceled && result.assets) {
      setImage(null);
      setImageUri(undefined);
      setImageName(undefined);
      const uri = result.assets[0].uri;
      const name = uri.split('/').pop() || 'default.jpg';
      const blob = await fetch(uri).then(res => res.blob());
      setImage(blob);
      setImageName(name);
      setImageUri(uri);
      console.log(uri);
    }
  };

  const clearImage = () => {
    setImage(null);
  }

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: 'application/pdf'
    });

    console.log(result);
  
    if (!result.canceled) {
      setFile({uri: result.assets[0].uri, name: result.assets[0].name});
    }
  };

  const clearFile = () => {
    setFile(null);
  }

  const handleSubmit = async () => {
    const formattedDate = moment(form.date).format('YYYY-MM-DD');
    const formData = new FormData();

    const storedUserID = await AsyncStorage.getItem("UserID");
    const userID = storedUserID ? JSON.parse(storedUserID).id : null;
    if (!userID) {
      console.log('Brak poprawnego UserID!');
      return;
    }
  
    formData.append('Task_ID', taskID.toString() || '');
    formData.append('Title', form.title);
    formData.append('Due_date', formattedDate);
    formData.append('Descript', form.desc || '');
    formData.append('Refresh_rate', value || '0');

    if (image) {
			// @ts-ignore
			formData.append('file', {
				uri: imageUri,
				name: imageName,
				type: 'image/jpeg',
			})
		}

    formData.forEach((value, key) => {
      if (value instanceof Blob) {
        console.log(`${key}: [Blob]`, value);
      } else {
        console.log(`${key}:`, value);
      }
    });

    console.log('image', image)

    try {
      const response = await axios.put(`${apiUrl}/task/update-task-experiment/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status === 200) {
        console.log('Udało się edytowac zadanie! ', formData);
        router.replace('/(tabs)');
      } else {
        console.log('Nieoczekiwany status odpowiedzi:', response.status);
      }
    } catch (error) {
      console.log('Nie udało się edytowac zadania -> ', error);
      console.log('Dane wysyłane:', formData);
    }
  };
  
  useEffect(() => {
    console.log('Wybrana data i godzina: ', form.date)
  })

  const fetchTask = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/select-task`, {
        params: {
          Task_ID: taskID
        }
      });
      if (response.status === 200 && response.data.length > 0) {
        const taskData = response.data[0];
        console.log(taskData);
        setForm({
            title: taskData.Title || '',
            date: taskData.Due_date ? new Date(taskData.Due_date) : new Date(),
            desc: taskData.Descript || ''
        })
        setImageName(taskData.Name);
        setImageUri(taskData.Path);
        setImage(taskData.Path);
      }
    } catch (error) {
      console.log('Blad wypisywania zadania: ', error);
    }
  };
  
  useEffect(() => {
    if (taskID) {
      fetchTask();
    }
  }, [taskID]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#655ff0', dark: '#655ff0' }}
      headerImage={<Ionicons size={310} name="add" style={{...styles.headerImage, color: Colors[colorScheme ?? 'light'].secondary}} />}>
      
      <ThemedView style={styles.titleContainer}>
        <GoBackBtn />
        <ThemedText type="title">Edytuj zadanie</ThemedText>
      </ThemedView>
      
      <View style={styles.basicInfo}>
        <TextInput
          style={{
            ...styles.inputControl, 
            backgroundColor: Colors[colorScheme ?? 'light'].inputBg, 
            color: Colors[colorScheme ?? 'light'].text,
            borderBottomColor: Colors[colorScheme ?? 'light'].primary,
            
          }}
          autoCapitalize='none'
          autoCorrect={true}
          placeholder='Wpisz tytuł zadania...'
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          value={form.title}
          onChangeText={title => setForm({...form, title})}
          maxLength={60}
        />
        <RNDateTimePicker
          mode='date'
          display='spinner'
          locale="pl-PL"
          minuteInterval={5}
          value={form.date}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setForm({...form, date: selectedDate});
            }
          }}
        />
      </View>

      <Text style={{...styles.themedText, color: Colors[colorScheme ?? 'light'].text}}>Dodatkowe informacje</Text>

      <View style={styles.additionalInfo}>
        <TextInput
          style={{
            ...styles.descInput, 
            backgroundColor: Colors[colorScheme ?? 'light'].inputBg, 
            color: Colors[colorScheme ?? 'light'].text,
            borderBottomColor: Colors[colorScheme ?? 'light'].primary,
            borderColor: Colors[colorScheme ?? 'light'].inputBg,
          }}
          autoCapitalize='none'
          autoCorrect={true}
          numberOfLines={10}
          placeholder='Dodaj opis...'
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          value={form.desc}
          onChangeText={desc => setForm({...form, desc})}
        />
        <Dropdown
          style={{
            ...styles.dropdown,
            ...isFocus && { borderColor: Colors[colorScheme ?? 'light'].primary },
            borderColor: Colors[colorScheme ?? 'light'].inputBg,
            backgroundColor: Colors[colorScheme ?? 'light'].inputBg,
            borderBottomColor: Colors[colorScheme ?? 'light'].primary
          }}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Powtarzaj' : '...'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
        />
        <TouchableOpacity style={{
            ...styles.attachBtn,
            borderColor: Colors[colorScheme ?? 'light'].inputBg,
            backgroundColor: Colors[colorScheme ?? 'light'].inputBg,
            borderBottomColor: Colors[colorScheme ?? 'light'].primary
          }}>
          {/* <TouchableOpacity onPress={pickDocument} style={styles.typeBtn}>
            <Ionicons name="document-attach" size={24} color="black" />
            <Text style={styles.attachLabel}>Dodaj załączniki</Text>
          </TouchableOpacity>
          <View style={{...styles.line, backgroundColor: Colors[colorScheme ?? 'light'].primary}} /> */}
          <TouchableOpacity onPress={pickImage} style={styles.typeBtn}>
            <Ionicons name="image" size={24} color="black" />
            <Text style={styles.attachLabel}>Dodaj zdjęcia</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {file && 
          <>
            <View style={styles.attachContainer}>
              <View style={styles.attachHeader}>
                <Text style={{...styles.themedText, marginTop: 0, color: Colors[colorScheme ?? 'light'].text}}>Wybrane załączniki</Text>
                <Text onPress={clearFile} style={{...styles.clearBtn, color: Colors[colorScheme ?? 'light'].text}}>Wyczyść</Text>
              </View>
              <View style={{...styles.fileContainer, backgroundColor: Colors[colorScheme ?? 'light'].inputBg}}>
                <Ionicons name="document-attach" size={24} color="black" />
                <Text style={{...styles.attachLabel, color: Colors[colorScheme ?? 'light'].text}}>{ file.name }</Text>                 
              </View>
            </View>
          </>
        }

        {image && 
          <>
            <View style={styles.attachContainer}>
              <View style={styles.attachHeader}>
                <Text style={{...styles.themedText, marginTop: 0, color: Colors[colorScheme ?? 'light'].text}}>Wybrane zdjęcie</Text>
                <Text onPress={clearImage} style={{...styles.clearBtn, color: Colors[colorScheme ?? 'light'].text}}>Wyczyść</Text>
              </View>
              <Image 
                source={{ 
                  // uri: `${apiUrl}/${imageUri?.replace('\\', '/')}` 
                  uri: imageUri?.startsWith('file://') ? imageUri : `${apiUrl}/${imageUri?.replace('\\', '/')}`
                }} 
                style={styles.image} />
            </View>
          </>
        }

        <TouchableOpacity onPress={handleSubmit} style={{...styles.addBtn, backgroundColor: Colors[colorScheme ?? 'light'].primary}}>
          <Text style={{...styles.addBtnText, color: Colors[colorScheme ?? 'light'].lightText}}>Edytuj</Text>
        </TouchableOpacity>

      </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  inputControl: {
    height: 44,
    fontSize: 18,
    fontWeight: 500,
    borderBottomWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 5
  },
  descInput: {
    height: 50,
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 2
  },
  basicInfo: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20
  },
  additionalInfo: {
    flexDirection: 'column',
    gap: 15,
    marginTop: 10,
    marginBottom: 400
  },
  themedText: {
    fontSize: 20,
    fontWeight: 700,
    marginTop: 10
  },

  dropdown: {
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 5,
    borderWidth: 2,
    justifyContent: 'center',
    gap: 15
  },
  attachLabel: {
    fontSize: 16
  },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    gap: 10,
    height: 44,
  },
  clearBtn: {
    fontSize: 16
  },
  line: {
    width: 2,
    height: 30
  },

  image: {
    height: 200,
    borderRadius: 15
  },
  attachContainer: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20
  },
  attachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  fileContainer: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },

  addBtn: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 50
  },
  addBtnText: {
    fontSize: 20,
    fontWeight: 600
  }
});
