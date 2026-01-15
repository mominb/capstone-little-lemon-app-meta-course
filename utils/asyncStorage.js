import AsyncStorage from "@react-native-async-storage/async-storage";

const readUserData = async () => {
   try {
      const name = await AsyncStorage.getItem("userName");
      const lastName = await AsyncStorage.getItem("userLastName");
      const email = await AsyncStorage.getItem("userEmail");
      const phone = await AsyncStorage.getItem("userPhone");
      return { name, lastName, email, phone };
   } catch (error) {
      console.log("Error reading user data:", error);
      return null;
   }
};

export default readUserData;
