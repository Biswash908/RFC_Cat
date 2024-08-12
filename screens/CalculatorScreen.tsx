import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUnit } from '../UnitContext';  // Import useUnit

type RootStackParamList = {
  FoodInputScreen: undefined;
  FoodInfoScreen: { ingredient: Ingredient; editMode: boolean };
  SearchScreen: undefined;
  CalculatorScreen: { meat: number; bone: number; organ: number };
};

type CalculatorScreenRouteProp = RouteProp<RootStackParamList, 'CalculatorScreen'>;

const CalculatorScreen = () => {
  const route = useRoute<CalculatorScreenRouteProp>();
  const navigation = useNavigation();

  const initialMeatWeight = route.params?.meat ?? 0;
  const initialBoneWeight = route.params?.bone ?? 0;
  const initialOrganWeight = route.params?.organ ?? 0;

  const { unit } = useUnit();  // Use the weight unit from the context

  const [newMeat, setNewMeat] = useState<number | null>(null);
  const [newBone, setNewBone] = useState<number | null>(null);
  const [newOrgan, setNewOrgan] = useState<number | null>(null);

  const [meatCorrect, setMeatCorrect] = useState({ bone: 0, organ: 0 });
  const [boneCorrect, setBoneCorrect] = useState({ meat: 0, organ: 0 });
  const [organCorrect, setOrganCorrect] = useState({ meat: 0, bone: 0 });

  useEffect(() => {
    const loadRatios = async () => {
      try {
        const savedMeat = await AsyncStorage.getItem('meatRatio');
        const savedBone = await AsyncStorage.getItem('boneRatio');
        const savedOrgan = await AsyncStorage.getItem('organRatio');
        if (savedMeat !== null) setNewMeat(Number(savedMeat));
        else setNewMeat(80);  // Default if not found
        if (savedBone !== null) setNewBone(Number(savedBone));
        else setNewBone(10);  // Default if not found
        if (savedOrgan !== null) setNewOrgan(Number(savedOrgan));
        else setNewOrgan(10);  // Default if not found
      } catch (error) {
        console.log('Failed to load ratios:', error);
        setNewMeat(80);
        setNewBone(10);
        setNewOrgan(10);
      }
    };
    loadRatios();
  }, []);

  useEffect(() => {
    if (newMeat !== null && newBone !== null && newOrgan !== null) {
      const saveRatios = async () => {
        try {
          await AsyncStorage.setItem('meatRatio', newMeat.toString());
          await AsyncStorage.setItem('boneRatio', newBone.toString());
          await AsyncStorage.setItem('organRatio', newOrgan.toString());
        } catch (error) {
          console.log('Failed to save ratios:', error);
        }
      };
      saveRatios();
      calculateCorrectors(initialMeatWeight, initialBoneWeight, initialOrganWeight);
    }
  }, [newMeat, newBone, newOrgan]);

  const calculateCorrectors = (meatWeight: number, boneWeight: number, organWeight: number) => {
    if (meatWeight > 0) {
      const bone = ((meatWeight / (newMeat || 1)) * (newBone || 0)) - boneWeight;
      const organ = ((meatWeight / (newMeat || 1)) * (newOrgan || 0)) - organWeight;
      setMeatCorrect({ bone: isNaN(bone) ? 0 : bone, organ: isNaN(organ) ? 0 : organ });
    } else {
      setMeatCorrect({ bone: 0, organ: 0 });
    }

    if (boneWeight > 0) {
      const meat = ((boneWeight / (newBone || 1)) * (newMeat || 0)) - meatWeight;
      const organ = ((boneWeight / (newBone || 1)) * (newOrgan || 0)) - organWeight;
      setBoneCorrect({ meat: isNaN(meat) ? 0 : meat, organ: isNaN(organ) ? 0 : organ });
    } else {
      setBoneCorrect({ meat: 0, organ: 0 });
    }

    if (organWeight > 0) {
      const meat = ((organWeight / (newOrgan || 1)) * (newMeat || 0)) - meatWeight;
      const bone = ((organWeight / (newOrgan || 1)) * (newBone || 0)) - boneWeight;
      setOrganCorrect({ meat: isNaN(meat) ? 0 : meat, bone: isNaN(bone) ? 0 : bone });
    } else {
      setOrganCorrect({ meat: 0, bone: 0 });
    }
  };

  const adjustRatios = (meat: number, bone: number, organ: number) => {
    const total = meat + bone + organ;
    if (total > 100) {
      const scale = 100 / total;
      meat = Math.round(meat * scale);
      bone = Math.round(bone * scale);
      organ = Math.round(organ * scale);
    }

    setNewMeat(meat);
    setNewBone(bone);
    setNewOrgan(organ);
  };

  const handleMeatChange = (text: string) => {
    const meat = Math.min(Number(text), 100);
    adjustRatios(meat, newBone || 0, newOrgan || 0);
  };

  const handleBoneChange = (text: string) => {
    const bone = Math.min(Number(text), 100);
    adjustRatios(newMeat || 0, bone, newOrgan || 0);
  };

  const handleOrganChange = (text: string) => {
    const organ = Math.min(Number(text), 100);
    adjustRatios(newMeat || 0, newBone || 0, organ);
  };

  const showInfoAlert = () => {
    Alert.alert(
      "Corrector Info",
      "The corrector values help you achieve the intended ratio. Adjust these values to match your desired meat, bone, and organ distribution.",
      [{ text: "OK" }]
    );
  };

  const formatWeight = (value: number) => {
    const formattedValue = value.toFixed(2);
    return `${value >= 0 ? '+' : ''}${formattedValue} ${unit}`;
  };

  if (newMeat === null || newBone === null || newOrgan === null) {
    return null; // You can return a loading spinner here if needed
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <View style={styles.topBar}>
        </View>

        <Text style={styles.ratioTitle}>Set your Meat:Bone:Organ ratio:</Text>
        <View style={styles.barContainer}>
          <View style={[styles.barSegment, { backgroundColor: '#FF6347', flex: newMeat }]} />
          <View style={[styles.barSegment, { backgroundColor: '#D3D3D3', flex: newBone }]} />
          <View style={[styles.barSegment, { backgroundColor: '#FFB6C1', flex: newOrgan }]} />
        </View>

        <View style={styles.ratioInputContainer}>
          <View style={styles.ratioInputRow}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>Meat</Text>
              <TextInput
                style={styles.ratioInput}
                value={String(newMeat)}
                onChangeText={handleMeatChange}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>Bone</Text>
              <TextInput
                style={styles.ratioInput}
                value={String(newBone)}
                onChangeText={handleBoneChange}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabel}>Organ</Text>
              <TextInput
                style={styles.ratioInput}
                value={String(newOrgan)}
                onChangeText={handleOrganChange}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.correctorInfoContainer}>
          <Text style={styles.correctorInfoText}>Use the corrector to achieve the intended ratio</Text>
          <TouchableOpacity onPress={showInfoAlert}>
            <FontAwesome name="info-circle" size={24} color="green" />
          </TouchableOpacity>
        </View>

        <View style={styles.correctorContainer}>
          <View style={[styles.correctorBox, styles.meatCorrector]}>
            <Text style={styles.correctorTitle}>Meat Corrector</Text>
            <Text style={styles.correctorText}>Bone: {formatWeight(meatCorrect.bone)}</Text>
            <Text style={styles.correctorText}>Organ: {formatWeight(meatCorrect.organ)}</Text>
          </View>
          <View style={[styles.correctorBox, styles.boneCorrector]}>
            <Text style={styles.correctorTitle}>Bone Corrector</Text>
            <Text style={styles.correctorText}>Meat: {formatWeight(boneCorrect.meat)}</Text>
            <Text style={styles.correctorText}>Organ: {formatWeight(boneCorrect.organ)}</Text>
          </View>
          <View style={[styles.correctorBox, styles.organCorrector]}>
            <Text style={styles.correctorTitle}>Organ Corrector</Text>
            <Text style={styles.correctorText}>Meat: {formatWeight(organCorrect.meat)}</Text>
            <Text style={styles.correctorText}>Bone: {formatWeight(organCorrect.bone)}</Text>
          </View>
        </View>
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
  },
  topBar: {
    marginBottom: 16,
  },
  ratioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  barContainer: {
    flexDirection: 'row',
    height: 60,
    marginBottom: 16,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barSegment: {
    height: '100%',
  },
  ratioInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratioInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratioInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 16,
    width: 60,
  },
  correctorInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  correctorInfoText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10,
  },
  correctorContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 16,
  },
  correctorBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#84DD06',
  },
  correctorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  correctorText: {
    fontSize: 14,
  },
});

export default CalculatorScreen;
