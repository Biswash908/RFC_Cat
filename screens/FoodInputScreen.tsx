import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const FoodInputScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Start with an empty list of ingredients
  const [ingredients, setIngredients] = useState([]);
  const [totalMeat, setTotalMeat] = useState(0);
  const [totalBone, setTotalBone] = useState(0);
  const [totalOrgan, setTotalOrgan] = useState(0);

  useEffect(() => {
    // Check if there's a new ingredient coming from FoodInfoScreen
    if (route.params?.updatedIngredient) {
      const newIngredient = route.params.updatedIngredient;
      const updatedIngredients = [...ingredients, newIngredient];
      setIngredients(updatedIngredients);

      // Update total percentages
      const totalWeight = updatedIngredients.reduce((sum, ing) => sum + ing.totalWeight, 0);
      const meatPercentage = updatedIngredients.reduce((sum, ing) => sum + ing.meatWeight, 0) / totalWeight * 100 || 0;
      const bonePercentage = updatedIngredients.reduce((sum, ing) => sum + ing.boneWeight, 0) / totalWeight * 100 || 0;
      const organPercentage = updatedIngredients.reduce((sum, ing) => sum + ing.organWeight, 0) / totalWeight * 100 || 0;

      setTotalMeat(meatPercentage);
      setTotalBone(bonePercentage);
      setTotalOrgan(organPercentage);
    }
  }, [route.params?.updatedIngredient]);

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
        <Text style={styles.totalText}>
          Total: {totalMeat.toFixed(2)}% Meat  {totalBone.toFixed(2)}% Bone  {totalOrgan.toFixed(2)}% Organ
        </Text>
      </View>

      <ScrollView style={styles.ingredientList}>
        {ingredients.length === 0 ? (
          <Text style={styles.noIngredientsText}>No ingredients added yet</Text>
        ) : (
          ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientText}>{ingredient.name}</Text>
                <Text style={styles.ingredientDetails}>
                  M: {ingredient.meatWeight.toFixed(2)} kg  B: {ingredient.boneWeight.toFixed(2)} kg  O: {ingredient.organWeight.toFixed(2)} kg
                </Text>
                <Text style={styles.totalWeightText}>Total: {ingredient.totalWeight.toFixed(2)} kg</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('FoodInfoScreen', { ingredient, editMode: true })}
              >
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
    backgroundColor: '#32CD32',
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
    marginBottom: 10,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 5,
  },
  ingredientDetails: {
    fontSize: 14,
    color: '#555',
  },
  totalWeightText: {
    fontSize: 14,
    color: '#555',
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#32CD32',
  },
});

export default FoodInputScreen;
