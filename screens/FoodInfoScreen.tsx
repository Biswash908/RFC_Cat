// FoodInfoScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FoodInfoScreen = ({ route }: { route: any }) => {
  const { foodName, foodAmount } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Information</Text>
      <Text style={styles.label}>Food Name:</Text>
      <Text style={styles.info}>{foodName}</Text>
      <Text style={styles.label}>Food Amount:</Text>
      <Text style={styles.info}>{foodAmount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F4E3',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default FoodInfoScreen;
