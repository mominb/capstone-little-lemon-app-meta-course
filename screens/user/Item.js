import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { saveItemToCart } from "../../utils/database";

const Item = ({ route }) => {
   const navigator = useNavigation();
   const item = route.params.item;
   const [amount, setAmount] = useState(1);
   const increaseAmount = () => {
      setAmount((prev) => prev + 1);
   };
   const decreaseAmount = () => {
      if (amount > 1) {
         setAmount((prev) => prev - 1);
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => navigator.goBack()}>
               <Image
                  source={require("../../assets/back-button.jpg")}
                  resizeMode="contain"
                  style={styles.backButton}
               />
            </TouchableOpacity>
            <Image
               source={require("../../assets/logo-long-text.png")}
               resizeMode="contain"
               style={styles.logoLemon}
            />
         </View>

         <Image
            style={{
               resizeMode: "stretch",
               backgroundColor: "gray",
               width: "100%",
               height: "30%",
               borderBottomColor: "black",
               borderBottomWidth: 2,
            }}
            source={{
               uri: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/refs/heads/main/images/${item.image}`,
            }}
         />
         <View style={styles.infoBox}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
         </View>
         <View style={styles.seperator} />
         <View>
            <View style={styles.counterContainer}>
               <TouchableOpacity
                  style={styles.CounterButton}
                  onPress={decreaseAmount}
               >
                  <Text style={styles.counterText}>-</Text>
               </TouchableOpacity>
               <Text style={[styles.counterText, { color: "black" }]}>
                  {amount}
               </Text>
               <TouchableOpacity
                  style={styles.CounterButton}
                  onPress={increaseAmount}
               >
                  <Text style={styles.counterText}>+</Text>
               </TouchableOpacity>
            </View>
            <TouchableOpacity
               onPress={async () => {
                  const response = await saveItemToCart(item.id, amount);
                  Toast.show({
                     type: response.type,
                     text1: response.message,
                  });
                  navigator.navigate("Home");
               }}
               style={styles.button}
            >
               <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
         </View>
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
   infoBox: {
      width: "100%",
      padding: 20,
   },
   itemName: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 5,
   },
   itemDescription: {},
   itemPrice: {
      marginTop: 30,
      fontWeight: "bold",
      fontSize: 20,
   },
   seperator: {
      width: "100%",
      height: 0.5,
      backgroundColor: "black",
   },
   addOnBox: {
      width: "100%",
      padding: 20,
   },
   heading: {
      fontWeight: "bold",
      fontSize: 20,
   },
   subheading: {},
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#F4CE14",
      borderColor: "black",
      borderWidth: 2,
      marginBottom: 20,
   },
   buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
   },
   counterContainer: {
      height: "50%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   CounterButton: {
      backgroundColor: "grey",
      width: 40,
      height: 40,
      alignItems: "center",
      borderRadius: 20,
      margin: 15,
   },
   counterText: {
      color: "white",
      fontSize: 30,
   },
});

export default Item;
