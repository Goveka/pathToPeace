import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, StyleSheet, Button,ImageBackground,ActivityIndicator} from 'react-native';
import * as Progress from 'react-native-progress';
import * as SecureStore from 'expo-secure-store';

const EmotionalRating = ({ navigation }) => {
  const [fatigueAndExhaustion, setFatigueAndExhaustion] = useState(0.0);
  const [anxiety, setAnxiety] = useState(0.0);
  const [emotionalNumbness, setEmotionalNumbness] = useState(0.0);
  const [isolation, setIsolation] = useState(0.0);
  const [insecurity, setInsecurity] = useState(0.0);
  const [day, setDay]= useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage]= useState('')
  const [username, setUsername]= useState('');

  useEffect(() => {
    retrieveToken();
  }, []);

  const retrieveToken = async () => {
    const token = await SecureStore.getItemAsync('my_token');

    if (token) {
      fetch('http://192.168.43.154:6000/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message !== 'Token is valid') {
            console.warn('Invalid token:', data.message);
            SecureStore.deleteItemAsync('my_token');
            navigation.navigate('Login');
          }else{
            setDay(data.day);
            setUsername(data.username);
          }
        })
        .catch(error => {
          console.error('Error validating token:', error);
          alert('Failed to validate token. Please try again later.');
        });
    }
  };

  const calculateAverage = () => {
    const totalProgress = fatigueAndExhaustion + anxiety + emotionalNumbness + isolation + insecurity;
    const averageProgress = totalProgress / 5;
    return averageProgress * 10;
  };

  const handleProgressChange = (progressValue, setProgressFunction) => {
    return (event) => {
      if (!event.nativeEvent || event.nativeEvent.locationX === undefined) {
        return;
      }

      event.persist();

      setTimeout(() => {
      const { locationX } = event.nativeEvent;

        if (locationX !== undefined) {
          event.target.measure((_, __, width) => {
          const relativeX = locationX / width;
          const newProgressValue = Math.min(1.0, Math.max(0.0, relativeX));
            setProgressFunction(newProgressValue);
        });
      }
      }, 0);
    };
  };

  const renderProgressBarWithPercentage = (label, progress, setProgressFunction) => {
    return (
      <View style={styles.progressBarContainer}>
        <Text style={styles.label}>{label}</Text>
        <Progress.Bar
          progress={progress}
          onTouchEnd={handleProgressChange(progress, setProgressFunction)}
          style={styles.progressBar}
        />
        <Text style={styles.percentageText}>{(progress* 10).toFixed(0)}/10</Text>
      </View>
    );
  };

  const handleRatings = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('my_token');
      const response = await fetch('http://192.168.43.154:6000/emotionalRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date(),
          token: token,
          fatigueAndExhaustion,
          anxiety,
          emotionalNumbness,
          isolation,
          insecurity,
          AverageEmotion: calculateAverage(),
          day:day,
        }),
      });
      const data = await response.json();

      if (data.message === 'success') {
        setMessage(data.message)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false); // Hide loader
    };
  };

  return (
    <ScrollView style={styles.container}>
     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, backgroundColor:'#3E8BA9', textAlign:'center'}}>{username}</Text>
     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginBottom: 5, backgroundColor: '#3E8BA9',textAlign:'center' }} >Day:{day}/30</Text>
      {renderProgressBarWithPercentage('Fatigue & Exhaustion', fatigueAndExhaustion, setFatigueAndExhaustion)}
      {renderProgressBarWithPercentage('Anxiety', anxiety, setAnxiety)}
      {renderProgressBarWithPercentage('Emotional Numbness', emotionalNumbness, setEmotionalNumbness)}
      {renderProgressBarWithPercentage('Isolation', isolation, setIsolation)}
      {renderProgressBarWithPercentage('Insecurity', insecurity, setInsecurity)}

      <View style={styles.averageContainer}>
      <Text style={styles.averageLabel}>Average Progress:</Text>
        <Text style={styles.averageValue}>{calculateAverage().toFixed(2)}/10</Text>
      </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'green' }}>{message}</Text>
      {isLoading ? (
          <ActivityIndicator size="large" color="#3E8BA9" />
        ) : null}
      <Button
        style={{ backgroundColor: '#3E8BA9' }}
        title="Submit"
        onPress={handleRatings}
        />
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight:10,
  },
  loader: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: 480,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  progressBarContainer: {
    marginBottom: 15,
    height: 100,
  },
  progressBar: {
    height: 30,
    borderRadius: 5,
    backgroundColor: 'white',
    marginVertical: 5,
  },
  percentageText: {
    textAlign: 'right',
    color: '#3E8BA9',
    fontWeight: 'bold',
    fontSize: 18,
  },
  averageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  averageLabel: {
    fontSize: 18,
  },
  averageValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmotionalRating;
