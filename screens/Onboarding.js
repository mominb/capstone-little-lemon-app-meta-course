import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
   Image,
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { sendEmailOTP, verifyEmailOTP } from "../utils/supabase";

const Onboarding = () => {
   const [email, setEmail] = useState("");
   const [token, setToken] = useState("");
   const [isOTPFocused, setIsOTPFocused] = useState(false);
   const [isEmailFocused, setIsEmailFocused] = useState(false);
   const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   const isOTPValid = /^\d{6}$/.test(token);
   const isFormValid = isEmailValid && isOTPValid;
   const sendOTP = async () => {
      try {
         await AsyncStorage.setItem("userEmail", email);
         await sendEmailOTP(email);
         Toast.show({
            type: "success",
            text1: "OTP sent to email.",
         });
      } catch (error) {
         Toast.show({
            type: "error",
            text1: "Failed to send OTP",
         });
         console.log("Error sending otp:", error);
      } finally {
         console.log("Sent otp");
      }
   };
   const verifyOTPandLogin = async () => {
      try {
         await verifyEmailOTP(email, token);
      } catch (error) {
         console.log("Error verifying otp:", error);
      } finally {
         console.log("verified otp");
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <View>
            <Image
               source={require("../assets/littlelemon-logo-long-white.jpg")}
               style={styles.logo}
               resizeMode="contain"
            />
         </View>
         <Text style={styles.title}>Sign in to Little Lemon</Text>

         <ScrollView style={styles.content}>
            <View>
               <Text style={styles.label}>Email</Text>
               <TextInput
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  style={[styles.input, isEmailFocused && styles.inputFocused]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
               />
            </View>
            <TouchableOpacity onPress={() => sendOTP(email)}>
               <Text
                  style={[
                     styles.otpButtonText,
                     !isEmailValid && styles.otpButtonDisabledText,
                  ]}
               >
                  Send OTP
               </Text>
            </TouchableOpacity>
            <View>
               <Text style={styles.label}>OTP</Text>
               <TextInput
                  onFocus={() => setIsOTPFocused(true)}
                  onBlur={() => setIsOTPFocused(false)}
                  style={[styles.input, isOTPFocused && styles.inputFocused]}
                  value={token}
                  onChangeText={setToken}
                  keyboardType="number-pad"
               />
            </View>
         </ScrollView>
         <KeyboardAvoidingView behavior="padding">
            <TouchableOpacity
               style={[styles.button, !isFormValid && styles.buttonDisabled]}
               disabled={!isFormValid}
               onPress={() => verifyOTPandLogin(email, token)}
            >
               <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,

      backgroundColor: "#495E57",
      padding: 20,
   },
   header: {
      alignItems: "center",
      padding: 20,
      backgroundColor: "white",
   },
   logo: {
      width: 200,
      height: 150,
      alignSelf: "center",
   },
   content: {},
   title: {
      fontSize: 25,
      fontWeight: "bold",
      color: "#F4CE14",
      padding: 30,
      textAlign: "center",
   },
   label: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#EDEFEE",
      marginBottom: 6,
   },
   input: {
      height: 48,
      width: "100%",
      borderWidth: 2.5,
      borderColor: "#495E57",
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      backgroundColor: "#EDEFEE",
      alignSelf: "center",
   },
   inputFocused: {
      borderColor: "#F4CE14",
   },
   button: {
      alignSelf: "center",
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#F4CE14",
      borderColor: "black",
      borderWidth: 2,
      marginBottom: 10,
   },
   buttonDisabled: {
      opacity: 0.4,
   },

   buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "500",
      textAlign: "center",
   },
   otpButtonText: {
      color: "#F4CE14",
      fontWeight: "bold",
      alignSelf: "center",
      marginBottom: 10,
   },
   otpButtonDisabledText: {
      color: "#495E57",
   },
});

export default Onboarding;
