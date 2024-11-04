import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUnit } from '../UnitContext';

type RootStackParamList = {
  RecipeFoodInfoScreen: { ingredient: { id: string; name: string; meat?: number; bone?: number; organ?: number; weight?: number, unit: 'g' | 'kg' | 'lbs' }, editMode: boolean, recipeName: string, recipeId: string };
  RecipeContentScreen: { recipeId: string, recipeName: string, updatedIngredient: { id: string; name: string; meat: number; bone: number; organ: number; weight: number; meatWeight: number; boneWeight: number; organWeight: number; totalWeight: number, unit: 'g' | 'kg' | 'lbs' } };
};

type RecipeFoodInfoScreenRouteProp = RouteProp<RootStackParamList, 'RecipeFoodInfoScreen'>;
type RecipeFoodInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RecipeFoodInfoScreen'>;

type Props = {
  route: RecipeFoodInfoScreenRouteProp;
  navigation: RecipeFoodInfoScreenNavigationProp;
};

const RecipeFoodInfoScreen = ({ route, navigation }: Props) => {
  const { setUnit } = useUnit();
  const { ingredient, editMode, recipeName, recipeId } = route.params;

  useEffect(() => {
    console.log('RecipeFoodInfoScreen - Recipe Name:', recipeName, 'Recipe ID:', recipeId);
  }, [recipeName, recipeId]);

  const [weight, setWeight] = useState(ingredient.weight ? ingredient.weight.toString() : '');
  const [selectedUnit, setSelectedUnit] = useState<'g' | 'kg' | 'lbs'>(ingredient.unit || 'g');

  const convertWeight = (weight: number) => {
    switch (selectedUnit) {
      case 'kg':
        return weight;
      case 'lbs':
        return weight * 2.20462; // Example conversion for lbs, adjust as needed
      default:
        return weight;
    }
  };

  // Ensure that undefined values default to 0
  const safePercentage = (value?: number) => (value !== undefined && !isNaN(value) ? value : 0);

  const calculateWeight = (percentage: number) => {
    const weightNum = parseFloat(weight);
    return weightNum && !isNaN(weightNum) ? (percentage / 100) * weightNum : 0;
  };

  const handleSaveIngredient = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert("Invalid Weight", "Please enter a valid weight greater than 0.");
      return;
    }

    const meatWeight = calculateWeight(safePercentage(ingredient.meat));
    const boneWeight = calculateWeight(safePercentage(ingredient.bone));
    const organWeight = calculateWeight(safePercentage(ingredient.organ));
    const totalWeight = weightNum;

    const updatedIngredient = {
      ...ingredient,
      weight: weightNum,
      meatWeight,
      boneWeight,
      organWeight,
      totalWeight,
      unit: selectedUnit,
    };

    setUnit(selectedUnit);

    console.log('Updated Ingredient:', updatedIngredient);

    navigation.navigate('RecipeContentScreen', {
      recipeId,
      recipeName,
      updatedIngredient,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{ingredient.name}</Text>
        <View style={styles.underline} />
        <TextInput
          style={styles.input}
          placeholder={`Enter ingredient weight in ${selectedUnit}`}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <View style={styles.buttonContainer}>
          {['g', 'kg', 'lbs'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.unitButton,
                selectedUnit === item ? styles.activeUnitButton : styles.inactiveUnitButton,
              ]}
              onPress={() => setSelectedUnit(item as 'g' | 'kg' | 'lbs')}
            >
              <Text style={styles.unitButtonText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Meat: {safePercentage(ingredient.meat)}% - {convertWeight(calculateWeight(safePercentage(ingredient.meat))).toFixed(2)} {selectedUnit}</Text>
          <Text style={styles.resultText}>Bone: {safePercentage(ingredient.bone)}% - {convertWeight(calculateWeight(safePercentage(ingredient.bone))).toFixed(2)} {selectedUnit}</Text>
          <Text style={styles.resultText}>Organ: {safePercentage(ingredient.organ)}% - {convertWeight(calculateWeight(safePercentage(ingredient.organ))).toFixed(2)} {selectedUnit}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveIngredient}
        >
          <Text style={styles.buttonText}>
            {editMode ? "Save Ingredient" : "Add Ingredient"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  underline: {
    height: 2,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  unitButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  activeUnitButton: {
    backgroundColor: '#000080',
  },
  inactiveUnitButton: {
    backgroundColor: '#ccc',
  },
  unitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#000080',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RecipeFoodInfoScreen;
