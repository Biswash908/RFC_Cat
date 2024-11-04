import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, SafeAreaView, StatusBar, BackHandler } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useUnit } from '../UnitContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Ingredient = {
  name: string;
  meatWeight: number;
  boneWeight: number;
  organWeight: number;
  totalWeight: number;
  unit: 'g' | 'kg' | 'lbs';
};

export type RootStackParamList = {
  RecipeContentScreen: { recipeName: string, updatedIngredient?: Ingredient };
  RecipeFoodInfoScreen: { ingredient: Ingredient; editMode: boolean, recipeName: string };
  RecipeSearchScreen: { recipeName: string };
  CalculatorScreen: { meat: number; bone: number; organ: number };
};

type RecipeContentScreenRouteProp = RouteProp<RootStackParamList, 'RecipeContentScreen'>;

const RecipeContentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RecipeContentScreenRouteProp>();
  const { unit: globalUnit } = useUnit();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [totalMeat, setTotalMeat] = useState(0);
  const [totalBone, setTotalBone] = useState(0);
  const [totalOrgan, setTotalOrgan] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [isSaved, setIsSaved] = useState(true);

  const recipeName = route.params?.recipeName || 'Recipe';

  useLayoutEffect(() => {
    navigation.setOptions({ title: recipeName });
    loadRecipe();
  }, [navigation, recipeName]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecipe();
    });

    return unsubscribe;
  }, [navigation, recipeName]);

  useEffect(() => {
    const newIngredient = route.params?.updatedIngredient;
    if (newIngredient) {
      addOrUpdateIngredient(newIngredient);
    }
  }, [route.params?.updatedIngredient]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [isSaved]);

  const handleBackPress = () => {
    if (!isSaved) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save them before leaving?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Don\'t Save', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Save', onPress: saveRecipe }
        ]
      );
      return true;
    }
    return false;
  };

  const saveRecipe = async () => {
    try {
      const recipeData = { ingredients };
      console.log('Saving Recipe Data:', recipeData);
      await AsyncStorage.setItem(recipeName, JSON.stringify(recipeData));
      Alert.alert('Success', 'Your recipe and ingredients have been saved.');
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Error', 'Failed to save the recipe.');
    }
  };

  const loadRecipe = async () => {
    try {
      const savedRecipe = await AsyncStorage.getItem(recipeName);
      if (savedRecipe) {
        const { ingredients } = JSON.parse(savedRecipe);
        console.log('Loaded Ingredients:', ingredients);
        setIngredients(ingredients);
        calculateTotals(ingredients);
      } else {
        console.log('No saved recipe found for:', recipeName);
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
    }
  };

  const addOrUpdateIngredient = (newIngredient: Ingredient) => {
    newIngredient.unit = newIngredient.unit || globalUnit;

    setIngredients(prevIngredients => {
      const existingIngredientIndex = prevIngredients.findIndex(ing => ing.name === newIngredient.name);
      let updatedIngredients;

      if (existingIngredientIndex !== -1) {
        updatedIngredients = prevIngredients.map((ing, index) =>
          index === existingIngredientIndex ? newIngredient : ing
        );
      } else {
        updatedIngredients = [...prevIngredients, newIngredient];
      }

      console.log('Updated Ingredients:', updatedIngredients);

      calculateTotals(updatedIngredients);
      setIsSaved(false);
      return updatedIngredients;
    });
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

  const handleDeleteIngredient = (name: string) => {
    Alert.alert(
      'Delete Ingredient',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const updatedIngredients = ingredients.filter(ing => ing.name !== name);
            setIngredients(updatedIngredients);
            calculateTotals(updatedIngredients);
            setIsSaved(false);
          },
        },
      ]
    );
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

  const formatWeight = (weight: number, weightUnit: 'g' | 'kg' | 'lbs') => {
    return weight.toFixed(2) + ' ' + weightUnit;
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
              onPress={() => navigation.navigate('RecipeSearchScreen', { recipeName })}
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
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  totalBar: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ded8d7',
    backgroundColor: 'white',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  subTotalText: {
    fontSize: 16,
    color: 'black',
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 5,
  },
  noIngredientsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 50,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ingredientDetails: {
    fontSize: 16,
    color: '#404040',
  },
  totalWeightText: {
    fontSize: 16,
    color: '#404040',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  editButton: {
    marginRight: 20,
  },
  deleteButton: {
    padding: 5,
  },
  calculateButtonContainer: {
    padding: 20,
    borderTopWidth: 0.7,
    borderTopColor: '#ded8d7',
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ingredientButton: {
    flex: 1,
    backgroundColor: '#000080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 33,
    borderRadius: 10,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#000080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 33,
    borderRadius: 10,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calculateButton: {
    backgroundColor: '#000080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 33,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default RecipeContentScreen2;