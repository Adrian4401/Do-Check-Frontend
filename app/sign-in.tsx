import { StyleSheet, SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const apiUrl = process.env.EXPO_PUBLIC_API_URL

type SignInProps = {
  setLogged: (value: boolean) => void;
}

export default function SignIn(props: SignInProps) {
  const colorScheme = useColorScheme();
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username: form.username,
        password: form.password
      })
      if(response.status === 200) {
        console.log('Udalo sie zalogowac: ', response.data);
        await AsyncStorage.setItem("Token", response.data.token);
        await AsyncStorage.setItem("UserID", JSON.stringify(response.data.user));
        props.setLogged(true);
      }
    } catch(error) {
      console.log('Nie udalo sie zalogowac: ', error);
    }
  }


  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].splashbg,
    }}>
      <View style={styles.container}>

        <View style={styles.header}>
          <Image source={require('@/assets/images/splash-logo.png')} style={styles.logo} />
          {/* <Text style={{...styles.title, color: Colors[colorScheme ?? 'light'].primary}}>Logowanie</Text> */}
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={{...styles.inputLabel, color: Colors[colorScheme ?? 'light'].primary}}>Nazwa użytkownika</Text>
              <TextInput
                style={{...styles.inputControl, backgroundColor: Colors[colorScheme ?? 'light'].primary, color: Colors[colorScheme ?? 'light'].secondary}}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
                placeholder='Wpisz nazwę użytkownika...'
                placeholderTextColor={Colors[colorScheme ?? 'light'].lightText}
                value={form.username}
                onChangeText={username => setForm({...form, username})}
              />
            </View>
            <View style={styles.input}>
            <Text style={{...styles.inputLabel, color: Colors[colorScheme ?? 'light'].primary}}>Hasło</Text>
              <TextInput
                style={{...styles.inputControl, backgroundColor: Colors[colorScheme ?? 'light'].primary, color: Colors[colorScheme ?? 'light'].secondary}}
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                placeholder='Wpisz hasło...'
                placeholderTextColor={Colors[colorScheme ?? 'light'].lightText}
                value={form.password}
                onChangeText={password => setForm({...form, password})}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        

        <View style={styles.login}>
          <TouchableOpacity onPress={handleLogin} style={{...styles.loginBtn, backgroundColor: Colors[colorScheme ?? 'light'].primary}}>
            <Text style={{...styles.loginBtnText, color: Colors[colorScheme ?? 'light'].secondary}}>Zaloguj</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50
  },
  header: {
    marginVertical: 20,
    alignItems: 'center',
    flex: 2
  },
  logo: {
    width: 250,
    height: 250
  },
  title: {
    fontSize: 28,
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 3,
    gap: 30
  },
  input: {
    justifyContent: 'flex-start',
    width: '100%'
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  inputControl: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 500
  },
  login: {
    flex: 2,
    width: '100%'
  },
  loginBtn: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginBtnText: {
    fontSize: 20,
    fontWeight: 600,
  }
});
