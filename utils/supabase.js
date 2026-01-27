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
      return "error";
   } else {
      return "success";
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

export async function updateUserData(updates) {
   const { data, error } = await supabase.auth.updateUser({
      data: updates,
   });
   if (error) {
      console.log("error updating user data in supabase: ", error);
   }
   return data.user;
}

export async function getUserData() {
   const { data, error } = await supabase.auth.getUser();

   if (error) {
      console.log("error retrieving user data from supabase: ", error);
      return;
   }

   return data;
}

export async function placeOrder(
   cartItems,
   deliveryMethod,
   paymentMethod,
   total_price,
) {
   const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.amount,
   }));
   const { error } = await supabase.from("orders").insert([
      {
         order_items: orderItems,
         payment_mode: paymentMethod,
         delivery_mode: deliveryMethod,
         total_price: total_price,
      },
   ]);
   if (error) {
      console.log("error placing order: ", error);
   }
}

export async function getUsersOrders() {
   const { data: userData } = await supabase.auth.getUser();

   const userId = userData?.user?.id;

   const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId);
   if (error) {
      console.log("error retrieving user orders: ", error);
      return [];
   }
   return data;
}

export async function getAllOrders() {
   const { data, error } = await supabase.from("orders").select("*");
   if (error) {
      console.log("error retrieving user orders: ", error);
      return [];
   }
   return data;
}

export async function getUserRole() {
   const { data: userData } = await supabase.auth.getUser();
   const userId = userData?.user?.id;
   const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId);
   if (error) {
      console.log("error retrieving user orders: ", error);
      return [];
   }

   return data;
}
