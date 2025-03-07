import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUnit } from '../UnitContext';

type RootStackParamList = {
  FoodInfoScreen: { ingredient: { id: string; name: string; meat: number; bone: number; organ: number; weight?: number, unit: 'g' | 'kg' | 'lbs' }, editMode: boolean };
  FoodInputScreen: { updatedIngredient: { id: string; name: string; meat: number; bone: number; organ: number; weight: number; meatWeight: number; boneWeight: number; organWeight: number; totalWeight: number, unit: 'g' | 'kg' | 'lbs' } };
};

type FoodInfoScreenRouteProp = RouteProp<RootStackParamList, 'FoodInfoScreen'>;
type FoodInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FoodInfoScreen'>;

type Props = {
  route: FoodInfoScreenRouteProp;
  navigation: FoodInfoScreenNavigationProp;
};

const FoodInfoScreen = ({ route, navigation }: Props) => {
  const { setUnit } = useUnit();
  const { ingredient, editMode } = route.params;

  const initialWeight = editMode ? ingredient.totalWeight?.toString() : '';
  const [weight, setWeight] = useState(initialWeight);
  const [selectedUnit, setSelectedUnit] = useState<'g' | 'kg' | 'lbs'>(ingredient.unit || 'g');
  const [meatWeight, setMeatWeight] = useState(0);
  const [boneWeight, setBoneWeight] = useState(0);
  const [organWeight, setOrganWeight] = useState(0);

  useEffect(() => {
    if (weight && !isNaN(parseFloat(weight))) {
      // Calculate weights if weight is a valid number
      const weightInGrams = convertWeight(parseFloat(weight));
      calculateWeights(weightInGrams);
    } else {
      // Reset weights to zero if weight is empty or invalid
      setMeatWeight(0);
      setBoneWeight(0);
      setOrganWeight(0);
    }
  }, [weight, selectedUnit]);

  const calculateWeights = (totalWeight: number) => {
    setMeatWeight((totalWeight * ingredient.meat) / 100);
    setBoneWeight((totalWeight * ingredient.bone) / 100);
    setOrganWeight((totalWeight * ingredient.organ) / 100);
  };

  useEffect(() => {
    if (weight) {
      const weightInGrams = convertWeight(parseFloat(weight));
      calculateWeights(weightInGrams);
    }
  }, [weight, selectedUnit]);

  const convertWeight = (weight: number): number => {
    switch (selectedUnit) {
      case 'kg':
        return weight;
      case 'lbs':
        return weight;
      default:
        return weight;
    }
  };

  const handleSaveIngredient = () => {
    const weightInGrams = convertWeight(parseFloat(weight));
    const totalWeight = weightInGrams;

    const updatedIngredient = {
      ...ingredient,
      weight: weightInGrams,
      meatWeight,
      boneWeight,
      organWeight,
      totalWeight,
      unit: selectedUnit,
    };

    setUnit(selectedUnit);

    navigation.navigate('HomeTabs', { 
      screen: 'Home', 
      params: { updatedIngredient } 
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
              onPress={() => {
                setSelectedUnit(item as 'g' | 'kg' | 'lbs');
                setWeight(convertWeight(parseFloat(weight)).toString());
              }}
            >
              <Text style={styles.unitButtonText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Meat: {ingredient.meat}% - {meatWeight.toFixed(2)} {selectedUnit}
          </Text>
          <Text style={styles.resultText}>
            Bone: {ingredient.bone}% - {boneWeight.toFixed(2)} {selectedUnit}
          </Text>
          <Text style={styles.resultText}>
            Organ: {ingredient.organ}% - {organWeight.toFixed(2)} {selectedUnit}
          </Text>
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
  },
  activeUnitButton: {
    backgroundColor: '#000080',
  },
  inactiveUnitButton: {
    backgroundColor: '#ccc',
  },
  unitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 15,
  },
  resultText: {
    fontSize: 18,
    marginVertical: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#000080',
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