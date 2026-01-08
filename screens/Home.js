import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { fetchMenu } from '../utils/menu';

import {
  saveMenuItems,
  createTable,
  filterByQueryAndCategories
} from '../utils/databaseMenu';
import itemSeperator from '../components/itemSeperator';
import Filter from  '../components/Filter'


const Home = ({menuCategories}) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [activeCategories, setActiveCategories] = useState([])
  const navigation = useNavigation();
  
  const handleFilterSelection = (filter) => {
  console.log('handleFilterSelection called')
  setActiveCategories(prev => {
      if (prev.includes(filter)) {
        console.log('filter removed')
        return prev.filter(c => c !== filter)
      } else {
        console.log('filter added')
        return [...prev, filter]
      }
    })
  }
  
  const handleItemPress = (item) => {
    console.log(item, 'pressed')
  }

  const manageDatabase = async () => {
    await createTable();
    const data = await fetchMenu();
    await saveMenuItems(data);
  };

  const handleProfileIconClick = () => {
    navigation.navigate('Profile');
  };
  useEffect(() => {
    manageDatabase();}, []

  );
  useEffect(() => {

    const loadData = async () => {
      const filteredItems = await filterByQueryAndCategories(
        query,
        activeCategories
      );
      setData(filteredItems);
    };

    loadData();
  }, [menuCategories,activeCategories, query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo-long-text.png')}
          resizeMode="contain"
          style={styles.logoLemon}
        />

        <TouchableOpacity onPress={handleProfileIconClick}>
          <Image
            source={require('../assets/profile-icon.png')}
            resizeMode="contain"
            style={styles.logoProfile}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.introBox}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.introTextContainer}>
            <Text style={styles.headerText}>Little Lemon</Text>
            <Text style={styles.headerSubText}>Chicago</Text>
            <Text style={styles.paragraph}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>

          <View>
            <Image
              source={require('../assets/intro-image.jpg')}
              resizeMode="contain"
              style={styles.introImage}
            />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Image
            source={require('../assets/search-icon.png')}
            style={styles.searchIcon}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            style={{ width: '80%', height: '30' }}
          />
        </View>
      </View>

      <View style={{ marginLeft: 20, marginTop: 20 }}>
        <Text
          style={[
            styles.headerText,
            { color: 'black', fontSize: 17 },
          ]}
        >
          ORDER FOR DELIVERY!
        </Text>

        <ScrollView horizontal={true}>
          <Filter categories={menuCategories} onClick={handleFilterSelection} activeCat={activeCategories}/>
        </ScrollView>

        <View
          style={{
            height: 0.5,
            width: '95%',
            backgroundColor: 'black',
          }}
        />
      </View>

      <FlatList
        keyExtractor={item => item.id.toString()}
        data={data}
        ItemSeparatorComponent={itemSeperator}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleItemPress(item)}
            style={{
              flexDirection: 'row',
              padding: 15,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ width: '60%' }}>
              <Text
                style={{ fontWeight: 'bold', fontSize: 20 }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  color: 'gray',
                  marginTop: 5,
                  marginBottom: 5,
                }}
                numberOfLines={2}
              >
                {item.description}
              </Text>

              <Text style={{ fontWeight: 'bold' }}>
                ${item.price}
              </Text>
            </View>

            <View>
              <Image
                style={{
                  resizeMode: 'fill',
                  width: '100',
                  height: '100',
                  backgroundColor: 'gray',
                  borderRadius: 10,
                }}
                source={{
                  uri: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/refs/heads/main/images/${item.image}`,
                }}
              />
            </View>
          </TouchableOpacity>
        )}
      />



    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  logoLemon: {
    width: 200,
    height: 40,
  },

  logoProfile: {
    width: 40,
    height: 40,
  },

  introBox: {
    backgroundColor: '#495E57',
  },

  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#F4CE14',
    marginBottom: 10,
  },

  headerSubText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

  paragraph: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
    width: 170,
  },

  introTextContainer: {
    marginTop: 20,
    marginLeft: 20,
  },

  introImage: {
    width: 105,
    height: 160,
    marginTop: 30,
    marginLeft: 55,
    borderRadius: 30,
  },

  searchIcon: {
    height: 30,
    width: 30,
    marginLeft: '10',
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
    padding: 10,
    margin: 10,
    borderRadius: 15,
    backgroundColor: 'lightgray',
  },

  filterButtonActive: {
    padding: 10,
    margin: 10,
    borderRadius: 15,
    backgroundColor: '#F4CE14',
  },

  filterButtonText: {
    color: '#495E57',
    fontWeight: 'bold',
  },
});

export default Home;
