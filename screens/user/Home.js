import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
   FlatList,
   Image,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Filter from "../../components/Filter";
import ItemSeperator from "../../components/ItemSeperator";

const Home = ({ menuCategories, database }) => {
   const [query, setQuery] = useState("");
   const [data, setData] = useState([]);
   const [activeCategories, setActiveCategories] = useState([]);
   const [numOfCartItems, setNumOfCartItems] = useState(0);
   const navigation = useNavigation();

   const handleFilterSelection = (filter) => {
      setActiveCategories((prev) => {
         if (prev.includes(filter)) return prev.filter((c) => c !== filter);
         return [...prev, filter];
      });
   };

   const handleItemPress = (item) => {
      navigation.navigate("Item", { item });
   };

   const handleProfileIconClick = () => {
      navigation.navigate("Profile");
   };

   useEffect(() => {
      const loadData = async () => {
         const filteredItems = await database.filterByQueryAndCategories(
            query,
            activeCategories,
         );
         setData(filteredItems);
      };
      loadData();
   }, [activeCategories, query, database]);

   useFocusEffect(() => {
      async function fetchCartItemCount() {
         const cartItemCount = await database.cartItemCount();
         setNumOfCartItems(cartItemCount);
      }
      fetchCartItemCount();
   });

   return (
      <SafeAreaView style={styles.screen}>
         <View style={styles.header}>
            <Image
               source={require("../../assets/logo-long-text.png")}
               resizeMode="contain"
               style={styles.headerLogo}
            />
            <TouchableOpacity onPress={handleProfileIconClick}>
               <Image
                  source={require("../../assets/profile-icon.png")}
                  resizeMode="contain"
                  style={styles.headerProfileIcon}
               />
            </TouchableOpacity>
         </View>

         <View style={styles.searchBarSection}>
            <View style={styles.searchBar}>
               <Image
                  source={require("../../assets/search-icon.png")}
                  style={styles.searchIcon}
               />
               <TextInput
                  value={query}
                  onChangeText={setQuery}
                  style={styles.searchInput}
               />
            </View>
            <TouchableOpacity
               style={styles.cartButton}
               onPress={() => navigation.navigate("Cart")}
            >
               <Image
                  source={require("../../assets/shopping-bag-icon.png")}
                  resizeMode="contain"
                  style={styles.cartIcon}
               />
               <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{numOfCartItems}</Text>
               </View>
            </TouchableOpacity>
         </View>

         <View style={styles.filtersSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
               <Filter
                  categories={menuCategories}
                  onClick={handleFilterSelection}
                  activeCat={activeCategories}
               />
            </ScrollView>
            <View style={styles.filtersDivider} />
         </View>

         <FlatList
            keyExtractor={(item) => item.id}
            data={data}
            ItemSeparatorComponent={ItemSeperator}
            renderItem={({ item }) => (
               <TouchableOpacity
                  onPress={() => handleItemPress(item)}
                  style={styles.itemRow}
               >
                  <View style={styles.itemTextColumn}>
                     <Text style={styles.itemTitle}>{item.name}</Text>
                     <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                     </Text>
                     <Text style={styles.itemPrice}>${item.price}</Text>
                  </View>

                  <Image
                     style={styles.itemImage}
                     source={{
                        uri: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/refs/heads/main/images/${item.image}`,
                     }}
                  />
               </TouchableOpacity>
            )}
         />
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
   },
   headerLogo: {
      width: 200,
      height: 40,
   },
   headerProfileIcon: {
      width: 40,
      height: 40,
   },

   searchBarSection: {
      backgroundColor: "#495E57",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
   },
   searchBar: {
      flexDirection: "row",
      backgroundColor: "white",
      width: "80%",
      height: 40,
      borderRadius: 15,
      alignSelf: "center",
      alignItems: "center",
      marginVertical: 15,
   },
   searchIcon: {
      height: 30,
      width: 30,
      borderRadius: 15,
      marginLeft: 5,
   },
   searchInput: {
      height: 40,
      width: "60%",
   },

   cartButton: {
      backgroundColor: "#F4CE14",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      height: 40,
      flexDirection: "row",

      paddingHorizontal: 6,
   },
   cartIcon: {
      width: 30,
      height: 30,
   },
   cartBadge: {
      backgroundColor: "red",
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
   },
   cartBadgeText: {
      color: "white",
      fontWeight: "bold",
   },

   filtersSection: {
      marginLeft: 20,
      marginTop: 5,
   },
   filtersDivider: {
      height: 0.5,
      width: "95%",
      backgroundColor: "black",
   },

   itemRow: {
      flexDirection: "row",
      padding: 15,
      justifyContent: "space-between",
   },
   itemTextColumn: {
      width: "60%",
   },
   itemTitle: {
      fontWeight: "bold",
      fontSize: 20,
   },
   itemDescription: {
      color: "gray",
      marginTop: 5,
      marginBottom: 5,
   },
   itemPrice: {
      fontWeight: "bold",
   },
   itemImage: {
      resizeMode: "fill",
      width: 100,
      height: 100,
      backgroundColor: "gray",
      borderRadius: 10,
   },
});

export default Home;
