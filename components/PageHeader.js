import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PageHeader = ({ navigator, heading }) => {
   return (
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigator.goBack()}>
            <Image
               source={require("../assets/back-button.jpg")}
               resizeMode="contain"
               style={styles.backButton}
            />
         </TouchableOpacity>
         <Text style={styles.heading}>{heading}</Text>
      </View>
   );
};
const styles = StyleSheet.create({
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
});
export default PageHeader;
