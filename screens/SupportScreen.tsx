import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SupportScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@example.com');
  };

  const handleFaqsPress = () => {
    Linking.openURL('https://www.example.com/faqs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>

        <View style={styles.headerContainer}>
            <FontAwesome name="headphones" size={64} color="#1252b8" />
          <Text style={styles.contactText}>Contact Us</Text>
        </View>

        <TouchableOpacity style={styles.listItem} onPress={handleEmailPress}>
          <View style={styles.iconContainer}>
            <FontAwesome name="envelope" size={24} color="#000080" style={styles.icon} />
          </View>
          <Text style={styles.listItemText}>Send us an Email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  contactText: {
    fontSize: 24,
    color: '#000080',
    fontWeight: 'bold',
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 12,
  },
  iconContainer: {
    width: 38,
    alignItems:'center',
    justifyContent: 'center',
  },
  listItemText: {
    fontSize: 18,
    color: 'black',
  },
});

export default SupportScreen;
