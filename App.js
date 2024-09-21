import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'

export default function App() {

  useEffect(() => {
    const prepare = async () => {
      // keep splash screen visible
      await SplashScreen.preventAutoHideAsync()

      // pre-load your stuff
      await new Promise(resolve => setTimeout(resolve, 5000))

      // hide splash screen
      await SplashScreen.hideAsync()
    }
    prepare()
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});