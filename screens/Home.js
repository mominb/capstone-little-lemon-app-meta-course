import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import fetchMenu from '../utils/fetchMenu';
import { saveMenuItems, createTable, getMenuItems, filterByQueryAndCategories} from '../utils/database';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import itemSeperator from '../components/itemSeperator';
import { TextInput } from 'react-native'
const Home = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [isStartersActive, setIsStartersActive] = useState(false);
  const [isMainsActive, setIsMainsActive] = useState(false);
  const [isDessertsActive, setIsDessertsActive] = useState(false);
  const [isDrinksActive, setIsDrinksActive] = useState(false);
  const activeCategories = () => {
    const categories = []

  if (isStartersActive) categories.push('starters');
  if (isDessertsActive) categories.push('desserts');
  if (isDrinksActive) categories.push('drinks');
  if (isMainsActive) categories.push('mains');
  
  return categories;
  }

  const manageDatabase = async () => {
    await createTable();
    const data = await fetchMenu();
    await saveMenuItems(data);

  }
  

  const navigation = useNavigation();
  const handleProfileIconClick = () => { 
    navigation.navigate('Profile');
  }

  useEffect(() => {
    manageDatabase();
    const loadData = async () => {
      const categories = activeCategories();
      const filteredItems = await filterByQueryAndCategories(query, categories);
      setData(filteredItems);
    };
    loadData()
  }, [isDessertsActive, isDrinksActive, isMainsActive, isStartersActive, query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo-long-text.png')} resizeMode="contain" style={styles.logoLemon}/>
        <TouchableOpacity onPress={handleProfileIconClick}>
          <Image source={require('../assets/profile-icon.png')} resizeMode="contain" style={styles.logoProfile} />
        </TouchableOpacity>
      </View>
      <View style={styles.introBox}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.introTextContainer}>
        <Text style={styles.headerText}>Little Lemon</Text>
        <Text style={styles.headerSubText}>Chicago</Text>
        <Text style={styles.paragraph}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
      </View>
      <View>
      <Image source={require('../assets/intro-image.jpg')} resizeMode="contain" style={styles.introImage} />
      </View>
      </View>
      <View style={styles.searchContainer}>
        <Image  source={require('../assets/search-icon.png')} style={styles.searchIcon}/>
        <TextInput value={query} onChangeText={setQuery} style={{ width: '80%', height: '30'}}/>
      </View>
      </View>
      <View style={{ marginLeft: 20, marginTop: 20 }}>
        <Text style={[styles.headerText, { color: 'black', fontSize: 17}]}>ORDER FOR DELIVERY!</Text>
        <ScrollView horizontal={true}>
          <TouchableOpacity onPress={() => setIsStartersActive(!isStartersActive)} style={isStartersActive ? styles.filterButtonActive : styles.filterButton}><Text style={styles.filterButtonText}>Starters</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMainsActive(!isMainsActive)} style={isMainsActive ? styles.filterButtonActive : styles.filterButton}><Text style={styles.filterButtonText}>Mains</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDessertsActive(!isDessertsActive)} style={isDessertsActive ? styles.filterButtonActive : styles.filterButton}><Text style={styles.filterButtonText}>Desserts</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDrinksActive(!isDrinksActive)} style={isDrinksActive ? styles.filterButtonActive : styles.filterButton}><Text style={styles.filterButtonText}>Drinks</Text></TouchableOpacity>
        </ScrollView>
        <View style={{height: 0.5, width: '95%', backgroundColor: 'black'}}/>
      </View>
      <FlatList ItemSeparatorComponent={itemSeperator} data={data} renderItem={({item}) => 
        <TouchableOpacity style={{flexDirection: 'row', padding: 15, justifyContent: 'space-between'}}>
          <View style={{width: '60%', alignSelf: 'flex-start'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>{item.name}</Text>
            <Text style={{color: 'gray', marginTop: 5, marginBottom: 5}} numberOfLines={2}>{item.description}</Text>
            <Text style={{fontWeight: 'bold'}}>${item.price}</Text>
          </View>
          <View style={{alignSelf: 'flex-end'}}>
            <Image style={{resizeMode: 'fill', width: '100', height: '100', backgroundColor: 'gray', borderRadius: 10}} source={{uri : `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/refs/heads/main/images/${item.image}`,}}/>
          </View>
        </TouchableOpacity>
        } />


    </SafeAreaView>
  )  
  };

const styles = StyleSheet.create({
  container : {
    flex: 1,
  },
  header : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    
  },
  logoLemon : {
    alignSelf: 'flex-start',
    width: 200,
    height: 40,
  },
  logoProfile : {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
  },
  introBox : {
    backgroundColor: '#495E57'

  },
  headerText : {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#F4CE14',
    marginBottom: 10,
  },
  headerSubText : {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  paragraph : {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
    width: 170
  },
  introTextContainer : {
    marginTop: 20,
    marginLeft: 20,
  },
  introImage : {
    width: 105,
    height: 160,
    marginTop: 30,
    marginLeft: 55,
    borderRadius: 30,
  },
  searchIcon: {
    height: 30,
    width: 30,
    marginLeft: '10'
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '90%',
    height: 40,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  filterButton: {
    padding: 10, margin: 10, borderRadius: 15, backgroundColor: 'lightgray'
  
  },
  filterButtonActive: {
    padding: 10, margin: 10, borderRadius: 15, backgroundColor: '#F4CE14'
  },

  filterButtonText: {
    color: '#495E57',
    fontWeight: 'bold',
  }
});


export default Home;