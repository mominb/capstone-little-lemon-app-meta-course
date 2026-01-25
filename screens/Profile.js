import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
   Image,
   Keyboard,
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import PageHeader from "../components/PageHeader";
import { getUserData, supabase, updateUserData } from "../utils/supabase";

const Profile = ({ refreshUserInfo, deleteUserCart }) => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [isNameFocused, setIsNameFocused] = useState(false);
   const [isEmailFocused, setIsEmailFocused] = useState(false);
   const [isPhoneFocused, setIsPhoneFocused] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const navigator = useNavigation();

   useEffect(() => {
      const loadUserData = async () => {
         setIsLoading(true);
         const data = await getUserData();
         setIsLoading(false);
         if (data.user) {
            setName(data.user.user_metadata.displayName ?? "");
            setEmail(data.user.email ?? "");
            setPhone(data.user.user_metadata.phone ?? "");
         }
      };
      loadUserData();
   }, []);
   const handleSaveInfo = async () => {
      setIsLoading(true);
      try {
         await updateUserData({
            phone: phone,
            email: email,
            displayName: name,
         });
         setIsLoading(false);
         Keyboard.dismiss();
         console.log("User info saved");
         Toast.show({
            type: "success",
            text1: "Information updated successfully",
         });
         refreshUserInfo();
      } catch (error) {
         console.log("Error saving user info:", error);
         Toast.show({
            type: "error",
            text1: "Failed to update information",
         });
      }
   };
   const handleLogout = async () => {
      setIsLoading(true);
      try {
         const { error } = await supabase.auth.signOut();
         if (error) {
            console.log("Error logging out:", error);
            Toast.show({
               type: "error",
               text1: "Logout failed",
            });
         } else {
            Toast.show({
               type: "success",
               text1: "You have been logged out",
            });
         }

         await deleteUserCart();
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
         <PageHeader navigator={navigator} heading={"Profile"}></PageHeader>
         <KeyboardAvoidingView behavior="padding" style={styles.content}>
            <ScrollView>
               <View style={styles.profileImageContainer}>
                  <Image
                     source={require("../assets/profile-icon.png")}
                     resizeMode="contain"
                     style={styles.profileImage}
                  />
               </View>
               <View style={styles.form}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                     onFocus={() => setIsNameFocused(true)}
                     onBlur={() => setIsNameFocused(false)}
                     style={[
                        styles.input,
                        isNameFocused && styles.inputFocused,
                     ]}
                     value={name}
                     onChangeText={setName}
                  />

                  <Text style={styles.label}>Email</Text>
                  <TextInput
                     keyboardType="email-address"
                     autoCapitalize="none"
                     onFocus={() => setIsEmailFocused(true)}
                     onBlur={() => setIsEmailFocused(false)}
                     style={[
                        styles.input,
                        isEmailFocused && styles.inputFocused,
                     ]}
                     value={email}
                     onChangeText={setEmail}
                  />
                  <Text style={styles.label}>Phone</Text>
                  <TextInput
                     keyboardType="phone-pad"
                     onFocus={() => setIsPhoneFocused(true)}
                     onBlur={() => setIsPhoneFocused(false)}
                     style={[
                        styles.input,
                        isPhoneFocused && styles.inputFocused,
                     ]}
                     value={phone}
                     onChangeText={setPhone}
                  />
               </View>
            </ScrollView>
            <TouchableOpacity
               style={styles.saveButton}
               onPress={handleSaveInfo}
            >
               <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
         </KeyboardAvoidingView>
         <View>
            <TouchableOpacity
               style={styles.logoutButton}
               onPress={handleLogout}
            >
               <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   profileImageContainer: {
      height: "25%",
      alignSelf: "center",
   },
   logoutButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#EDEFEE",
      borderColor: "black",
      borderWidth: 2,
   },
   content: {
      backgroundColor: "white",
   },
   headerText: {
      alignSelf: "center",
      marginLeft: 10,
      fontSize: 24,
      fontWeight: "bold",
   },
   profileImage: {
      height: 100,
      width: 100,
      margin: 20,
   },
   header: {
      flexDirection: "row",
      justifyContent: "flex-start",
      backgroundColor: "white",
      borderColor: "#000",
      borderWidth: 1,
      padding: 20,
   },

   backButton: {
      alignSelf: "flex-start",
      width: 48,
      height: 48,
   },
   logoutButtonText: {
      color: "red",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
   },
   input: {
      height: 48,
      borderWidth: 2,
      borderColor: "#495E57",
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      backgroundColor: "#EDEFEE",
   },
   inputFocused: {
      height: 48,
      borderWidth: 2,
      borderColor: "#F4CE14",
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      backgroundColor: "#EDEFEE",
   },
   label: {
      fontSize: 14,
      fontWeight: "bold",
      color: "black",
      marginBottom: 6,
   },
   form: {
      padding: 20,
   },
   saveButton: {
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
   saveButtonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
   },
});
export default Profile;
