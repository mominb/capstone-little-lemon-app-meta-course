import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../components/PageHeader";

const Order = () => {
   const navigator = useNavigation();

   return (
      <SafeAreaView>
         <PageHeader navigator={navigator} heading={"Orders"} />
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
});
export default Order;
