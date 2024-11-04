import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSaveContext } from '../SaveContext';
import { useUnit } from '../UnitContext';

type RootStackParamList = {
  FoodInputScreen: undefined;
  FoodInfoScreen: { ingredient: Ingredient; editMode: boolean };
  SearchScreen: undefined;
  CalculatorScreen: { meat: number; bone: number; organ: number };
  CustomRatioScreen: undefined;
};

type CalculatorScreenRouteProp = RouteProp<RootStackParamList, 'CalculatorScreen'>;

const CalculatorScreen: React.FC = () => {
  const route = useRoute<CalculatorScreenRouteProp>();
  const { customRatios } = useSaveContext();
  const navigation = useNavigation();

  const navigateToCustomRatio = () => {
    navigation.navigate('CustomRatioScreen');
  };

  const initialMeatWeight = route.params?.meat ?? 0;
  const initialBoneWeight = route.params?.bone ?? 0;
  const initialOrganWeight = route.params?.organ ?? 0;

  const { unit } = useUnit();

  const [newMeat, setNewMeat] = useState<number>(0);
  const [newBone, setNewBone] = useState<number>(0);
  const [newOrgan, setNewOrgan] = useState<number>(0);
  const [selectedRatio, setSelectedRatio] = useState<string>('80:10:10');
  const [customRatio, setCustomRatio] = useState<{ meat: number; bone: number; organ: number }>({
    meat: 0,
    bone: 0,
    organ: 0,
  });

  const [meatCorrect, setMeatCorrect] = useState<{ bone: number; organ: number }>({ bone: 0, organ: 0 });
  const [boneCorrect, setBoneCorrect] = useState<{ meat: number; organ: number }>({ meat: 0, organ: 0 });
  const [organCorrect, setOrganCorrect] = useState<{ meat: number; bone: number }>({ meat: 0, bone: 0 });

  useEffect(() => {
    navigation.setOptions({ title: 'Calculator' });
  }, [navigation]);

  useEffect(() => {
    //navigation.navigate('HomeTabs', { 
      //screen: 'Home', 
      //ratio: selectedRatio === 'custom' ? customRatio : { meat: newMeat, bone: newBone, organ: newOrgan },
    //});
  }, [selectedRatio, customRatio, newMeat, newBone, newOrgan, navigation]);
  

  useFocusEffect(
    React.useCallback(() => {
      const loadRatios = async () => {
        try {
          const savedMeat = route.params?.meatRatio ?? (await AsyncStorage.getItem('meatRatio'));
          const savedBone = route.params?.boneRatio ?? (await AsyncStorage.getItem('boneRatio'));
          const savedOrgan = route.params?.organRatio ?? (await AsyncStorage.getItem('organRatio'));
          const savedRatio = await AsyncStorage.getItem('selectedRatio');

          if (savedRatio === 'custom') {
            setCustomRatio({
              meat: Number(savedMeat) || 0,
              bone: Number(savedBone) || 0,
              organ: Number(savedOrgan) || 0,
            });
            setSelectedRatio('custom');
            setNewMeat(Number(savedMeat) || 0);
            setNewBone(Number(savedBone) || 0);
            setNewOrgan(Number(savedOrgan) || 0);
          } else if (savedRatio) {
            setSelectedRatio(savedRatio);
            setNewMeat(Number(savedMeat) || 0);
            setNewBone(Number(savedBone) || 0);
            setNewOrgan(Number(savedOrgan) || 0);
          } else {
            setSelectedRatio('80:10:10');
            setNewMeat(80);
            setNewBone(10);
            setNewOrgan(10);
          }
        } catch (error) {
          console.log('Failed to load ratios:', error);
          setNewMeat(80);
          setNewBone(10);
          setNewOrgan(10);
        }
      };

      loadRatios();
    }, [route.params])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (customRatios) {
        setNewMeat(customRatios.meat);
        setNewBone(customRatios.bone);
        setNewOrgan(customRatios.organ);
        setCustomRatio(customRatios);
        setSelectedRatio('custom');
      }
    }, [customRatios])
  );

  useEffect(() => {
    const saveRatios = async () => {
      try {
        await AsyncStorage.setItem('meatRatio', newMeat.toString());
        await AsyncStorage.setItem('boneRatio', newBone.toString());
        await AsyncStorage.setItem('organRatio', newOrgan.toString());
        await AsyncStorage.setItem('selectedRatio', selectedRatio);

        if (selectedRatio === 'custom') {
          await AsyncStorage.setItem('customMeatRatio', newMeat.toString());
          await AsyncStorage.setItem('customBoneRatio', newBone.toString());
          await AsyncStorage.setItem('customOrganRatio', newOrgan.toString());
        }
      } catch (error) {
        console.log('Failed to save ratios:', error);
      }
    };

    if (newMeat !== null && newBone !== null && newOrgan !== null) {
      saveRatios();
      calculateCorrectors(
        initialMeatWeight,
        initialBoneWeight,
        initialOrganWeight,
        newMeat,
        newBone,
        newOrgan
      );
    }
  }, [newMeat, newBone, newOrgan, selectedRatio]);

  function calculateCorrectors(
    meatWeight: number,
    boneWeight: number,
    organWeight: number,
    newMeat: number,
    newBone: number,
    newOrgan: number
  ) {
    let meatCorrect = { bone: 0, organ: 0 };
    let boneCorrect = { meat: 0, organ: 0 };
    let organCorrect = { meat: 0, bone: 0 };

    if (meatWeight > 0) {
      meatCorrect.bone = ((meatWeight / newMeat) * newBone) - boneWeight;
      meatCorrect.organ = ((meatWeight / newMeat) * newOrgan) - organWeight;
    }

    if (boneWeight > 0) {
      boneCorrect.meat = ((boneWeight / newBone) * newMeat) - meatWeight;
      boneCorrect.organ = ((boneWeight / newBone) * newOrgan) - organWeight;
    }

    if (organWeight > 0) {
      organCorrect.meat = ((organWeight / newOrgan) * newMeat) - meatWeight;
      organCorrect.bone = ((organWeight / newOrgan) * newBone) - boneWeight;
    }

    setMeatCorrect(meatCorrect);
    setBoneCorrect(boneCorrect);
    setOrganCorrect(organCorrect);
  }

  const setRatio = (meat: number, bone: number, organ: number, ratio: string) => {
    setNewMeat(meat);
    setNewBone(bone);
    setNewOrgan(organ);
    setSelectedRatio(ratio);

    if (ratio === 'custom') {
      setCustomRatio({ meat, bone, organ });

      AsyncStorage.setItem('meatRatio', meat.toString());
      AsyncStorage.setItem('boneRatio', bone.toString());
      AsyncStorage.setItem('organRatio', organ.toString());
      AsyncStorage.setItem('selectedRatio', 'custom');
    } else {
      AsyncStorage.setItem('selectedRatio', ratio);
    }

    calculateCorrectors(
      initialMeatWeight,
      initialBoneWeight,
      initialOrganWeight,
      meat,
      bone,
      organ
    );
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
      'Corrector Info',
      'The corrector values help you achieve the intended ratio. Adjust these values to match your desired meat, bone, and organ distribution.',
      [{ text: 'OK' }]
    );
  };

  const formatWeight = (value: number, ingredient: string) => {
    const formattedValue = isNaN(value) ? '0.00' : Math.abs(value).toFixed(2);
    const action = value > 0 ? 'Add' : value < 0 ? 'Remove' : 'Add';
    return `${action} ${formattedValue} ${unit} of ${ingredient}`;
  };

  const displayCustomRatio = `${customRatio.meat}:${customRatio.bone}:${customRatio.organ}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
          <View style={styles.topBar} />

          {/* Ratio Selection */}
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
                selectedRatio === '80:10:10' && selectedRatio !== 'custom' && styles.selectedRatioButton,
              ]}
              onPress={() => setRatio(80, 10, 10, '80:10:10')}
            >
              <Text style={[styles.ratioButtonText, selectedRatio === '80:10:10' && selectedRatio !== 'custom' && { color: 'white' }]}>
                80:10:10
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.ratioButton,
                selectedRatio === '75:15:10' && selectedRatio !== 'custom' && styles.selectedRatioButton,
              ]}
              onPress={() => setRatio(75, 15, 10, '75:15:10')}
            >
              <Text style={[styles.ratioButtonText, selectedRatio === '75:15:10' && selectedRatio !== 'custom' && { color: 'white' }]}>
                75:15:10
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Ratio Button */}
          <TouchableOpacity
            style={[
              styles.customButton,
              selectedRatio === 'custom' ? styles.selectedCustomButton : { backgroundColor: 'white', borderColor: 'navy' },
            ]}
            onPress={navigateToCustomRatio}
          >
            <Text style={[
              styles.customButtonText,
              selectedRatio === 'custom' ? { color: 'white' } : { color: 'black' }
            ]}>
              {selectedRatio === 'custom' ? displayCustomRatio : "Custom Ratio"}
            </Text>
          </TouchableOpacity>

          {/* Corrector Information */}
          <View style={styles.correctorInfoContainer}>
            <Text style={styles.correctorInfoText}>Use the corrector to achieve the intended ratio:</Text>
            <TouchableOpacity onPress={showInfoAlert} style={styles.infoIcon}>
              <FontAwesome name="info-circle" size={20} color="#000080" />
            </TouchableOpacity>
          </View>

          {/* Corrector Boxes */}
          <View style={styles.correctorContainer}>
            {/* Meat Corrector */}
            <View style={[styles.correctorBox, styles.meatCorrector]}>
              <Text style={styles.correctorTitle}>If Meat is correct</Text>
              <Text style={styles.correctorText}>{formatWeight(meatCorrect.bone, 'bones')}</Text>
              <Text style={styles.correctorText}>{formatWeight(meatCorrect.organ, 'organs')}</Text>
            </View>

            {/* Bone Corrector */}
            <View style={[styles.correctorBox, styles.boneCorrector]}>
              <Text style={styles.correctorTitle}>If Bone is correct</Text>
              <Text style={styles.correctorText}>{formatWeight(boneCorrect.meat, 'meat')}</Text>
              <Text style={styles.correctorText}>{formatWeight(boneCorrect.organ, 'organs')}</Text>
            </View>

            {/* Organ Corrector */}
            <View style={[styles.correctorBox, styles.organCorrector]}>
              <Text style={styles.correctorTitle}>If Organ is correct</Text>
              <Text style={styles.correctorText}>{formatWeight(organCorrect.meat, 'meat')}</Text>
              <Text style={styles.correctorText}>{formatWeight(organCorrect.bone, 'bones')}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    paddingBottom: 20,
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
    flex: 1,
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
    borderColor: '#000080',
  },
  selectedRatioButton: {
    backgroundColor: '#000080',
    borderColor: 'green',
  },
  customButton: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#000080',
  },
  selectedCustomButton: {
    backgroundColor: '#000080',
    borderColor: 'green',
  },
  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    flex: 1,
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
