import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  FoodInfoScreen: { ingredient: { id: string; name: string; meat: number; bone: number; organ: number; weight?: number }, editMode: boolean };
  FoodInputScreen: { updatedIngredient: { id: string; name: string; meat: number; bone: number; organ: number; weight: number; meatWeight: number; boneWeight: number; organWeight: number; totalWeight: number } };
};

type FoodInfoScreenRouteProp = RouteProp<RootStackParamList, 'FoodInfoScreen'>;
type FoodInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FoodInfoScreen'>;

type Props = {
  route: FoodInfoScreenRouteProp;
  navigation: FoodInfoScreenNavigationProp;
};

const FoodInfoScreen = ({ route, navigation }: Props) => {
  const { ingredient, editMode } = route.params;
  const [weight, setWeight] = useState(ingredient.weight ? ingredient.weight.toString() : '');
  const [unit, setUnit] = useState<'g' | 'kg' | 'lbs'>('g');

  const convertWeight = (weight: number) => {
    switch (unit) {
      case 'kg':
        return weight / 1000;
      case 'lbs':
        return weight / 453.592;
      default:
        return weight;
    }
  };

  const calculateWeight = (percentage: number) => {
    const weightNum = parseFloat(weight);
    return isNaN(weightNum) ? 0 : (weightNum * percentage) / 100;
  };

  const handleSaveIngredient = () => {
    const weightInGrams = unit === 'g' ? parseFloat(weight) : unit === 'kg' ? parseFloat(weight) * 1000 : parseFloat(weight) * 453.592;
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
        placeholder={`Enter ingredient weight in ${unit}`}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <Picker
        selectedValue={unit}
        style={styles.picker}
        onValueChange={(itemValue) => setUnit(itemValue as 'g' | 'kg' | 'lbs')}
      >
        <Picker.Item label="Grams (g)" value="g" />
        <Picker.Item label="Kilograms (kg)" value="kg" />
        <Picker.Item label="Pounds (lbs)" value="lbs" />
      </Picker>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Meat: {ingredient.meat}% - {convertWeight(calculateWeight(ingredient.meat)).toFixed(2)} {unit}</Text>
        <Text style={styles.resultText}>Bone: {ingredient.bone}% - {convertWeight(calculateWeight(ingredient.bone)).toFixed(2)} {unit}</Text>
        <Text style={styles.resultText}>Organ: {ingredient.organ}% - {convertWeight(calculateWeight(ingredient.organ)).toFixed(2)} {unit}</Text>
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
  picker: {
    height: 50,
    width: '100%',
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
