export default {
  name: 'eco-quiz-mobile',
};import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scannez pour partager l'application !</Text>
      <Image 
        source={require('../../../../frame.png')} 
        style={styles.qrCode} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3f5ea', // Assorti au fond de votre app
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1fae87',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrCode: {
    width: 250,
    height: 250,
  },
});