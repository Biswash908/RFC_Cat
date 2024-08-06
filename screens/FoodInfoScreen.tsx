import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  FoodInfoScreen: { ingredient: { name: string, meat: number, bone: number, organ: number }, editMode: boolean };
};

type FoodInfoScreenRouteProp = RouteProp<RootStackParamList, 'FoodInfoScreen'>;

type FoodInfoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FoodInfoScreen'
>;

type Props = {
  route: FoodInfoScreenRouteProp;
  navigation: FoodInfoScreenNavigationProp;
};

const FoodInfoScreen = ({ route, navigation }: Props) => {
  const { ingredient, editMode } = route.params;
  const [weight, setWeight] = useState(ingredient.weight ? ingredient.weight.toString() : '');

  const calculateWeight = (percentage: number) => {
    const weightNum = parseFloat(weight);
    return isNaN(weightNum) ? 0 : (weightNum * percentage) / 100; // Keep in grams
  };

  const handleSaveIngredient = () => {
    const weightInGrams = parseFloat(weight); // Already in grams
    const meatWeight = calculateWeight(ingredient.meat);
    const boneWeight = calculateWeight(ingredient.bone);
    const organWeight = calculateWeight(ingredient.organ);
    const totalWeight = weightInGrams;

    const updatedIngredient = {
      ...ingredient,
      weight: weightInGrams,
      meatWeight,
      boneWeight,
      organWeight,
      totalWeight,
    };

    navigation.navigate('FoodInputScreen', { updatedIngredient });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ingredient.name}</Text>
      <View style={styles.underline} />
      <TextInput
        style={styles.input}
        placeholder="Enter ingredient weight in grams"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Meat: {ingredient.meat}% - {calculateWeight(ingredient.meat).toFixed(2)} g</Text>
        <Text style={styles.resultText}>Bone: {ingredient.bone}% - {calculateWeight(ingredient.bone).toFixed(2)} g</Text>
        <Text style={styles.resultText}>Organ: {ingredient.organ}% - {calculateWeight(ingredient.organ).toFixed(2)} g</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSaveIngredient}
      >
        <Text style={styles.buttonText}>
          {editMode ? "Save Ingredient" : "Add Ingredient"}
        </Text>
      </TouchableOpacity>
    </View>
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
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 30,
  },
  resultText: {
    fontSize: 18,
    marginVertical: 5,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#84DD06',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FoodInfoScreen;
