import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
   FlatList,
   Image,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import itemSeperator from "../components/itemSeperator";

const Cart = ({ getCartItems }) => {
   const navigator = useNavigation();
   const [cartItems, setCartItems] = useState([]);
   useFocusEffect(
      useCallback(() => {
         const load = async () => {
            const items = await getCartItems();
            setCartItems(items);
         };

         load();
      }, [getCartItems]),
   );
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => navigator.goBack()}>
               <Image
                  source={require("../assets/back-button.jpg")}
                  resizeMode="contain"
                  style={styles.backButton}
               />
            </TouchableOpacity>
            <Image
               source={require("../assets/logo-long-text.png")}
               resizeMode="contain"
               style={styles.logoLemon}
            />
         </View>
         <Text style={styles.heading}>Your Cart</Text>
         <FlatList
            keyExtractor={(item) => item.item_id}
            data={cartItems}
            ItemSeparatorComponent={itemSeperator}
            renderItem={({ item }) => (
               <View>
                  <Text>{item.name}</Text>
                  <Text>{item.amount}</Text>
               </View>
            )}
         />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      justifyContent: "flex-start",
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "black",
      flexDirection: "row",
      padding: 20,
   },

   logoLemon: {
      alignSelf: "center",
      marginLeft: 25,
      width: 200,
      height: 40,
   },
   backButton: {
      alignSelf: "flex-start",
      width: 48,
      height: 48,
   },
   heading: {
      fontWeight: "bold",
      fontSize: 25,
   },
});

export default Cart;
