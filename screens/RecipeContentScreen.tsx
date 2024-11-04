import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, SafeAreaView, StatusBar, BackHandler } from 'react-native';
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
  RecipeContentScreen: { recipeId: string; recipeName: string }; // Include recipeId and recipeName
  RecipeFoodInfoScreen: { ingredient: Ingredient; editMode: boolean };
  RecipeSearchScreen: undefined;
  CalculatorScreen: { meat: number; bone: number; organ: number };
};

type RecipeContentScreenRouteProp = RouteProp<RootStackParamList, 'RecipeContentScreen'>;

const RecipeContentScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isSaved, setIsSaved] = useState(true); 
  const route = useRoute<RecipeContentScreenRouteProp>();
  const { unit: globalUnit } = useUnit();
  
  // Get the recipe name from the route
  const { recipeName, recipeId } = route.params;

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [totalMeat, setTotalMeat] = useState(0);
  const [totalBone, setTotalBone] = useState(0);
  const [totalOrgan, setTotalOrgan] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: recipeName,
      headerTitleAlign: 'left',
    });
  }, [navigation, recipeName]);

  useEffect(() => {
    console.log(`Recipe ID: ${recipeId}, Recipe Name: ${recipeName}`);
  }, [recipeId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isSaved) {
        return;
      }
  
      e.preventDefault();
  
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save them before leaving?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
          { text: 'Don\'t Save', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
          { text: 'Save', onPress: async () => {
              await handleSaveRecipe();  // Ensure the recipe is saved
              navigation.dispatch(e.data.action);  // Proceed with navigation after saving
            }
          },
        ]
      );
    });
  
    return unsubscribe;
  }, [navigation, isSaved]);

  useEffect(() => {
    if (!recipeId || !recipeName) {
      Alert.alert('Error', 'Missing Recipe Name or Recipe ID. Please try again.');
      navigation.goBack(); // Navigate back if parameters are missing
      return;
    }
  
    console.log(`Recipe ID: ${recipeId}, Recipe Name: ${recipeName}`);
  }, [recipeId, recipeName]);

  useEffect(() => {
    if (!recipeId || !recipeName) {
      Alert.alert('Error', 'Missing Recipe Name or Recipe ID. Please try again.');
      navigation.goBack(); // Navigate back if parameters are missing
      return;
    }
  
    console.log(`Recipe ID: ${recipeId}, Recipe Name: ${recipeName}`);
  }, [recipeId, recipeName]);

  useEffect(() => {
    const newIngredient = route.params?.updatedIngredient;
    
    if (newIngredient) {
      console.log('New or updated ingredient:', newIngredient); // Add this log
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
  
      console.log('Updated ingredients list:', updatedIngredients); // Add this log
      setIngredients(updatedIngredients);
      calculateTotals(updatedIngredients);
      setIsSaved(false);
  
      navigation.setParams({ updatedIngredient: undefined });
    }
  }, [route.params?.updatedIngredient]);

useEffect(() => {
  loadRecipeIngredients();
}, []);

const loadRecipeIngredients = async () => {
  try {
    const storedRecipe = await AsyncStorage.getItem('recipes');
    const parsedRecipes = storedRecipe ? JSON.parse(storedRecipe) : [];
    const recipe = parsedRecipes.find((r: any) => r.id === recipeId);

    if (recipe) {
      const ingredients = recipe.ingredients.length ? recipe.ingredients : getDefaultIngredients();
      console.log('Loaded ingredients:', ingredients);
      setIngredients(ingredients);
      calculateTotals(ingredients);
    } else {
      const defaultIngredients = getDefaultIngredients();
      console.log('Default ingredients:', defaultIngredients);
      setIngredients(defaultIngredients);
      calculateTotals(defaultIngredients);
    }
  } catch (error) {
    console.error('Failed to load recipe', error);
  }
};

  const handleIngredientSave = (updatedIngredient: Ingredient) => {
    const existingIngredientIndex = ingredients.findIndex(ing => ing.name === updatedIngredient.name);
  
    let updatedIngredients;
    if (existingIngredientIndex !== -1) {
      updatedIngredients = ingredients.map((ing, index) =>
        index === existingIngredientIndex ? updatedIngredient : ing
      );
    } else {
      updatedIngredients = [...ingredients, updatedIngredient];
    }
  
    setIngredients(updatedIngredients);
    calculateTotals(updatedIngredients);
  
    // Optionally, save the updated recipe immediately after an ingredient is added/updated
    handleSaveRecipe();
  };

  useEffect(() => {
    if (recipeName && recipeId) {
      console.log(`Recipe ID: ${recipeId}, Recipe Name: ${recipeName}`);
    } else {
      console.error('Missing Recipe Name or Recipe ID', { recipeName, recipeId });
    }
  }, [recipeId, recipeName]);

  const handleSaveRecipe = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      const recipeIndex = parsedRecipes.findIndex((r: any) => r.id === recipeId);
  
      if (recipeIndex !== -1) {
        parsedRecipes[recipeIndex].ingredients = ingredients;
        await AsyncStorage.setItem('recipes', JSON.stringify(parsedRecipes));
        Alert.alert('Success', 'Recipe saved successfully!');
        setIsSaved(true);
      } else {
        Alert.alert('Error', 'Recipe not found.');
      }
    } catch (error) {
      console.error('Failed to save recipe', error);
      Alert.alert('Error', 'Failed to save the recipe. Please try again.');
    }
  };

  const convertToUnit = (weight: number, fromUnit: 'g' | 'kg' | 'lbs', toUnit: 'g' | 'kg' | 'lbs') => {
    console.log(`Converting ${weight} from ${fromUnit} to ${toUnit}`);
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

  const calculateTotals = (updatedIngredients: Ingredient[]) => {
  const totalWt = updatedIngredients.reduce((sum, ing) => 
    sum + (isNaN(convertToUnit(ing.totalWeight, ing.unit, globalUnit)) ? 0 : convertToUnit(ing.totalWeight, ing.unit, globalUnit)), 0);
  
  const meatWeight = updatedIngredients.reduce((sum, ing) => 
    sum + (isNaN(convertToUnit(ing.meatWeight, ing.unit, globalUnit)) ? 0 : convertToUnit(ing.meatWeight, ing.unit, globalUnit)), 0);
  
  const boneWeight = updatedIngredients.reduce((sum, ing) => 
    sum + (isNaN(convertToUnit(ing.boneWeight, ing.unit, globalUnit)) ? 0 : convertToUnit(ing.boneWeight, ing.unit, globalUnit)), 0);
  
  const organWeight = updatedIngredients.reduce((sum, ing) => 
    sum + (isNaN(convertToUnit(ing.organWeight, ing.unit, globalUnit)) ? 0 : convertToUnit(ing.organWeight, ing.unit, globalUnit)), 0);

  console.log('Total weight:', totalWt, 'Meat:', meatWeight, 'Bone:', boneWeight, 'Organ:', organWeight);

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
        { text: 'Delete', onPress: () => {
          const updatedIngredients = ingredients.filter(ing => ing.name !== name);
          setIngredients(updatedIngredients);
          calculateTotals(updatedIngredients);
          setIsSaved(false);
        }}
      ]
    );
  };

  const formatWeight = (weight: number, weightUnit: 'g' | 'kg' | 'lbs') => {
    const safeWeight = isNaN(weight) || weight === undefined ? 0 : weight;
    return safeWeight.toFixed(2) + ' ' + weightUnit;
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
            Meat: {formatWeight(totalMeat, globalUnit)} ({totalWeight > 0 ? (totalMeat / totalWeight * 100).toFixed(2) : 0}%) | 
            Bone: {formatWeight(totalBone, globalUnit)} ({totalWeight > 0 ? (totalBone / totalWeight * 100).toFixed(2) : 0}%) | 
            Organ: {formatWeight(totalOrgan, globalUnit)} ({totalWeight > 0 ? (totalOrgan / totalWeight * 100).toFixed(2) : 0}%)
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
                    M: {formatWeight(ingredient.meatWeight, ingredient.unit)}  B: {formatWeight(ingredient.boneWeight, ingredient.unit)}  O: {formatWeight(ingredient.organWeight, ingredient.unit)}
                  </Text>
                  <Text style={styles.totalWeightText}>Total: {formatWeight(isNaN(ingredient.totalWeight) ? 0 : ingredient.totalWeight, ingredient.unit)}</Text>
                </View>
                <View style={styles.iconsContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('RecipeFoodInfoScreen', {
                    ingredient: { ...ingredient, unit: ingredient.unit },
                    editMode: true,
                    recipeName: recipeName,
                    recipeId: recipeId
                  })}>
                  <FontAwesome name="edit" size={24} color="black" />
                </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteIngredient(ingredient.name)}
                  >
                    <FontAwesome name="trash" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                </View>
            ))  
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.addIngredientButton}
              onPress={() => navigation.navigate('RecipeSearchScreen', { recipeId, recipeName })}
            >
              <Text style={styles.addButtonText}>Add Ingredient</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveRecipeButton}
              onPress={handleSaveRecipe}
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
  titleContainer: {
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ded8d7',
    backgroundColor: '#f8f8f8',
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
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
  buttonContainer: {
    padding: 15,
    borderTopWidth: 0.7,
    borderTopColor: '#ded8d7',
    backgroundColor: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  addIngredientButton: {
    flex: 1,
    backgroundColor: '#000080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveRecipeButton: {
    flex: 1,
    backgroundColor: '#000080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButton: {
    backgroundColor: '#000080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeContentScreen;
