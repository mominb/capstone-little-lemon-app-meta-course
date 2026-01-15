import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
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

const Cart = ({ getCartItems, deleteCartItem }) => {
   const navigator = useNavigation();
   const [cartItems, setCartItems] = useState([]);
   const load = async () => {
      const items = await getCartItems();
      setCartItems(items);
   };

   useFocusEffect(() => {
      load();
   });

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
            data={cartItems}
            keyExtractor={(item) => String(item.item_id)}
            ItemSeparatorComponent={itemSeperator}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
               <View style={styles.itemContainer}>
                  <View style={styles.itemInfo}>
                     <View>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQty}>Qty: {item.amount}</Text>
                     </View>
                     <Text style={styles.itemTotal}>
                        Total: ${item.amount * item.price}
                     </Text>
                  </View>

                  <View style={styles.itemActions}>
                     <Image
                        source={{
                           uri: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/refs/heads/main/images/${item.image}`,
                        }}
                        style={styles.itemImage}
                     />
                     <TouchableOpacity
                        onPress={() => {
                           deleteCartItem(item.item_id);
                           load();
                        }}
                        style={styles.deleteButton}
                     >
                        <Text style={styles.deleteText}>Delete</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            )}
         />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
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
      marginHorizontal: 20,
      marginVertical: 10,
   },
   listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      marginTop: 30,
   },
   itemContainer: {
      backgroundColor: "#f9f9f9",
      padding: 15,
      borderRadius: 8,
   },
   itemInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
   },
   itemName: {
      fontSize: 16,
      fontWeight: "600",
   },
   itemQty: {
      fontSize: 14,
      color: "#555",
      marginTop: 4,
   },
   itemTotal: {
      fontSize: 15,
      fontWeight: "600",
   },
   itemActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   itemImage: {
      width: 60,
      height: 60,
      borderRadius: 6,
      backgroundColor: "grey",
   },
   deleteButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: "#e74c3c",
      borderRadius: 4,
   },
   deleteText: {
      color: "#fff",
      fontWeight: "600",
   },
});

export default Cart;
