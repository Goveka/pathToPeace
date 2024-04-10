import React, {useState,useEffect} from 'react';
import {View, Button,TextInput, Text, ScrollView,Image,ImageBackground, StyleSheet,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser'; 
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {

  const [day, setDay]= useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername]= useState('');
  const navigation = useNavigation();
  const [message, setMessage]= useState('');
  const [prompts,setPrompts]=useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => { 
    retrieveToken();
    gettingPrompts();
  }, []); 


  const retrieveToken = async () => {
    setIsLoading(true);
 
    const token = await SecureStore.getItemAsync('my_token');


    if (token) {
      // Send the token to the server for validation using a dedicated route
      fetch('https://pathtopeaceserver.onrender.com/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Token is valid') {
            setDay(data.day)
            setUsername(data.username);
          } else {
            // Handle invalid token scenario (e.g., clear token and redirect to login)
            console.warn('Invalid token:', data.message);
            navigation.navigate('Login');
          }
        })
        .catch(error => {
          console.error('Error validating token:', error);
          // Handle server error gracefully (e.g., display a message and retry)
          alert('Failed to validate token. Please try again later.');
        })
        .finally(()=>{
          setIsLoading(false); // Hide loader
        });
    }
  };

 // saving daily prompts from the server
 const savingPrompts = async () => {
  setIsLoading(true);
  const allAnswers= answers.every((input) => input.trim() !== '');
  if (!allAnswers) {
    setMessage('Please fill in all fields');
    setIsLoading(false);
    return;
  }

  const token = await SecureStore.getItemAsync('my_token');

  if (token) {
    fetch('https://pathtopeaceserver.onrender.com/dailyPromptsAnswers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, answers }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'success') {
          setIsLoading(false);
          navigation.navigate('EmotionalRating');
          setMessage(data.message);
        } else {
          setMessage(data.message);
        }
      })
      .catch(error => {
        console.error(error)
        setMessage('Network error!');
      });
  }
};

const gettingPrompts = async () => {
  setIsLoading(true);

  const token = await SecureStore.getItemAsync('my_token');

  if(token){
    fetch('https://pathtopeaceserver.onrender.com/dailyPrompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token}),
    })
    .then(response => response.json())
    .then(data =>{
      if(!data.message === 'The user has completed the 11 day journey'){
        setMessage("You have completed the 11 day journey");
        navigation.navigate('EmotionalRating');
      }else{
        setPrompts(data.prompt);
        setIsLoading(false);
      }
    })
    .catch(error =>{
      console.error(error)
      setMessage("Network error!! please try again")
    })
  }
}

  return (
    <ImageBackground
      source={require('../assets/PathtoPeaceStarryNightBackground.png')}
      style={styles.backgroundImage}>
      <ScrollView>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, backgroundColor:'#3E8BA9', textAlign:'center'}}>WELCOME:{username}</Text>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginBottom: 5, backgroundColor: '#3E8BA9',textAlign:'center' }} >Day:{day}/30</Text>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Text style={{ color: '#FF7F50', fontWeight: 'bold', fontSize: 25, marginBottom: 3 }} >Daily Prompts</Text>
          <View>
          {prompts.length > 0 ? (
  prompts.map((prompt, index) => (
    <View key={index}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#3E8BA9' }}>
        {prompt.prompt}
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={{ backgroundColor: 'white',borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
        onChangeText={(text) => setAnswers(prevAnswers => [...prevAnswers, text])}
        value={answers[index] || ''} 
      />
    </View>
  ))
) : (
  <Text>No prompts available.</Text>
)}
                    {isLoading ? (
          <ActivityIndicator size="large" color="#3E8BA9" />
        ) : null}

        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'green' }}>{message}</Text>
      
      <Button
        style={{ backgroundColor: '#FF7F50' }}
        title="Submit prompt answers"
        onPress={savingPrompts}
      />
            </View>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Cover the entire screen
    resizeMode: 'cover', // Adjust image to fit
    justifyContent: 'center', // Align content vertically
    alignItems: 'center', // Align content horizontally
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: 480,
  },
});
