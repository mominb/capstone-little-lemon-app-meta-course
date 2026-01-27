import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
   FlatList,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/PageHeader";
import { getUsersOrders } from "../../utils/supabase";

const Orders = () => {
   const navigator = useNavigation();
   const [orders, setOrders] = useState();
   const formattedDate = (date) => {
      const formatted = new Date(date).toLocaleString("en-GB", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      });
      return formatted;
   };
   useEffect(() => {
      const getOrders = async () => {
         const orders = await getUsersOrders();

         setOrders(orders.reverse());
      };

      getOrders();
   }, []);

   return (
      <SafeAreaView>
         <PageHeader navigator={navigator} heading={"Your Orders"} />
         <View>
            <FlatList
               data={orders}
               keyExtractor={(item) => String(item.id)}
               renderItem={({ item }) => (
                  <TouchableOpacity
                     onPress={() => navigator.navigate("OrderInfo", { item })}
                     style={
                        item.order_status === "completed"
                           ? styles.orderInactive
                           : styles.orderActive
                     }
                  >
                     <Text style={styles.orderText}>Order ID: {item.id}</Text>
                     <Text style={styles.orderText}>
                        Placed on {formattedDate(item.created_at)}
                     </Text>
                     <Text style={styles.orderText}>
                        Status: {item.order_status}
                     </Text>
                     <Text style={styles.orderText}>
                        Number of items: {item.order_items.length}
                     </Text>
                     <Text style={styles.orderText}>
                        Payment: {item.payment_mode}
                     </Text>
                     <Text style={styles.orderText}>{item.delivery_mode}</Text>
                  </TouchableOpacity>
               )}
            />
         </View>
         <View>
            <TouchableOpacity
               onPress={() => navigator.navigate("Home")}
               style={styles.button}
            >
               <Text style={styles.buttonText}>Back to home</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
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
   orderActive: {
      backgroundColor: "#E8F5E9",
      borderColor: "#2E7D32",
      borderWidth: 1,
      borderRadius: 6,
      padding: 12,
      marginVertical: 8,
      marginHorizontal: 12,
   },
   orderInactive: {
      backgroundColor: "#b0afaf",
      borderColor: "#000000",
      borderWidth: 1,
      borderRadius: 6,
      padding: 12,
      marginVertical: 8,
      marginHorizontal: 12,
   },
   orderText: {
      fontWeight: "bold",
   },
});
export default Orders;
