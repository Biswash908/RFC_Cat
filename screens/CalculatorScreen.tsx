import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, StatusBar, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUnit } from '../UnitContext';

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

  const [ratioInfoVisible, setRatioInfoVisible] = useState(false);
  const [correctorInfoVisible, setCorrectorInfoVisible] = useState(false);

  const initialMeatWeight = route.params?.meat ?? 0;
  const initialBoneWeight = route.params?.bone ?? 0;
  const initialOrganWeight = route.params?.organ ?? 0;

  const { unit } = useUnit();

  const [newMeat, setNewMeat] = useState<number | null>(80);
  const [newBone, setNewBone] = useState<number | null>(10);
  const [newOrgan, setNewOrgan] = useState<number | null>(10);

  const [selectedRatio, setSelectedRatio] = useState<string>('80:10:10');

  const [meatCorrect, setMeatCorrect] = useState({ bone: 0, organ: 0 });
  const [boneCorrect, setBoneCorrect] = useState({ meat: 0, organ: 0 });
  const [organCorrect, setOrganCorrect] = useState({ meat: 0, bone: 0 });

  useEffect(() => {
    navigation.setOptions({ title: 'Calculator' });
  }, [navigation]);

  useEffect(() => {
    const loadRatios = async () => {
      try {
        const savedMeat = await AsyncStorage.getItem('meatRatio');
        const savedBone = await AsyncStorage.getItem('boneRatio');
        const savedOrgan = await AsyncStorage.getItem('organRatio');
        const savedRatio = await AsyncStorage.getItem('selectedRatio');
        
        if (savedMeat !== null) setNewMeat(Number(savedMeat));
        else setNewMeat(80);  // Default if not found
        
        if (savedBone !== null) setNewBone(Number(savedBone));
        else setNewBone(10);  // Default if not found
        
        if (savedOrgan !== null) setNewOrgan(Number(savedOrgan));
        else setNewOrgan(10);  // Default if not found
        
        if (savedRatio !== null) setSelectedRatio(savedRatio);
        else setSelectedRatio('80:10:10');  // Default if not found
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
          await AsyncStorage.setItem('selectedRatio', selectedRatio);
        } catch (error) {
          console.log('Failed to save ratios:', error);
        }
      };
      saveRatios();
      calculateCorrectors(initialMeatWeight, initialBoneWeight, initialOrganWeight);
    }
  }, [newMeat, newBone, newOrgan, selectedRatio]);

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

  const setRatio = (meat: number, bone: number, organ: number, ratio: string) => {
    setNewMeat(meat);
    setNewBone(bone);
    setNewOrgan(organ);
    setSelectedRatio(ratio);
  };

  const showRatioInfoAlert = () => {
    Alert.alert(
      "Ratio Info",
      "• Adult cats: 80% meat, 10% bone, 10% secreting organs\n\n"+
      "• Kittens and pregnant/nursing cats: 75% meat, 15% bone, 10% secreting organs\n\n"+
      "The higher bone content for kittens and mothers provides essential calcium for growth and lactation.",
      [{ text: "OK" }]
    );
  };

  const showInfoAlert = () => {
    Alert.alert(
      "Corrector Info",
      "The corrector values help you achieve the intended ratio. Adjust these values to match your desired meat, bone, and organ distribution.",
      [{ text: "OK" }]
    );
  };
  

  const formatWeight = (value: number, ingredient: string) => {
    const formattedValue = Math.abs(value).toFixed(2);
    const action = value >= 0 ? 'Add' : 'Remove';
    return `${action} ${formattedValue} ${unit} of ${ingredient}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.topBar} />

        <View style={styles.ratioTitleContainer}>
          <Text style={styles.ratioTitle}>Set your Meat: Bone: Organ ratio:</Text>
          <TouchableOpacity onPress={showRatioInfoAlert} style={styles.infoIcon}>
            <FontAwesome name="info-circle" size={20} color="#000080" />
          </TouchableOpacity>
        </View>
        <View style={styles.ratioButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.ratioButton,
              selectedRatio === '80:10:10' && styles.selectedRatioButton,
            ]}
            onPress={() => setRatio(80, 10, 10, '80:10:10')}>
            <Text
              style={[
                styles.ratioButtonText,
                selectedRatio === '80:10:10' && { color: 'white' }
              ]}
            >
              80:10:10
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.ratioButton,
              selectedRatio === '75:15:10' && styles.selectedRatioButton,
            ]}
            onPress={() => setRatio(75, 15, 10, '75:15:10')}
          >
            <Text
              style={[
                styles.ratioButtonText,
                selectedRatio === '75:15:10' && { color: 'white' }
              ]}
            >
              75:15:10
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.correctorInfoContainer}>
          <Text style={styles.correctorInfoText}>Use the corrector to achieve the intended ratio:</Text>
          <TouchableOpacity onPress={showInfoAlert} style={styles.infoIcon}>
            <FontAwesome name="info-circle" size={20} color="#000080" />
          </TouchableOpacity>
        </View>

        <View style={styles.correctorContainer}>
          <View style={[styles.correctorBox, styles.meatCorrector]}>
            <Text style={styles.correctorTitle}>If Meat is correct</Text>
            <Text style={styles.correctorText}>{formatWeight(meatCorrect.bone, 'bones')}</Text>
            <Text style={styles.correctorText}>{formatWeight(meatCorrect.organ, 'organs')}</Text>
          </View>
          <View style={[styles.correctorBox, styles.boneCorrector]}>
            <Text style={styles.correctorTitle}>If Bone is correct</Text>
            <Text style={styles.correctorText}>{formatWeight(boneCorrect.meat, 'meat')}</Text>
            <Text style={styles.correctorText}>{formatWeight(boneCorrect.organ, 'organs')}</Text>
          </View>
          <View style={[styles.correctorBox, styles.organCorrector]}>
            <Text style={styles.correctorTitle}>If Organ is correct</Text>
            <Text style={styles.correctorText}>{formatWeight(organCorrect.meat, 'meat')}</Text>
            <Text style={styles.correctorText}>{formatWeight(organCorrect.bone, 'bones')}</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    textAlign: 'left',
    flex: 1, // Allow title to take up available space
  },
  ratioTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 1,
  },
  ratioButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  ratioButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'blue',
  },
  selectedRatioButton: {
    backgroundColor: '#000080',
    borderColor: 'green',
  },
  ratioButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',

  },
  correctorInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  correctorInfoText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    flex: 1, // Allow text to take up available space
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
    borderColor: '#4747f5',
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