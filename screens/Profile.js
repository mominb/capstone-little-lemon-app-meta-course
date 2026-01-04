import { View, Text, KeyboardAvoidingView } from 'react-native';
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Keyboard } from 'react-native';
import readUserData from '../utils/readUserData';

const Profile = () => {
  const [isChecked, setChecked] = useState(false);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const navigation = useNavigation();

  useState(() => {
    const getUserData = async () => {
      const userData = await readUserData();
      if (userData) {
        setName(userData.name);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPhone(userData.phone);
      }
    };
    getUserData();
  }, []);
  const handleSaveInfo = async () => {
    try { 
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userLastName', lastName);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPhone', phone);
      Keyboard.dismiss();
      console.log('User info saved');
    } catch (error) {
      console.log('Error saving user info:', error);
    }
  };
  const handleLogout = async () => {
    navigation.navigate('Onboarding');
    try {
        await AsyncStorage.clear();
        navigation.navigate('Onboarding');
        console.log('User data cleared');
    } catch (error) {
        console.log('Error clearing user data')
    }  
  };
  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/back-button.jpg')} resizeMode="contain" style={styles.backButton} />
          </TouchableOpacity>
          <Text style={styles.headerText}> Your Profile</Text>
        </View>
        <KeyboardAvoidingView behavior='padding' style={styles.content}>
          <ScrollView>
            <View style={styles.profileContainer}>
                <Image source={require('../assets/profile-icon.png') } resizeMode="contain" style={styles.profileImage} />
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>First Name</Text>
               <TextInput
                        onFocus={() => setIsNameFocused(true)}
                        onBlur={() => setIsNameFocused(false)}
                        style={[styles.input, isNameFocused && styles.inputFocused]}
                        value={name}
                        onChangeText={setName}
                
                      />
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                        onFocus={() => setIsLastNameFocused(true)}
                        onBlur={() => setIsLastNameFocused(false)}
                        style={[styles.input, isLastNameFocused && styles.inputFocused]}
                        value={lastName}
                        onChangeText={setLastName}
                      />
               <Text style={styles.label}>Email</Text>
               <TextInput
                        keyboardType='email-address'
                        autoCapitalize='none'
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        style={[styles.input, isEmailFocused && styles.inputFocused]}
                        value={email}
                        onChangeText={setEmail}
                      />
                <Text style={styles.label}>Phone</Text>
                <TextInput
                        keyboardType='phone-pad'
                        onFocus={() => setIsPhoneFocused(true)}
                        onBlur={() => setIsPhoneFocused(false)}
                        style={[styles.input, isPhoneFocused && styles.inputFocused]}
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
    )  
};

const styles = StyleSheet.create({
  container : {
    flex: 1,
  },
  logoutContainer :{
    borderColor: 'black',
    borderWidth: 1,
  
  },
  profileContainer : {
    height: '20%'
  },
  logoutButton : {
    alignSelf: 'center',
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: '#EDEFEE',
    borderColor: 'black',
    borderWidth: 2
  },
  content : {
  
    backgroundColor: 'white'
  },
  headerText : {
    alignSelf: 'center',
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage :{
    height: 80,
    width: 80,
    margin: 20,
    alignSelf: 'flex-start',
    
  },
  header : {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 1,
    padding: 20
  },
  
  backButton : {
    alignSelf: 'flex-start',
    width: 48,
    height: 48,
   
  },
  logoutButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderColor: '#495E57',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#EDEFEE',
  },
  inputFocused: {
    height: 48,
    borderWidth: 2,
    borderColor: '#F4CE14',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#EDEFEE',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 6,
  },
  form :{
    padding: 20,
    
  },
  saveButton : {
    alignSelf: 'center',
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: '#495E57',
    borderColor: 'black',
    borderWidth: 2,
    marginBottom: 20,
  },
  saveButtonText : {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checkboxContainer : {
    flexDirection: 'row', marginBottom: 20, marginTop: 10
  },
  checkbox :{},
  checkboxText :{
    fontSize: 14, 
    color: 'black',
    alignSelf: 'flex-end'

  },
});
export default Profile;