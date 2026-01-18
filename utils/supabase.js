import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
   process.env.EXPO_PUBLIC_SUPABASE_URL,
   process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
   {
      auth: {
         storage: AsyncStorage,
         persistSession: true,
         autoRefreshToken: true,
         detectSessionInUrl: false,
      },
   },
);

export async function sendEmailOTP(email) {
   const { error } = await supabase.auth.signInWithOtp({
      email,
   });

   if (error) {
      console.log(error.message);
   }
}

export async function verifyEmailOTP(email, token) {
   const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
   });

   if (error) {
      console.log(error.message);
      return null;
   }

   return data.session;
}
