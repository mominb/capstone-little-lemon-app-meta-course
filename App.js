import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import Cart from "./screens/Cart";
import Home from "./screens/Home";
import Item from "./screens/Item";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import { bootstrap } from "./utils/bootstrap";
import * as database from "./utils/database";

const Stack = createNativeStackNavigator();

export default function App() {
   const [isOnboarded, setIsOnboarded] = useState();
   const [menuCategories, setMenuCategories] = useState([]);
   useEffect(() => {
      const load = async () => {
         const data = await bootstrap();
         setIsOnboarded(data[1]);
         setMenuCategories(data[0]);
      };

      load();
   }, []);

   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isOnboarded ? (
               <>
                  <Stack.Screen name="Home">
                     {(props) => (
                        <Home
                           {...props}
                           menuCategories={menuCategories}
                           database={database}
                        />
                     )}
                  </Stack.Screen>
                  <Stack.Screen name="Profile">
                     {(props) => (
                        <Profile {...props} setIsOnboarded={setIsOnboarded} />
                     )}
                  </Stack.Screen>
                  <Stack.Screen name="Item" component={Item} />
                  <Stack.Screen name="Cart">
                     {(props) => (
                        <Cart
                           {...props}
                           getCartItems={database.getMenuItemsInCart}
                           deleteCartItem={database.deleteCartItem}
                        />
                     )}
                  </Stack.Screen>
               </>
            ) : (
               <Stack.Screen name="Onboarding">
                  {(props) => (
                     <Onboarding {...props} setIsOnboarded={setIsOnboarded} />
                  )}
               </Stack.Screen>
            )}
         </Stack.Navigator>
         <Toast />
      </NavigationContainer>
   );
}
