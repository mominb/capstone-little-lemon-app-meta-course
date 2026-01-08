import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Profile from './screens/Profile';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategories } from './utils/menu'

const Stack = createNativeStackNavigator();


export default function App() {
    const [menuCategories, setMenuCategories] = useState([])
    const [isOnboarded, setIsOnboarded] = useState()


    useEffect(() => {
    const load = async () => {
      try {
      const onboardingData = await AsyncStorage.getItem('isOnboarded')
      setIsOnboarded(onboardingData)
      const cats = await getCategories();
      setMenuCategories(cats);
      } catch (err) {
        console.error('load error:', err);
      }

    };
 
    load();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isOnboarded ? (
        <>  
        <Stack.Screen name="Home">
          {(props) => <Home {...props} menuCategories={menuCategories} /> }
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {(props) => <Profile {...props} setIsOnboarded={setIsOnboarded} /> }
        </Stack.Screen>
        </>
        ) : (
         <Stack.Screen name="Onboarding">
          {(props) => <Onboarding {...props} setIsOnboarded={setIsOnboarded}/> }
         </Stack.Screen>
        )
      }

      </Stack.Navigator>
    </NavigationContainer>
  );
}
