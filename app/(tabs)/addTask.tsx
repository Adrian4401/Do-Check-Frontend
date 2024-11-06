import { StyleSheet, TextInput, View, Text, Keyboard, TouchableOpacity } from 'react-native';
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
import { Dropdown } from 'react-native-element-dropdown';



const data = [
  { label: 'Codziennie', value: '1' },
  { label: 'Co tydzień', value: '2' },
  { label: 'Co miesiąc', value: '3' },
  { label: 'Brak', value: '4' },
];

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  
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
          <TouchableOpacity style={styles.typeBtn}>
            <Ionicons name="document-attach" size={24} color="black" />
            <Text style={styles.attachLabel}>Dodaj załączniki</Text>
          </TouchableOpacity>
          <View style={{...styles.line, backgroundColor: Colors[colorScheme ?? 'light'].primary}} />
          <TouchableOpacity style={styles.typeBtn}>
            <Ionicons name="image" size={24} color="black" />
            <Text style={styles.attachLabel}>Dodaj zdjęcia</Text>
          </TouchableOpacity>
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
    gap: 10
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
  line: {
    width: 2,
    height: 30
  }
});
