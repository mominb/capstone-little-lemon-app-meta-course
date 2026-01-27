import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
   FlatList,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemSeperator from "../../components/ItemSeperator";
import PageHeader from "../../components/PageHeader";
import { placeOrder } from "../../utils/supabase";

const Checkout = ({ route, deleteUserCart }) => {
   const [isLoading, setIsLoading] = useState(false);
   const navigator = useNavigation();
   const data = route.params;
   const cartItems = data.cartItems;
   const totalAmount = data.totalAmount;
   const paymentMethods = [{ label: "Cash", value: "COD" }];
   const [paymentMethod, setPaymentMethod] = useState("COD");
   const deliveryMethods = [
      { label: "Deliver to Doorstep", value: "Delivery" },
      { label: "Pick-up from restaurant", value: "Pickup" },
   ];
   const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
   const handleOrderPlacement = async () => {
      setIsLoading(true);
      try {
         await placeOrder(
            cartItems,
            deliveryMethod,
            paymentMethod,
            totalAmount,
         );
         navigator.navigate("Orders");
         await deleteUserCart();
      } catch (error) {
         console.log(error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: "#fff" }}
         />
         <PageHeader navigator={navigator} heading={"Checkout"}></PageHeader>
         <View style={styles.orderDetailsContainer}>
            <Text style={styles.subHeading}>Order Details</Text>
            <FlatList
               data={cartItems}
               keyExtractor={(item) => String(item.item_id)}
               ItemSeparatorComponent={ItemSeperator}
               renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                     <View style={styles.itemInfoContainer}>
                        <Text style={styles.itemText}>{item.amount}x</Text>
                        <Text style={styles.itemText}>{item.name}</Text>
                     </View>

                     <View style={styles.itemPriceContainer}>
                        <Text style={styles.itemText}>
                           ${(item.amount * item.price).toFixed(2)}
                        </Text>
                     </View>
                  </View>
               )}
            />
            <ItemSeperator />
            <View style={styles.totalAmountContainer}>
               <Text style={styles.totalAmountText}>Total :</Text>
               <Text style={styles.totalAmountText}>${totalAmount}</Text>
            </View>
         </View>
         <View style={styles.DetailsContainer}>
            <Text style={[styles.subHeading, { alignSelf: "flex-start" }]}>
               Delivery Method
            </Text>
            <Dropdown
               style={styles.MethodSelector}
               data={deliveryMethods}
               labelField="label"
               valueField="value"
               placeholder="Select"
               value={deliveryMethod}
               onChange={(item) => {
                  setDeliveryMethod(item.value);
               }}
            />
            <Text style={[styles.subHeading, { alignSelf: "flex-start" }]}>
               Payment Method
            </Text>
            <Dropdown
               style={styles.MethodSelector}
               data={paymentMethods}
               labelField="label"
               valueField="value"
               placeholder="Select"
               value={paymentMethod}
               onChange={(item) => {
                  setPaymentMethod(item.value);
               }}
            />
         </View>
         <View>
            <TouchableOpacity
               onPress={handleOrderPlacement}
               style={styles.button}
            >
               <Text style={styles.buttonText}>Place order</Text>
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
   subHeading: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 10,
      alignSelf: "center",
   },
   orderDetailsContainer: {
      padding: 20,
      margin: 20,
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 10,
   },
   itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
   },
   itemInfoContainer: {
      flexDirection: "row",
   },
   itemText: {
      fontWeight: "bold",
      margin: 10,
   },
   totalAmountText: {
      fontWeight: "bold",
      fontSize: 17,
      margin: 10,
   },
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
   },
   DetailsContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      margin: 20,
   },
   MethodSelector: {
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#EDEFEE",
      borderColor: "black",
      borderWidth: 2,
      marginTop: 5,
      marginBottom: 10,
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#F4CE14",
      borderColor: "black",
      borderWidth: 2,
      marginTop: 15,
   },
   buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
   },
});

export default Checkout;
