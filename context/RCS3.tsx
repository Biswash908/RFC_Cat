import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useUnit } from '../UnitContext';

export type Ingredient = {
  name: string;
  meatWeight: number;
  boneWeight: number;
  organWeight: number;
  totalWeight: number;
  unit: 'g' | 'kg' | 'lbs';
};

export type RootStackParamList = {
  RecipeContentScreen: { recipeId: string; recipeName: string }; 
  RecipeFoodInfoScreen: { ingredient: Ingredient; editMode: boolean };
  RecipeSearchScreen: undefined;
  CalculatorScreen: { meat: number; bone: number; organ: number };
};

type RecipeContentScreenRouteProp = RouteProp<RootStackParamList, 'RecipeContentScreen'>;

const RecipeContentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RecipeContentScreenRouteProp>();
  const { unit: globalUnit } = useUnit();

  const { recipeName, recipeId } = route.params;

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [totalMeat, setTotalMeat] = useState(0);
  const [totalBone, setTotalBone] = useState(0);
  const [totalOrgan, setTotalOrgan] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    loadRecipeIngredients();
  }, []);

  useEffect(() => {
    console.log(`Recipe ID: ${recipeId}, Recipe Name: ${recipeName}`);
  }, [recipeId]);

  useEffect(() => {
    const newIngredient = route.params?.updatedIngredient;
    if (newIngredient) {
      newIngredient.unit = newIngredient.unit || globalUnit;

      const existingIngredientIndex = ingredients.findIndex(ing => ing.name === newIngredient.name);

      let updatedIngredients;
      if (existingIngredientIndex !== -1) {
        updatedIngredients = ingredients.map((ing, index) =>
          index === existingIngredientIndex ? newIngredient : ing
        );
      } else {
        updatedIngredients = [...ingredients, newIngredient];
      }

      setIngredients(updatedIngredients);
      calculateTotals(updatedIngredients);
    }
  }, [route.params?.updatedIngredient]);

  const loadRecipeIngredients = async () => {
    try {
      const storedRecipe = await AsyncStorage.getItem(`recipe_${recipeId}`);
      if (storedRecipe) {
        const parsedRecipe = JSON.parse(storedRecipe);
        setIngredients(parsedRecipe.ingredients || []);
        setTotalMeat(parsedRecipe.totalMeat || 0);
        setTotalBone(parsedRecipe.totalBone || 0);
        setTotalOrgan(parsedRecipe.totalOrgan || 0);
        setTotalWeight(parsedRecipe.totalWeight || 0);
      }
    } catch (error) {
      console.error('Failed to load recipe', error);
    }
  };

  const saveRecipe = async () => {
    try {
      if (!recipeId) {
        Alert.alert('Error', 'No recipe ID found. Unable to save.');
        return;
      }

      const recipeData = {
        ingredients,
        totalMeat,
        totalBone,
        totalOrgan,
        totalWeight,
      };

      await AsyncStorage.setItem(`recipe_${recipeId}`, JSON.stringify(recipeData));

      Alert.alert('Success', 'Recipe saved successfully!');
    } catch (error) {
      console.error('Failed to save recipe', error);
      Alert.alert('Error', 'Failed to save the recipe. Please try again.');
    }
  };

  const calculateTotals = (updatedIngredients: Ingredient[]) => {
    const totalWt = updatedIngredients.reduce((sum, ing) =>
      sum + convertToUnit(ing.totalWeight, ing.unit, globalUnit), 0
    );
    const meatWeight = updatedIngredients.reduce((sum, ing) =>
      sum + convertToUnit(ing.meatWeight, ing.unit, globalUnit), 0
    );
    const boneWeight = updatedIngredients.reduce((sum, ing) =>
      sum + convertToUnit(ing.boneWeight, ing.unit, globalUnit), 0
    );
    const organWeight = updatedIngredients.reduce((sum, ing) =>
      sum + convertToUnit(ing.organWeight, ing.unit, globalUnit), 0
    );

    setTotalWeight(totalWt);
    setTotalMeat(meatWeight);
    setTotalBone(boneWeight);
    setTotalOrgan(organWeight);
  };

  const convertToUnit = (weight: number, fromUnit: 'g' | 'kg' | 'lbs', toUnit: 'g' | 'kg' | 'lbs') => {
    if (fromUnit === toUnit) return weight;
    switch (fromUnit) {
      case 'g':
        return toUnit === 'kg' ? weight / 1000 : weight / 453.592;
      case 'kg':
        return toUnit === 'g' ? weight * 1000 : weight * 2.20462;
      case 'lbs':
        return toUnit === 'g' ? weight * 453.592 : weight / 2.20462;
    }
  };

  const handleDeleteIngredient = (name: string) => {
    Alert.alert(
      'Delete Ingredient',
      `Are you sure you want to delete ${name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedIngredients = ingredients.filter(ingredient => ingredient.name !== name);
            setIngredients(updatedIngredients);
            calculateTotals(updatedIngredients);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const formatWeight = (weight: number, unit: 'g' | 'kg' | 'lbs') => {
    return `${weight.toFixed(2)} ${unit}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <View style={styles.totalBar}>
          <Text style={styles.totalText}>
            Total: {formatWeight(isNaN(totalWeight) ? 0 : totalWeight, globalUnit)}
          </Text>
          <Text style={styles.subTotalText}>
            Meat: {formatWeight(totalMeat, globalUnit)} ({totalWeight > 0 ? (totalMeat / totalWeight * 100).toFixed(2) : 0}%)
            | Bone: {formatWeight(totalBone, globalUnit)} ({totalWeight > 0 ? (totalBone / totalWeight * 100).toFixed(2) : 0}%)
            | Organ: {formatWeight(totalOrgan, globalUnit)} ({totalWeight > 0 ? (totalOrgan / totalWeight * 100).toFixed(2) : 0}%)
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {ingredients.length === 0 ? (
            <Text style={styles.noIngredientsText}>No ingredients added yet</Text>
          ) : (
            ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientInfo}>
                  <Text style={styles.ingredientText}>{ingredient.name}</Text>
                  <Text style={styles.ingredientDetails}>
                    M: {formatWeight(ingredient.meatWeight, ingredient.unit)} B: {formatWeight(ingredient.boneWeight, ingredient.unit)} O: {formatWeight(ingredient.organWeight, ingredient.unit)}
                  </Text>
                  <Text style={styles.totalWeightText}>Total: {formatWeight(isNaN(ingredient.totalWeight) ? 0 : ingredient.totalWeight, ingredient.unit)}</Text>
                </View>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('RecipeFoodInfoScreen', { ingredient, editMode: true, recipeName })}
                  >
                    <FontAwesome name="edit" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteIngredient(ingredient.name)}
                  >
                    <FontAwesome name="trash" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.calculateButtonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.ingredientButton}
              onPress={() => navigation.navigate('RecipeSearchScreen', { recipeName, recipeId })}
            >
              <Text style={styles.ingredientButtonText}>Add Ingredients</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveRecipe}
            >
              <Text style={styles.saveButtonText}>Save Recipe</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={() =>
              navigation.navigate('CalculatorScreen', { meat: totalMeat, bone: totalBone, organ: totalOrgan })
            }
          >
            <Text style={styles.calculateButtonText}>Select Ratio & Calculate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  totalBar: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTotalText: {
    fontSize: 14,
    color: '#707070',
    marginTop: 5,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  noIngredientsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#A0A0A0',
    textAlign: 'center',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ingredientDetails: {
    fontSize: 14,
    color: '#707070',
  },
  totalWeightText: {
    fontSize: 14,
    color: '#909090',
    marginTop: 5,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
  calculateButtonContainer: {
    padding: 20,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ingredientButton: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 15,
    borderRadius: 10,
    width: '48%',
  },
  ingredientButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 15,
    borderRadius: 10,
    width: '48%',
  },
  saveButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  calculateButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default RecipeContentScreen;
