import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://192.168.43.154:6000/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, token }),
      });

      const data = await response.json();

      if (data.message === 'Password reset successful') {
        alert('Password reset successful');
        navigation.navigate('Login');
      } else {
        setMessage(
          'Invalid temporary key. Ensure you copied the correct key or request a new one.'
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setMessage('Unknown error! Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.fieldLabel}>Temporary Key</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Paste the key here"
          value={token}
          onChangeText={setToken}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.fieldLabel}>New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.fieldLabel}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3E8BA9" style={styles.loader} />
      ) : null}

      <Text style={styles.message}>{message}</Text>

      <Button title="Reset Password" onPress={handleResetPassword} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
  },
  message: {
    marginTop: 10,
    color: '#c0392b', // Adjusted message color for better visibility
  },
  loader: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3E8BA9', // Adjusted button color as desired
    borderRadius: 5,
  },
});

export default PasswordReset;
