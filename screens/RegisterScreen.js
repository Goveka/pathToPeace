import React, { useState } from 'react';
import { View, Text, TextInput, Button,SafeAreaView,Image,ImageBackground, StyleSheet,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from '@react-native-community/datetimepicker';


const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [country, setCountry]= useState('');
  const [city, setCity] = useState('');
  const navigation = useNavigation();
  const [mode, setMode] = useState('date');
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage]= useState('');


  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    setDateOfBirth(selectedDate);
  }

  const showDatePicker = () => {
    setMode('date');
    setShowPicker(true);
  };


  const handleRegister = async () => {
    try {
      setIsLoading(true);
            // Check for empty inputs
            const allInputsFilled = [
              username,
              email,
              password,
             ].every((input) => input.trim() !== '');
      
            if (!allInputsFilled) {
              setMessage('Please fill in all fields');
              setIsLoading(false);
              return;
            }

      const response = await fetch('https://pathtopeaceserver.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          dateOfBirth,
        }),
      });

      const data = await response.json();

      if (data.message === 'User registered successfully') {
        navigation.navigate('Login');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
    }finally {
      setIsLoading(false); // Hide loader
    };
  };
  return (
    <ImageBackground
    source={require('../assets/PathtoPeaceStarryNightBackground.png')}
    style={styles.backgroundImage}
  >
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', width: 380, }}>
       <Image source={require('../assets/PathtoPeaceLogoStatic.png')} style={{ width: 100, height: 100, marginBottom: 20 }} />

       {isLoading ? (
          <ActivityIndicator size="large" color="#3E8BA9" />
        ) : null}

        <Text style={{ color: '#E40602', fontWeight: 'bold', fontSize: 19, marginBottom: 5 }} >{message}</Text>

       <View style={{ width: '80%' }}>
        {/* Username Input */}
        <Text style={{ color: '#3E8BA9', fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Username:</Text>
        <TextInput
        style={{ backgroundColor: 'white',borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 }}
        onChangeText={setUsername}
        value={username}
       />
  
        {/* Email Input */}
       <Text style={{ color: '#3E8BA9', fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Email:</Text>
       <TextInput
        style={{backgroundColor: 'white', borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 }}
        onChangeText={setEmail}
        value={email}
       />
  
       {/* Date of Birth Input */}
       <Text style={{ color: '#3E8BA9', fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Date of Birth:</Text>
       <Button
        title="Select Date"
        onPress={showDatePicker}
        style={{ marginBottom: 10 }}
       />
       {showPicker && (
        <DatePicker
          testID="dateTimePicker"
          value={dateOfBirth}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
       )}

       <Text style={{fontWeight:'bold',fontSize: 15}} >{dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Not selected'}</Text>
       {/* Password Input */}
       <Text style={{ color: '#3E8BA9', fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Password:</Text>
       <TextInput
        style={{backgroundColor: 'white', borderColor: '#3E8BA9', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20 }}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
       />
  
       {/* Register Button */}
       <Button
        style={{ backgroundColor: '#3E8BA9' }}
        title="Register"
        onPress={handleRegister}
       />
  
       {/* Login Button */}
       <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
       />
       </View>
     </SafeAreaView>
  </ImageBackground> 
  );
};

export default RegisterScreen;


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
