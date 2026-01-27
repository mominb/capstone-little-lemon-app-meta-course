import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import AdminHome from "./screens/admin/AdminHome";
import AdminOrders from "./screens/admin/AdminOrders";
import Onboarding from "./screens/Onboarding";
import Cart from "./screens/user/Cart";
import Checkout from "./screens/user/Checkout";
import Home from "./screens/user/Home";
import Item from "./screens/user/Item";
import OrderInfo from "./screens/user/OrderInfo";
import Orders from "./screens/user/Orders";
import Profile from "./screens/user/Profile";
import { bootstrap } from "./utils/bootstrap";
import * as database from "./utils/database";
import { getUserData, getUserRole, supabase } from "./utils/supabase";

const Stack = createNativeStackNavigator();

export default function App() {
   const [userRole, setUserRole] = useState();
   const [loading, SetLoading] = useState(true);
   const [session, setSession] = useState(null);
   const [menuCategories, setMenuCategories] = useState([]);
   const [userMetaDataExists, setUserMetaDataExists] = useState(false);
   const getUserInformation = useCallback(async () => {
      const userData = await getUserData();
      setUserMetaDataExists(
         userData.user.user_metadata.displayName &&
            userData.user.user_metadata.phone,
      );
      const userRole = await getUserRole();
      setUserRole(userRole[0].role);
   }, []);
   useEffect(() => {
      const load = async () => {
         const data = await bootstrap();
         setMenuCategories(data[0]);
      };

      load();
      getUserInformation();

      supabase.auth.getSession().then(({ data }) => {
         setSession(data.session);
      });

      const { data: listener } = supabase.auth.onAuthStateChange(
         (_event, session) => {
            setSession(session);
         },
      );
      SetLoading(false);
      return () => {
         listener.subscription.unsubscribe();
      };
   }, [getUserInformation]);

   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!session ? (
               <Stack.Screen name="Onboarding">
                  {(props) => <Onboarding {...props} />}
               </Stack.Screen>
            ) : userRole === "admin" ? (
               <>
                  <Stack.Screen name="AdminHome" component={AdminHome} />
                  <Stack.Screen name="AdminOrders" component={AdminOrders} />
               </>
            ) : (
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
                        <Profile
                           {...props}
                           refreshUserInfo={getUserInformation}
                           deleteUserCart={database.deleteAllCartRows}
                        />
                     )}
                  </Stack.Screen>

                  <Stack.Screen name="Item" component={Item} />

                  <Stack.Screen name="Cart">
                     {(props) => (
                        <Cart
                           {...props}
                           getCartItems={database.getMenuItemsInCart}
                           deleteCartItem={database.deleteCartItem}
                           changeItemQtyInCart={database.changeItemQtyInCart}
                           getTotalCartCost={database.getTotalCartCost}
                           userMetaDataExists={userMetaDataExists}
                        />
                     )}
                  </Stack.Screen>

                  <Stack.Screen name="Checkout">
                     {(props) => (
                        <Checkout
                           {...props}
                           deleteUserCart={database.deleteAllCartRows}
                        />
                     )}
                  </Stack.Screen>

                  <Stack.Screen name="Orders" component={Orders} />
                  <Stack.Screen name="OrderInfo" component={OrderInfo} />
               </>
            )}
         </Stack.Navigator>
         <Toast />

         <Spinner
            visible={loading}
            textContent="Loading..."
            textStyle={{ color: "#fff" }}
         />
      </NavigationContainer>
   );
}
