import { StyleSheet, TextInput, View, Text, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import GoBackBtn from '@/components/buttons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

import Ionicons from '@expo/vector-icons/Ionicons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-timezone';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';



export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const [form, setForm] = useState({
    title: '',
    date: new Date(),
    desc: ''
  })

  // Leave UTC format, change when is readed from DB
  // console.log('Local Date:', localDate.format());

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
        />
        <RNDateTimePicker
          mode='datetime'
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

      <Text 
        style={{
          ...styles.themedText,
          color: Colors[colorScheme ?? 'light'].text
        }}
      >Dodatkowe informacje</Text>

      <View style={styles.additionalInfo}>
        <TextInput
          style={{
            ...styles.descInput, 
            backgroundColor: Colors[colorScheme ?? 'light'].inputBg, 
            color: Colors[colorScheme ?? 'light'].text,
            borderBottomColor: Colors[colorScheme ?? 'light'].primary,
            
          }}
          autoCapitalize='none'
          autoCorrect={true}
          numberOfLines={10}
          placeholder='Dodaj opis...'
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          value={form.desc}
          onChangeText={desc => setForm({...form, desc})}
        />
        
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
    borderBottomWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 5
  },
  descInput: {
    height: 44,
    fontSize: 18,
    fontWeight: 500,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginBottom: 400
  },
  basicInfo: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20
  },
  additionalInfo: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 10
  },
  themedText: {
    fontSize: 20,
    fontWeight: 700,
    marginTop: 10
  }
});
