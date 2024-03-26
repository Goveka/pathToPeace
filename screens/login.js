import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button,Image,ImageBackground, StyleSheet,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { registerForPushNotificationsAsync, sendPushNotification } from '../helperFunctions/pushNotifications';
import { SafeAreaView } from 'react-native-safe-area-context';



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionMsg, setSessionMsg]= useState('')
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();


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
            navigation.navigate('HomeScreen');
          } else {
            // Handle invalid token scenario (e.g., clear token and redirect to login)
            SecureStore.deleteItemAsync('my_token');
            setSessionMsg('Your session has expired, please Login again') 
            setIsLoading(false); 
          }
        })
        .catch(error => {
          // Handle server error gracefully (e.g., display a message and retry)
          setSessionMsg('Network error!!, please check your connection and try again');
          setIsLoading(false); 
        })
        .finally(()=>{
          setIsLoading(false); // Hide loader
        });
    };
  };


  const handleLogin = async () => {
 
    try {
      retrieveToken();
      setIsLoading(true);
       // Check for empty inputs
       const allInputsFilled = [
        email,
        password,
       ].every((input) => input.trim() !== '');

      if (!allInputsFilled) {
        setSessionMsg('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      const response = await fetch('https://pathtopeaceserver.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.token) {

        // Schedule push notifications at 4-hour intervals
      const intervalId = setInterval(async () => {
        // Retrieve the Expo push token after successful login
        const expoPushToken = await registerForPushNotificationsAsync();

        // Send push notification using the retrieved token
        await sendPushNotification(expoPushToken);
      }, 60 * 1000); // 4 hours in milliseconds

      // Save the intervalId to clear it later (e.g., when the user logs out)
      SecureStore.setItemAsync('notificationIntervalId', intervalId.toString());

        // Store token securely using SecureStore
        await SecureStore.setItemAsync('my_token', data.token);
        navigation.navigate('HomeScreen');
      } else {
        setSessionMsg('Invalid credentials!!, please try again.')
      }
    } catch (error) {
      setSessionMsg('Invalid credentials!!, please try again.')
    }finally {
      setIsLoading(false); // Hide loader
    }
  };


  return( 

    <ImageBackground
    source={require('../assets/PathtoPeaceStarryNightBackground.png')}
    style={styles.backgroundImage}
  >
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', width:380 }}>

    <Image source={require('../assets/PathtoPeaceLogoStatic.png')} style={{ width: 100, height: 100, marginBottom: 20 }} />
    {isLoading ? (
          <ActivityIndicator size="large" color="#3E8BA9" />
        ) : null}
<Text style={{ color: '#E40602', fontWeight: 'bold', fontSize: 19, marginBottom: 5 }} >{sessionMsg}</Text>

  <View style={{ width: '80%' }}>
  {/* Email Input */}
    <Text style={{ color: '#3E8BA9', fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Email:</Text>
    <TextInput
      style={{ borderColor: '#3E8BA9', backgroundColor: 'white', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 }}
      onChangeText={setEmail}
      value={email}
    />

    {/* Password Input */}
    <Text style={{ color: '#3E8BA9', fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Password:</Text>
    <TextInput
      style={{ borderColor: '#3E8BA9',  backgroundColor: 'white', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
      onChangeText={setPassword}
      value={password}
      secureTextEntry={true}
    />

    {/* Login Button */}
    <Button
      style={{ backgroundColor: '#3E8BA9' }}
      title="Login"
      onPress={handleLogin}
    />

    {/* Register Button */}
    <Button
      title="Register"
      onPress={() => navigation.navigate('Register')}
    />

    {/* Forgotten Password Link */}
    <Text style={{ color: '#3E8BA9', marginTop: 10 , width:200}} onPress={() => navigation.navigate('PasswordResetRequest')}>Forgotten password</Text>
  </View>
  </SafeAreaView>
  </ImageBackground>
  );
};

export default LoginScreen;

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
