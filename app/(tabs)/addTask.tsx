import { StyleSheet, TextInput, View, Text, TouchableOpacity, Image } from 'react-native';
import { useEffect, useState } from 'react';

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
import { useNavigation } from 'expo-router';
import moment from 'moment';



const data = [
  { label: 'Codziennie', value: '1' },
  { label: 'Co tydzień', value: '2' },
  { label: 'Co miesiąc', value: '3' },
  { label: 'Brak', value: '4' },
];

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    date: new Date(),
    desc: ''
  })

  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<{ uri: string; name: string } | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const clearImage = () => {
    setImage(null);
  }

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    console.log(result);
  
    if (!result.canceled) {
      setFile({uri: result.assets[0].uri, name: result.assets[0].name});
    }
  };

  const clearFile = () => {
    setFile(null);
  }

  // Leave UTC format, change when is readed from DB
  // console.log('Local Date:', localDate.format());

  const handleSubmit = async () => {
    const formattedDate = moment(form.date).format('YYYY-MM-DD');

    try {
      const response = await axios.post(`http://172.20.10.5:3000/task/add-task`, {
        User_ID: 1,
        Task_title: form.title,
        Task_due_date: formattedDate,
        Task_desc: form.desc,
        Task_refresh: false,
        Task_refresh_rate: null
      });
      if (response.status === 200) {
        console.log('Udalo sie dodac zadanie!')
        navigation.goBack();
      }
    } catch (error) {
      console.log('Nie udalo sie dodac zadania -> ', error)
      console.log('Dane: title: ', form.title, 'date: ', form.date)
    }
  }

  useEffect(() => {
    console.log('Wybrana data i godzina: ', form.date)
  })

  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#655ff0', dark: '#655ff0' }}
      headerImage={<Ionicons size={310} name="add" style={{...styles.headerImage, color: Colors[colorScheme ?? 'light'].secondary}} />}>
      
      <ThemedView style={styles.titleContainer}>
        <GoBackBtn />
        <ThemedText type="title">Dodaj zadanie</ThemedText>
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
          <TouchableOpacity onPress={pickDocument} style={styles.typeBtn}>
            <Ionicons name="document-attach" size={24} color="black" />
            <Text style={styles.attachLabel}>Dodaj załączniki</Text>
          </TouchableOpacity>
          <View style={{...styles.line, backgroundColor: Colors[colorScheme ?? 'light'].primary}} />
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
                <Text style={{...styles.themedText, marginTop: 0, color: Colors[colorScheme ?? 'light'].text}}>Wybrane zdjęcia</Text>
                <Text onPress={clearImage} style={{...styles.clearBtn, color: Colors[colorScheme ?? 'light'].text}}>Wyczyść</Text>
              </View>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          </>
        }

        <TouchableOpacity onPress={handleSubmit} style={{...styles.addBtn, backgroundColor: Colors[colorScheme ?? 'light'].primary}}>
          <Text style={{...styles.addBtnText, color: Colors[colorScheme ?? 'light'].lightText}}>Dodaj</Text>
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
