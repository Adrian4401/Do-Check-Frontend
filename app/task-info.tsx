import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Entypo from '@expo/vector-icons/Entypo';
import GoBackBtn from '@/components/buttons';



export default function TaskInfo() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Entypo size={200} name="info" style={styles.headerImage} />
      }>

      <ThemedView style={styles.titleContainer}>
        <GoBackBtn />
        <ThemedText type="title">Informacje</ThemedText>
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -30,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 20,
  },
});
