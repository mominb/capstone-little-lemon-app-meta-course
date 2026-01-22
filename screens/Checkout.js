import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../components/PageHeader";

const Checkout = () => {
   const navigator = useNavigation();
   return (
      <SafeAreaView style={styles.container}>
         <PageHeader navigator={navigator} heading={"Checkout"}></PageHeader>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
});
export default Checkout;
