import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const FoodInputScreen = () => {
  const navigation = useNavigation();

  // Start with an empty list of ingredients
  const [ingredients, setIngredients] = useState([]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Raw Feeding Calculator</Text>
      </View>

      <View style={styles.ingredientsInputBar}>
        <Text style={styles.ingredientsInputText}>Ingredients Input</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.totalBar}>
        <Text style={styles.totalText}>Total: 0.00% Meat  0.00% Bone  0.00% Organ</Text>
      </View>

      <ScrollView style={styles.ingredientList}>
        {ingredients.length === 0 ? (
          <Text style={styles.noIngredientsText}>No ingredients added yet</Text>
        ) : (
          ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>{ingredient.name}</Text>
              <Text style={styles.ingredientDetails}>
                {ingredient.meat} M  {ingredient.bone} B  {ingredient.organ} O  {ingredient.weight}
              </Text>
              <TouchableOpacity style={styles.editButton}>
                <FontAwesome name="edit" size={20} color="black" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <FontAwesome name="list" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    backgroundColor: '#32CD32', // Bright green color
    padding: 15,
    alignItems: 'center',
  },
  topBarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  ingredientsInputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  ingredientsInputText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalBar: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ingredientList: {
    flex: 1,
  },
  noIngredientsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  ingredientText: {
    fontSize: 16,
  },
  ingredientDetails: {
    fontSize: 14,
    color: '#555',
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#32CD32', // Bright green color
  },
});

export default FoodInputScreen;
