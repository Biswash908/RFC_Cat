import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSaveContext } from '../SaveContext';

type RootStackParamList = {
  CalculatorScreen: { meat: number; bone: number; organ: number };
  CustomRatioScreen: {
    onSave?: (meat: number, bone: number, organ: number) => void;
  };
};

type CustomRatioScreenRouteProp = RouteProp<
  RootStackParamList,
  "CustomRatioScreen"
>;

const CustomRatioScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CustomRatioScreenRouteProp>();
  const { saveCustomRatios } = useSaveContext();

  const [meatRatio, setMeatRatio] = useState<number>(0);
  const [boneRatio, setBoneRatio] = useState<number>(0);
  const [organRatio, setOrganRatio] = useState<number>(0);

  // Button text is static, so we don't need to update it dynamically
  const buttonText = "Use Ratio";

  useEffect(() => {
    const loadSavedRatios = async () => {
      try {
        const savedMeatRatio = await AsyncStorage.getItem("meatRatio");
        const savedBoneRatio = await AsyncStorage.getItem("boneRatio");
        const savedOrganRatio = await AsyncStorage.getItem("organRatio");
        const savedRatioType = await AsyncStorage.getItem("selectedRatio");

        console.log("✅ Loading saved ratios in CustomRatioScreen:", {
          meat: savedMeatRatio,
          bone: savedBoneRatio,
          organ: savedOrganRatio,
          type: savedRatioType,
        });

        // Set saved ratios if they exist
        if (
          savedMeatRatio &&
          savedBoneRatio &&
          savedOrganRatio &&
          savedRatioType === "custom"
        ) {
          setMeatRatio(Number.parseFloat(savedMeatRatio));
          setBoneRatio(Number.parseFloat(savedBoneRatio));
          setOrganRatio(Number.parseFloat(savedOrganRatio));
        } else if (route.params?.customRatio) {
          setMeatRatio(route.params.customRatio.meat);
          setBoneRatio(route.params.customRatio.bone);
          setOrganRatio(route.params.customRatio.organ);
        }
      } catch (error) {
        console.log("Failed to load saved ratios:", error);
      }
    };

    loadSavedRatios();
  }, []);

  const calculateTotalRatio = () => {
    return meatRatio + boneRatio + organRatio;
  };

  const handleAddRatio = async () => {
    const totalRatio = calculateTotalRatio();
    const difference = totalRatio - 100;
    if (difference !== 0) {
      Alert.alert(
        "Error",
        difference > 0
          ? `You're ${difference.toFixed(
              2
            )}% over the limit. Adjust the values so the total ratio equals 100%.`
          : `You're ${Math.abs(difference).toFixed(
              2
            )}% under 100%. Add more to make the ratio total 100%.`
      );
      return;
    }

    try {
      await AsyncStorage.setItem("meatRatio", meatRatio.toString());
      await AsyncStorage.setItem("boneRatio", boneRatio.toString());
      await AsyncStorage.setItem("organRatio", organRatio.toString());
      await AsyncStorage.setItem("selectedRatio", "custom");

      console.log("🚀 Auto-applying custom ratio:", {
        meat: meatRatio,
        bone: boneRatio,
        organ: organRatio,
      });

      // Pass the custom ratio to CalculatorScreen
      route.params?.onSave?.(meatRatio, boneRatio, organRatio);
      saveCustomRatios({ meat: meatRatio, bone: boneRatio, organ: organRatio });

      navigation.goBack();
    } catch (error) {
      console.log("Failed to save ratios:", error);
      Alert.alert("Error", "Failed to save the ratio. Please try again.");
    }
  };

  const handleInputChange = (
    value: string,
    setState: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const sanitizedValue = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(sanitizedValue)) {
      setState(0);
    } else {
      setState(sanitizedValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.customRatioTitle}>
        <Text style={styles.customRatioTitle}>Select your Custom ratio:</Text>
      </View>
      <View style={styles.ratioInputContainer}>
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Meat Ratio</Text>
            <TextInput
              style={styles.ratioInput}
              keyboardType="numeric"
              value={meatRatio.toString()}
              onChangeText={(value) => handleInputChange(value, setMeatRatio)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Bone Ratio</Text>
            <TextInput
              style={styles.ratioInput}
              keyboardType="numeric"
              value={boneRatio.toString()}
              onChangeText={(value) => handleInputChange(value, setBoneRatio)}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Organ Ratio</Text>
            <TextInput
              style={styles.ratioInput}
              keyboardType="numeric"
              value={organRatio.toString()}
              onChangeText={(value) => handleInputChange(value, setOrganRatio)}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddRatio}>
        <Text style={styles.addButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  customRatioTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  ratioInputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputWrapper: {
    width: "48%",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ratioInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#000080",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomRatioScreen;
