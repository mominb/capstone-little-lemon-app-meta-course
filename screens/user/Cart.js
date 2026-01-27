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
import Toast from "react-native-toast-message";
import PageHeader from "../../components/PageHeader";

const Cart = ({
   getCartItems,
   deleteCartItem,
   changeItemQtyInCart,
   getTotalCartCost,
   userMetaDataExists,
}) => {
   const navigator = useNavigation();
   const [cartItems, setCartItems] = useState([]);
   const [totalAmount, setTotalAmount] = useState(0);

   const load = async () => {
      const items = await getCartItems();
      setCartItems(items);
      const cost = await getTotalCartCost();
      if (cost) {
         setTotalAmount(cost.toFixed(2));
      } else {
         setTotalAmount(0);
      }
   };

   const increaseAmount = async (item_id) => {
      await changeItemQtyInCart(item_id, "increase");
   };
   const decreaseAmount = async (item_id) => {
      await changeItemQtyInCart(item_id, "decrease");
   };
   useFocusEffect(() => {
      load();
   });
   const isCheckoutAllowed = userMetaDataExists && cartItems.length > 0;

   const handleCheckoutNavi = () => {
      if (isCheckoutAllowed) {
         navigator.navigate("Checkout", {
            cartItems: cartItems,
            totalAmount: totalAmount,
         });
      } else {
         if (!userMetaDataExists) {
            Toast.show({
               type: "error",
               text1: "Please complete profile",
               text2: "You cannot checkout until information is complete",
            });
            navigator.navigate("Profile");
         } else {
            Toast.show({
               type: "error",
               text1: "Cart is empty",
               text2: "You cannot checkout with an empty cart",
            });
         }
      }
   };
   return (
      <SafeAreaView style={styles.container}>
         <PageHeader navigator={navigator} heading={"Cart"}></PageHeader>

         <FlatList
            data={cartItems}
            keyExtractor={(item) => String(item.item_id)}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
               <View style={styles.itemContainer}>
                  <View style={styles.itemInfo}>
                     <View>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQty}>Qty: {item.amount}</Text>
                     </View>
                     <Text style={styles.itemTotal}>
                        Total: ${(item.amount * item.price).toFixed(2)}
                     </Text>
                  </View>

                  <View style={styles.itemActions}>
                     <Image
                        source={{
                           uri: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/refs/heads/main/images/${item.image}`,
                        }}
                        style={styles.itemImage}
                     />
                     <View style={styles.counterContainer}>
                        <TouchableOpacity
                           style={styles.CounterButton}
                           onPress={() => decreaseAmount(item.item_id)}
                        >
                           <Text style={styles.counterText}>-</Text>
                        </TouchableOpacity>
                        <Text style={[styles.counterText, { color: "black" }]}>
                           {item.amount}
                        </Text>
                        <TouchableOpacity
                           style={styles.CounterButton}
                           onPress={() => increaseAmount(item.item_id)}
                        >
                           <Text style={styles.counterText}>+</Text>
                        </TouchableOpacity>
                     </View>
                     <TouchableOpacity
                        onPress={async () => {
                           const response = await deleteCartItem(item.item_id);
                           Toast.show({
                              type: response.type,
                              text1: response.message,
                           });
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
         <View style={styles.footer}>
            <View style={styles.totalAmountContainer}>
               <Text style={styles.totalAmountText}>Total amount</Text>
               <Text style={styles.totalAmountText}>${totalAmount}</Text>
            </View>
            <TouchableOpacity
               onPress={handleCheckoutNavi}
               style={styles.checkoutButton}
            >
               <Text style={styles.checkoutButtonText}>
                  Continue to Checkout
               </Text>
            </TouchableOpacity>
         </View>
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
      marginBottom: 10,
      borderColor: "black",
      borderWidth: 1,
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
   counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   CounterButton: {
      backgroundColor: "grey",
      width: 20,
      height: 20,
      alignItems: "center",
      borderRadius: 20,
      margin: 8,
   },
   counterText: {
      color: "white",
      fontSize: 15,
   },
   footer: {},
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: "#F4CE14",
      padding: 10,
   },
   totalAmountText: {
      fontWeight: "bold",
      fontSize: 20,
   },
   checkoutButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#EDEFEE",
      borderColor: "black",
      borderWidth: 2,
      marginTop: 15,
   },
   checkoutButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
   },
});

export default Cart;
