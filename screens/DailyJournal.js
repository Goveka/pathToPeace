import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TextInput, Button,ActivityIndicator,Image,ImageBackground,StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';

const DailyJournal= ()=>{

  const [dailyAccomplishment, setDailyAccomplishment] = useState('');
  const [boundariesToBeEnforced, setBoundariesToBeEnforced] = useState('');
  const [topPriorities, setTopPriorities]= useState('');
  const [thingsDoneBetter, setThingsDoneBetter]= useState('');
  const [struggles, setStruggles]= useState('');
  const [momentsToRemember, setMomentsToRemember]= useState('');
  const [moodTriggers, setMoodTriggers]= useState('');
  const navigation = useNavigation();
  const [day, setDay]=useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage]= useState('')
  const  [username, setUsername]= useState('');

  // Check if the stored JWT is valid and if it is valid skip the login process
useEffect(() => { retrieveToken();}, []); 

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
          setDay(data.day);
          setUsername(data.username);
        } else {
          // Handle invalid token scenario (e.g., clear token and redirect to login)
          console.warn('Invalid token:', data.message);
          deleteItemAsync('my_token')
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


    const handleJournal= async()=>{
        try {
                // Check for empty inputs
      const allInputsFilled = [
        dailyAccomplishment,
        boundariesToBeEnforced,
        topPriorities,
        thingsDoneBetter,
        struggles,
        momentsToRemember,
        moodTriggers,
      ].every((input) => input.trim() !== '');

      if (!allInputsFilled) {
        setMessage('Please fill in all fields');
        setIsLoading(false);
        return;
      }
          setIsLoading(true);
          const token = await SecureStore.getItemAsync('my_token');
            const response = await fetch('https://pathtopeaceserver.onrender.com/dailyJournal', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  date: new Date(),
                  day:day,
                  token:token,
                  dailyAccomplishment,
                  boundariesToBeEnforced,
                  topPriorities,
                  thingsDoneBetter,
                  struggles,
                  momentsToRemember,
                  moodTriggers,
                }),
              });
              const data = await response.json();

              if (data.message === 'journal saved successfully') {
                setMessage(data.message)
              } else {
                setMessage(data.message)
              }
            } catch (error) {
              console.error(error);
            }finally {
              setIsLoading(false); // Hide loader
            }
    }

    return(
      <ImageBackground
      source={require('../assets/PathtoPeaceStarryNightBackground.png')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'transparent', justifyContent: 'center', padding: 10 }}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, backgroundColor:'#3E8BA9', textAlign:'center'}}>{username}</Text>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginBottom: 5, backgroundColor: '#3E8BA9',textAlign:'center' }} >Day:{day}/30</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#3E8BA9' }}>Write down your proud accomplishments today?</Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={{ backgroundColor: 'white',borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
        onChangeText={setDailyAccomplishment}
        value={dailyAccomplishment}
      />
    
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#3E8BA9' }}>Are there any boundaries you need to reinforce today?</Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={{backgroundColor: 'white', borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
        onChangeText={setBoundariesToBeEnforced}
        value={boundariesToBeEnforced}
      />
    
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#3E8BA9' }}>What are/were your top priorities?</Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={{backgroundColor: 'white', borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
        onChangeText={setTopPriorities}
        value={topPriorities}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#3E8BA9' }}>what is that one thing you will do/could have done better today?</Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={{ backgroundColor: 'white',borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
        onChangeText={ setThingsDoneBetter}
        value={thingsDoneBetter}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#3E8BA9' }}>What is something you struggled with today?</Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={{ backgroundColor: 'white',borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
        onChangeText={ setStruggles}
        value={struggles}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#3E8BA9' }}>what are the moments today that you would like to remember?</Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={{ backgroundColor: 'white',borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
        onChangeText={ setMomentsToRemember}
        value={momentsToRemember}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#3E8BA9' }}>Are there any specific triggers or moments influencing your mood today?</Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={{backgroundColor: 'white', borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
        onChangeText={ setMoodTriggers}
        value={moodTriggers}
      />
          {isLoading ? (
          <ActivityIndicator size="large" color="#3E8BA9" />
        ) : null}

        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'green' }}>{message}</Text>
      
      <Button
        style={{ backgroundColor: '#3E8BA9' }}
        title="Submit Journal"
        onPress={handleJournal}
      />
    </ScrollView>
    </ImageBackground>
    )
}


export default DailyJournal;

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
    width: 380,
  },
})