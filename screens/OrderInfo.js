import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemSeperator from "../components/ItemSeperator";
import PageHeader from "../components/PageHeader";

const OrderInfo = ({ route }) => {
   const navigator = useNavigation();
   const { item: order } = route.params;
   const orderItems = order.order_items;
   console.log(orderItems[0].name);
   return (
      <SafeAreaView>
         <PageHeader navigator={navigator} heading={"Order"} />
         <View style={styles.orderDetailsContainer}>
            <Text style={styles.subHeading}>Order Details</Text>
            <FlatList
               data={orderItems}
               ItemSeparatorComponent={ItemSeperator}
               renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                     <View style={styles.itemInfoContainer}>
                        <Text style={styles.itemText}>{item.quantity}x</Text>
                        <Text style={styles.itemText}>{item.name}</Text>
                     </View>
                  </View>
               )}
            />
            <ItemSeperator />
            <View style={styles.totalAmountContainer}>
               <Text style={styles.totalAmountText}>Total :</Text>
               <Text style={styles.totalAmountText}>${order.total_price}</Text>
            </View>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
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
});
export default OrderInfo;
