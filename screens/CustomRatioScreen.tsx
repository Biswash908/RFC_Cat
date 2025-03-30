"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSaveContext } from "../SaveContext";

type RootStackParamList = {
  CalculatorScreen: { meat: number; bone: number; organ: number };
  CustomRatioScreen: {
    customRatio?: any;
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
        // First check if we have custom ratio from route params
        if (route.params?.customRatio) {
          console.log(
            "✅ Loading custom ratio from params:",
            route.params.customRatio
          );
          setMeatRatio(route.params.customRatio.meat || 0);
          setBoneRatio(route.params.customRatio.bone || 0);
          setOrganRatio(route.params.customRatio.organ || 0);
          return;
        }

        // Otherwise load from AsyncStorage
        const customMeatRatio = await AsyncStorage.getItem("customMeatRatio");
        const customBoneRatio = await AsyncStorage.getItem("customBoneRatio");
        const customOrganRatio = await AsyncStorage.getItem("customOrganRatio");

        console.log("✅ Loading saved custom ratios in CustomRatioScreen:", {
          meat: customMeatRatio,
          bone: customBoneRatio,
          organ: customOrganRatio,
        });

        // Set saved ratios if they exist
        if (customMeatRatio && customBoneRatio && customOrganRatio) {
          setMeatRatio(Number.parseFloat(customMeatRatio));
          setBoneRatio(Number.parseFloat(customBoneRatio));
          setOrganRatio(Number.parseFloat(customOrganRatio));
        }
      } catch (error) {
        console.log("Failed to load saved ratios:", error);
      }
    };

    loadSavedRatios();
  }, [route.params?.customRatio]);

  const calculateTotalRatio = () => {
    return meatRatio + boneRatio + organRatio;
  };

  // Modify the handleAddRatio function to NOT update the recipe's ratio directly
  // Instead, only update temporary storage and context
  const handleAddRatio = async () => {
    const totalRatio = calculateTotalRatio();
    const difference = totalRatio - 100;

    // Stricter validation to ensure we have valid values
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

    // Additional validation to ensure we don't save all zeros
    if (meatRatio === 0 && boneRatio === 0 && organRatio === 0) {
      Alert.alert(
        "Invalid Ratio",
        "All values cannot be zero. Please enter valid ratio values."
      );
      return;
    }

    try {
      // Get the current recipe ID if available
      const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe");
      const recipeId = selectedRecipeStr
        ? JSON.parse(selectedRecipeStr).recipeId
        : null;

      // Mark this as a user-selected ratio - critical for persistence
      await AsyncStorage.setItem("userSelectedRatio", "true");

      // Save to global AsyncStorage for current session and temporary storage
      await AsyncStorage.multiSet([
        // Regular ratio values (used for UI display)
        ["meatRatio", meatRatio.toString()],
        ["boneRatio", boneRatio.toString()],
        ["organRatio", organRatio.toString()],
        ["selectedRatio", "custom"],

        // Custom ratio values (for future reference)
        ["customMeatRatio", meatRatio.toString()],
        ["customBoneRatio", boneRatio.toString()],
        ["customOrganRatio", organRatio.toString()],

        // Temporary ratio values (separate from permanent recipe data)
        ["tempMeatRatio", meatRatio.toString()],
        ["tempBoneRatio", boneRatio.toString()],
        ["tempOrganRatio", organRatio.toString()],
        ["tempSelectedRatio", "custom"],
      ]);

      console.log("🚀 Setting custom ratio (temporary):", {
        meat: meatRatio,
        bone: boneRatio,
        organ: organRatio,
        recipeId,
      });

      // Save to context
      saveCustomRatios({
        meat: meatRatio,
        bone: boneRatio,
        organ: organRatio,
      });

      // IMPORTANT: We're NOT updating the recipe's ratio here anymore
      // That will only happen when the user explicitly saves the recipe

      // If we have a recipe ID and a selected recipe, update the temporary ratio in memory
      if (recipeId && selectedRecipeStr) {
        const selectedRecipe = JSON.parse(selectedRecipeStr);

        // Only update the temporary ratio in memory, not in storage
        selectedRecipe.tempRatio = {
          meat: meatRatio,
          bone: boneRatio,
          organ: organRatio,
          selectedRatio: "custom",
          isUserDefined: true,
          isTemporary: true,
        };

        // Save the updated selectedRecipe with the temporary ratio
        await AsyncStorage.setItem(
          "selectedRecipe",
          JSON.stringify(selectedRecipe)
        );
      }

      // Navigate back with the custom ratio
      navigation.navigate("CalculatorScreen", {
        ratio: {
          meat: meatRatio,
          bone: boneRatio,
          organ: organRatio,
          selectedRatio: "custom",
          isUserDefined: true,
          isTemporary: true, // Mark as temporary
        },
      });
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
