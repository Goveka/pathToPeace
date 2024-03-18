import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigation = useNavigation();

  
  const handleResetPasswordRequest = async () => {
    try {
      setIsLoading(true);

      // Validate email address
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
       setSuccessMessage('Please enter a valid email')
      }


      // Send the reset URL and email to the server
      // Replace with your secure backend API endpoint, error handling, and success/failure messages
      const response = await fetch('https://pathtopeaceserver.onrender.com/reset-password-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === 'Password reset email sent') {
        setSuccessMessage('Password reset link sent to your email. Please check your inbox.');
      } else {
        alert(data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage('Password reset request failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Reset Request</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      {isLoading && <ActivityIndicator size="large" color="#3E8BA9" />}
      <Button title="Confirm Email" onPress={handleResetPasswordRequest} />
      <Button title='Reset password' onPress={() => navigation.navigate('PasswordReset')} />
      {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});


export default PasswordResetRequest;
