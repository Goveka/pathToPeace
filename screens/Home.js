import React, {useState,useEffect} from 'react';
import { SafeAreaView,View, Button, Text, ScrollView,Image,ImageBackground, StyleSheet,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser'; 

const HomeScreen = () => {
  const [latestRating, setLatestRating] = useState(null);
  const [latestJournal, setLatestJournal]= useState(null);
  const [day, setDay]= useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername]= useState('');
  const navigation = useNavigation();
  const [pdfAvailable, setPdfAvailable] = useState(false);
  // Check if the stored JWT is valid and if it is valid skip the login process

  useEffect(() => { 
    retrieveToken();
    fetchLatestRating();
    fetchJournal();
  }, []); 

  useEffect(() => {
    if (day >= 30) {
      handleOpenPDF(); // Trigger PDF generation on day 30
    }
  }, [day]); 

  // Function to download and display the PDF report
  const handleOpenPDF = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('my_token');
      const response = await fetch('https://pathtopeaceserver.onrender.com/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
  
      if (response.ok) {
        const pdfUrl = await response.json(); 
        setPdfAvailable(true);
        await WebBrowser.openBrowserAsync(pdfUrl.url);
        setIsLoading(false); // Open the retrieved PDF URL in the web view
      } else {
        console.error('Error generating PDF report:', response.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching PDF URL:', error);
      alert('Error generating PDF report. Please try again later.');
    }
  };
  


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

  const fetchLatestRating = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('my_token');
      const response = await fetch('https://pathtopeaceserver.onrender.com/findTheLatestEmotionalRatingByUserId', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      .then(response => response.json())
      .then(data =>{
        if (data) {
          setLatestRating(data.rating); // Update state with retrieved rating
        } else {
          alert('No latest emotional rating found');
        }
      })
    } catch (error) {
      console.error('Error fetching latest rating:', error);
      // Handle errors gracefully (e.g., display a message)
      alert('Failed to fetch latest emotional rating. Please try again later.');
    } finally{
      setIsLoading(false); // Hide loader
    };
  };

  const fetchJournal = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('my_token');
      const response = await fetch('https://pathtopeaceserver.onrender.com/findLatestJournalByUserId', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      .then(response => response.json())
      .then(data =>{

        if (data) {
          setLatestJournal(data.journal);
        } else {
          alert('No latest emotional rating found');
        }
      })

    } catch (error) {
      console.error('Error fetching latest rating:', error);
      // Handle errors gracefully (e.g., display a message)
      alert('Failed to fetch latest emotional rating. Please try again later.');
    }
    finally{
      setIsLoading(false); // Hide loader
    };
  };

  return (
    <ImageBackground
    source={require('../assets/PathtoPeaceStarryNightBackground.png')}
    style={styles.backgroundImage}
  >
    <ScrollView>
     <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, backgroundColor:'#3E8BA9', textAlign:'center'}}>Welcome:{username}</Text>
     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginBottom: 5, backgroundColor: '#3E8BA9',textAlign:'center' }} >Day:{day}/30</Text>
     <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: '5%', gap: 10 }}>

     {/* Daily Journal Section */}
     <View style={{ flexDirection: 'column', alignItems: 'center', borderRadius: 5, backgroundColor: '#3E8BA9', padding: 10 }}>
      <Ionicons name="book" size={50} color="white" />
      <Button
        style={{ backgroundColor: '#3E8BA9' }}
        title="Daily Journal"
        onPress={() => navigation.navigate('DailyJournal')}
      />


     </View>

     {/* Emotional Rating Section */}
     <View style={{ flexDirection: 'column', alignItems: 'center', borderRadius: 5, backgroundColor: '#3E8BA9', padding: 10 }}>
      <Ionicons name="happy" size={50} color="white" />
      <Button
        title="Emotional Rating"
        onPress={() => navigation.navigate('EmotionalRating')}
      />
    </View>

    {pdfAvailable && ( // Conditionally render the button
            <Button title="Open PDF Report" onPress={handleOpenPDF} />
          )}

{isLoading ? (
             <ActivityIndicator size="large" color="#3E8BA9" />
            ) : null}

    {/* Latest Journal Section */}
    <View>
      {latestJournal && (
        <>
          <Text style={{ color: '#3E8BA9', fontSize: 30, fontWeight: 'bold' }}>Previous Journal</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Daily Accomplishment:</Text>
          <Text>{latestJournal.dailyaccomplishment} </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Boundaries to be enforced:</Text>
          <Text>{latestJournal.boundariesToBeEnforced} </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Top priorities:</Text>
          <Text>{latestJournal.topPriorities}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Things done better:</Text>
          <Text>{latestJournal.thingsDoneBetter}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>struggles:</Text>
          <Text>{latestJournal.struggles}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Moments to remember:</Text>
          <Text>{latestJournal.momentsToRemember}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Mood triggers:</Text>
          <Text>{latestJournal.moodTriggers}</Text>
        </>
      )}
    </View>

    {/* Latest Rating Section */}
    <View>
      {latestRating && (
        <>
          <Text style={{ color: '#3E8BA9', fontSize: 30, fontWeight: 'bold' }}>Previous Emotional Rating</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Fatigue & Exhaustion:</Text>
          <Text>{(latestRating.fatigueAndExhaustion * 10).toFixed(0)}/10</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Anxiety:</Text>
          <Text>{(latestRating.anxiety * 10).toFixed(0)}/10</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Emotional Numbness:</Text>
          <Text>{(latestRating.emotionalNumbness * 10).toFixed(0)}/10</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}> Isolation:</Text>         
          <Text>{(latestRating.isolation * 10).toFixed(0)}/10</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}> Insecurity</Text>         
          <Text>{(latestRating.insecurity * 10).toFixed(0)}/10</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 22 }}> Average Emotion</Text>         
          <Text>{(latestRating.AverageEmotion).toFixed(0)}/10</Text>
        </>
      )}
    </View>
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
