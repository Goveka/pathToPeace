import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/login';
import PasswordReset from './screens/passwordReset';
import PasswordResetRequest from './screens/PasswordResetRequest';
import DailyJournal from './screens/DailyJournal';
import EmotionalRating from './screens/EmotionalRating';
import HomeScreen from './screens/Home';

const Stack = createStackNavigator();
const App = () => {
  
  return (
    <NavigationContainer> 
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="PasswordResetRequest" component={PasswordResetRequest} />
        <Stack.Screen name="DailyJournal" component={DailyJournal} />
        <Stack.Screen name="EmotionalRating" component={EmotionalRating} />
        <Stack.Screen name="PasswordReset" component={PasswordReset} />
        <Stack.Screen name="HomeScreen"  component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
