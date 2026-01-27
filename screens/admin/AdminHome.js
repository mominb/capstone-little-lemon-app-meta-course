import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminHome = () => {
   const navigator = useNavigation();
   return (
      <SafeAreaView style={styles.screen}>
         <View style={styles.header}>
            <Image
               source={require("../../assets/logo-long-text.png")}
               resizeMode="contain"
               style={styles.headerLogo}
            />
            <TouchableOpacity>
               <Image
                  source={require("../../assets/settings_icon.jpg")}
                  resizeMode="contain"
                  style={styles.headerProfileIcon}
               />
            </TouchableOpacity>
         </View>
         <View>
            <TouchableOpacity onPress={() => navigator.navigate("AdminOrders")}>
               <Text>View All Orders</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   screen: {
      flex: 1,
   },

   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 20,
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "black",
   },
   headerLogo: {
      width: 200,
      height: 40,
   },
   headerProfileIcon: {
      width: 40,
      height: 40,
   },
});
export default AdminHome;
