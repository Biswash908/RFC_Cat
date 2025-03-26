"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Platform,
  Dimensions,
} from "react-native"
import { useNavigation, useRoute, type RouteProp, useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ActivityIndicator } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useUnit } from "../UnitContext"
import { v4 as uuidv4 } from "uuid"

// Added for responsive styling
const isIOS = Platform.OS === "ios"
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375 // iPhone SE and similar sized devices

// Create a responsive sizing utility
const scale = SCREEN_WIDTH / 375 // Base scale on iPhone 8 width
const verticalScale = SCREEN_HEIGHT / 812 // Base scale on iPhone X height

// Responsive sizing functions
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (isIOS ? Math.min(verticalScale, 1.2) : verticalScale))
const ms = (size: number, factor = 0.5) => {
  return Math.round(size + (rs(size) - size) * factor)
}

export type Ingredient = {
  name: string
  meatWeight: number
  boneWeight: number
  organWeight: number
  totalWeight: number
  unit: "g" | "kg" | "lbs"
}

export type RootStackParamList = {
  FoodInputScreen: undefined
  FoodInfoScreen: { ingredient: Ingredient; editMode: boolean }
  SearchScreen: undefined
  CalculatorScreen: { meat: number; bone: number; organ: number }
}

type FoodInputScreenRouteProp = RouteProp<RootStackParamList, "FoodInfoScreen">

const FoodInputScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<FoodInputScreenRouteProp>()
  const { unit: globalUnit } = useUnit()

  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [totalMeat, setTotalMeat] = useState(0)
  const [totalBone, setTotalBone] = useState(0)
  const [totalOrgan, setTotalOrgan] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [recipeName, setRecipeName] = useState("")
  const selectedRatioRef = useRef<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)

  const [newMeat, setNewMeat] = useState<number>(80)
  const [newBone, setNewBone] = useState<number>(10)
  const [newOrgan, setNewOrgan] = useState<number>(10)
  const [selectedRatio, setSelectedRatio] = useState<string>("80:10:10") // Default ratio

  const [meatRatio, setMeatRatio] = useState<number>(80)
  const [boneRatio, setBoneRatio] = useState<number>(10)
  const [organRatio, setOrganRatio] = useState<number>(10)

  const formatRatio = () => `(${meatRatio}:${boneRatio}:${organRatio})`

  useEffect(() => {
    const newIngredient = route.params?.updatedIngredient
    if (newIngredient) {
      newIngredient.unit = newIngredient.unit || globalUnit // Apply global unit if none is provided.

      const existingIngredientIndex = ingredients.findIndex((ing) => ing.name === newIngredient.name)

      let updatedIngredients
      if (existingIngredientIndex !== -1) {
        updatedIngredients = ingredients.map((ing, index) => (index === existingIngredientIndex ? newIngredient : ing))
      } else {
        updatedIngredients = [...ingredients, newIngredient]
      }

      setIngredients(updatedIngredients)
      calculateTotals(updatedIngredients) // Ensure that total values are updated immediately
    }
  }, [route.params?.updatedIngredient, globalUnit])

  useEffect(() => {
    console.log("Received ratio parameters in FIS:", route.params?.ratio)

    if (route.params?.ratio) {
      const { meat, bone, organ, selectedRatio } = route.params.ratio

      // ✅ Only update if it hasn't been manually changed already
      if (selectedRatio !== selectedRatioRef.current) {
        setNewMeat(meat)
        setNewBone(bone)
        setNewOrgan(organ)
        setSelectedRatio(selectedRatio)

        // ✅ Store the latest selected ratio
        selectedRatioRef.current = selectedRatio

        console.log("✅ Updated ratio in FIS:", {
          newMeat: meat,
          newBone: bone,
          newOrgan: organ,
          selectedRatio,
        })
      }
    }
  }, [route.params?.ratio])

  useEffect(() => {
    if (route.params?.ratio) {
      const { meat, bone, organ, selectedRatio } = route.params.ratio

      if (selectedRatio !== selectedRatioRef.current) {
        setNewMeat(meat)
        setNewBone(bone)
        setNewOrgan(organ)
        setSelectedRatio(selectedRatio)

        selectedRatioRef.current = selectedRatio

        console.log("✅ Updated ratio in FIS:", {
          newMeat: meat,
          newBone: bone,
          newOrgan: organ,
          selectedRatio,
        })
      }
    }
  }, [route.params?.ratio])

  useEffect(() => {
    const loadRatioFromStorage = async () => {
      try {
        const savedRatio = await AsyncStorage.getItem("selectedRatio")
        const savedMeat = await AsyncStorage.getItem("meatRatio")
        const savedBone = await AsyncStorage.getItem("boneRatio")
        const savedOrgan = await AsyncStorage.getItem("organRatio")

        if (savedRatio && savedMeat && savedBone && savedOrgan) {
          setSelectedRatio(savedRatio)
          setNewMeat(Number(savedMeat))
          setNewBone(Number(savedBone))
          setNewOrgan(Number(savedOrgan))
        } else {
          // Set defaults if nothing is saved
          setSelectedRatio("80:10:10")
          setNewMeat(80)
          setNewBone(10)
          setNewOrgan(10)
        }
      } catch (error) {
        console.log("Failed to load ratio:", error)
      }
    }
    loadRatioFromStorage()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const refreshRatio = async () => {
        const savedRatio = await AsyncStorage.getItem("selectedRatio")
        const savedMeat = await AsyncStorage.getItem("meatRatio")
        const savedBone = await AsyncStorage.getItem("boneRatio")
        const savedOrgan = await AsyncStorage.getItem("organRatio")

        if (savedRatio && savedMeat && savedBone && savedOrgan) {
          setSelectedRatio(savedRatio)
          setNewMeat(Number(savedMeat))
          setNewBone(Number(savedBone))
          setNewOrgan(Number(savedOrgan))
        }
      }
      refreshRatio()
    }, []),
  )

  // Modify the handleSaveRecipe function to keep the recipe name after saving
  const handleSaveRecipe = async () => {
    if (!recipeName.trim()) {
      setIsModalVisible(true) // Show modal to add recipe name
      return
    }

    if (ingredients.length === 0) {
      Alert.alert("Error", "Ingredients can't be empty.")
      return
    }

    setIsSaving(true) // Start loading indicator
    try {
      const storedRecipes = await AsyncStorage.getItem("recipes")
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : []

      // Function to generate a unique recipe name
      const generateUniqueRecipeName = (name: string, existingRecipes: any[]) => {
        let newName = name
        let counter = 1

        while (existingRecipes.some((r: any) => r.name.toLowerCase() === newName.toLowerCase())) {
          newName = `${name}(${counter})`
          counter++
        }

        return newName
      }

      // Ensure unique recipe name
      const uniqueRecipeName = generateUniqueRecipeName(recipeName.trim(), parsedRecipes)
      
      // Update the recipe name state with the unique name
      setRecipeName(uniqueRecipeName)

      // ✅ IMPROVED: Save the ratio as an object with selectedRatio property
      const ratioObject = {
        meat: newMeat,
        bone: newBone,
        organ: newOrgan,
        selectedRatio: selectedRatio,
        isUserDefined: true, // Mark as user-defined since it's created by the user
      }

      const newRecipe = {
        id: uuidv4(),
        name: uniqueRecipeName,
        ingredients,
        ratio: ratioObject, // ✅ Save the ratio as an object
      }

      // Append the new recipe
      const updatedRecipes = [...parsedRecipes, newRecipe]
      await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes))

      Alert.alert("Success", `Recipe saved successfully as "${uniqueRecipeName}"!`)
      setIsModalVisible(false) // Close the modal
      // Don't clear the recipe name: setRecipeName("")
    } catch (error) {
      Alert.alert("Error", "Failed to save the recipe.")
      console.error("Failed to save recipe", error)
    } finally {
      setIsSaving(false) // Stop loading indicator
    }
  }

  useEffect(() => {
    const newIngredient = route.params?.updatedIngredient
    if (newIngredient) {
      newIngredient.unit = newIngredient.unit || globalUnit

      // Find if ingredient exists by name and update it
      const existingIngredientIndex = ingredients.findIndex((ing) => ing.name === newIngredient.name)

      let updatedIngredients
      if (existingIngredientIndex !== -1) {
        updatedIngredients = ingredients.map((ing, index) => (index === existingIngredientIndex ? newIngredient : ing))
      } else {
        updatedIngredients = [...ingredients, newIngredient]
      }

      setIngredients(updatedIngredients)
      calculateTotals(updatedIngredients) // Recalculate totals immediately
    }
  }, [route.params?.updatedIngredient, globalUnit])

  const convertToUnit = (weight: number, fromUnit: "g" | "kg" | "lbs", toUnit: "g" | "kg" | "lbs") => {
    if (fromUnit === toUnit) return weight
    switch (fromUnit) {
      case "g":
        return toUnit === "kg" ? weight / 1000 : weight / 453.592
      case "kg":
        return toUnit === "g" ? weight * 1000 : weight * 2.20462
      case "lbs":
        return toUnit === "g" ? weight * 453.592 : weight / 2.20462
    }
  }

  const calculateTotals = (updatedIngredients: Ingredient[]) => {
    const totalWt = updatedIngredients.reduce(
      (sum, ing) => sum + convertToUnit(ing.totalWeight, ing.unit, globalUnit),
      0,
    )
    const meatWeight = updatedIngredients.reduce(
      (sum, ing) => sum + convertToUnit(ing.meatWeight, ing.unit, globalUnit),
      0,
    )
    const boneWeight = updatedIngredients.reduce(
      (sum, ing) => sum + convertToUnit(ing.boneWeight, ing.unit, globalUnit),
      0,
    )
    const organWeight = updatedIngredients.reduce(
      (sum, ing) => sum + convertToUnit(ing.organWeight, ing.unit, globalUnit),
      0,
    )

    setTotalWeight(totalWt)
    setTotalMeat(meatWeight)
    setTotalBone(boneWeight)
    setTotalOrgan(organWeight)
  }

  useEffect(() => {
    console.log("Received recipeId:", route.params?.recipeId)
    console.log("Received ingredients:", route.params?.ingredients)
    console.log("Received ratio in FIS from Recipe Screen:", route.params?.ratio) // Debug log for ratio

    if (route.params?.ingredients) {
      const updatedIngredients = route.params.ingredients.map((ing) => ({
        ...ing,
        unit: ing.unit || globalUnit, // Ensure unit consistency
      }))

      setIngredients(updatedIngredients)
      calculateTotals(updatedIngredients) // Update totals for loaded ingredients
    }
    if (route.params?.recipeName) {
      setRecipeName(route.params.recipeName)
    }
    if (route.params?.ratio) {
      setSelectedRatio(route.params.ratio) // Load the ratio if available
    }
  }, [route.params])

  const handleDeleteIngredient = (name: string) => {
    Alert.alert("Delete Ingredient", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          const updatedIngredients = ingredients.filter((ing) => ing.name !== name)
          setIngredients(updatedIngredients)
          calculateTotals(updatedIngredients)
        },
      },
    ])
  }

  // Also modify the handleClearScreen function to ensure it clears the recipe name
  const handleClearScreen = () => {
    Alert.alert("Clear Ingredients", "Are you sure you want to clear all ingredients and the recipe name?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        onPress: () => {
          setIngredients([])
          setRecipeName("") // This will reset the header to "Raw Feeding Calc"
          setTotalMeat(0)
          setTotalBone(0)
          setTotalOrgan(0)
          setTotalWeight(0)
        },
      },
    ])
  }

  // Updated formatWeight function to remove .00 for grams and make unit stick to number
  const formatWeight = (weight: number | undefined, weightUnit: "g" | "kg" | "lbs") => {
    if (weight === undefined) weight = 0

    // Format the number based on unit
    let formattedNumber
    if (weightUnit === "g") {
      // For grams, show whole numbers if possible
      formattedNumber = weight % 1 === 0 ? weight.toFixed(0) : weight.toFixed(2)
    } else {
      // For kg and lbs, always show 2 decimal places
      formattedNumber = weight.toFixed(2)
    }

    // Return with no space between number and unit
    return formattedNumber + weightUnit
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        {/* Top bar with Recipe Name */}
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>{recipeName ? recipeName : "Raw Feeding Calc"}</Text>
        </View>

        <View style={styles.totalBar}>
          <Text style={styles.totalText}>Total: {formatWeight(totalWeight || 0, globalUnit)}</Text>
          <Text style={styles.subTotalText}>
            Meat: {formatWeight(totalMeat || 0, globalUnit)} (
            {totalWeight > 0 ? ((totalMeat / totalWeight) * 100).toFixed(2) : "0.00"}
            %) | Bone: {formatWeight(totalBone || 0, globalUnit)} (
            {totalWeight > 0 ? ((totalBone / totalWeight) * 100).toFixed(2) : "0.00"}
            %) | Organ: {formatWeight(totalOrgan || 0, globalUnit)} (
            {totalWeight > 0 ? ((totalOrgan / totalWeight) * 100).toFixed(2) : "0.00"}
            %)
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {ingredients.length === 0 ? (
            <Text style={styles.noIngredientsText}>No ingredients added yet</Text>
          ) : (
            ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientHeader}>
                  <Text style={styles.ingredientText}>{ingredient.name}</Text>
                  <Text style={styles.totalWeightText}>
                    Total: {formatWeight(isNaN(ingredient.totalWeight) ? 0 : ingredient.totalWeight, ingredient.unit)}
                  </Text>
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsText}>
                    M: {formatWeight(ingredient.meatWeight, ingredient.unit)} | B:{" "}
                    {formatWeight(ingredient.boneWeight, ingredient.unit)} | O:{" "}
                    {formatWeight(ingredient.organWeight, ingredient.unit)}
                  </Text>
                  <View style={styles.iconsContainer}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() =>
                        navigation.navigate("FoodInfoScreen", {
                          ingredient: ingredient,
                          editMode: true,
                        })
                      }
                    >
                      <FontAwesome name="edit" size={rs(24)} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteIngredient(ingredient.name)}
                    >
                      <FontAwesome name="trash" size={rs(24)} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <Modal transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Add Recipe</Text>
              <TextInput
                style={styles.input}
                placeholder="Recipe Name"
                value={recipeName}
                onChangeText={setRecipeName}
              />
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.calculateButtonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.ingredientButton} onPress={() => navigation.navigate("SearchScreen")}>
              <Text style={styles.ingredientButtonText}>Add Ingredients</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveRecipeButton, isSaving && { backgroundColor: "grey" }]}
              onPress={handleSaveRecipe}
              disabled={isSaving} // Disable button when loading
            >
              {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save Recipe</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={() => {
                const latestRatio = route.params?.ratio ?? {
                  meat: newMeat,
                  bone: newBone,
                  organ: newOrgan,
                  selectedRatio: selectedRatio,
                  isUserDefined: true, // Mark as user-defined when manually selected
                }

                console.log("Navigating to CS with latest ratio:", latestRatio)

                navigation.navigate("CalculatorScreen", {
                  meat: totalMeat,
                  bone: totalBone,
                  organ: totalOrgan,
                  ratio: latestRatio, // Ensure the latest ratio is passed
                })
              }}
            >
              <Text style={styles.calculateButtonText}>Ratio / Calculate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={handleClearScreen}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  topBar: {
    backgroundColor: "white",
    paddingVertical: vs(isSmallDevice ? 7 : 15),
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? (isSmallDevice ? 5 : -5) : 10,
    marginBottom: Platform.OS === "ios" ? (isSmallDevice ? 5 : -5) : -4,
  },
  topBarText: {
    fontSize: rs(isSmallDevice ? 20 : 22),
    fontWeight: "600",
    color: "black",
  },
  totalBar: {
    padding: rs(isSmallDevice ? 5 : 8),
    borderBottomWidth: 1,
    borderBottomColor: "#ded8d7",
    backgroundColor: "white",
    marginTop: vs(isSmallDevice ? -12 : -10),
  },
  totalText: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
    color: "black",
  },
  subTotalText: {
    fontSize: rs(isSmallDevice ? 12 : 14),
    color: "black",
  },
  scrollContainer: {
    padding: rs(8),
    paddingBottom: vs(5),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    padding: rs(16),
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
    marginBottom: vs(12),
    textAlign: "center",
  },
  input: {
    height: vs(40),
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: rs(10),
    marginBottom: vs(16),
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#000080",
    flex: 1,
    paddingVertical: vs(8),
    borderRadius: 5,
    alignItems: "center",
    marginRight: rs(5),
  },
  cancelButton: {
    backgroundColor: "grey",
    flex: 1,
    paddingVertical: vs(8),
    borderRadius: 5,
    alignItems: "center",
    marginLeft: rs(5),
  },
  saveButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: rs(isSmallDevice ? 12 : 14),
  },
  addNewRecipeButton: {
    backgroundColor: "#000080",
    paddingVertical: vs(8),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    marginBottom: vs(8),
    alignItems: "center",
  },
  addNewRecipeButtonText: {
    fontSize: rs(16),
    fontWeight: "bold",
    color: "white",
  },
  noIngredientsText: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    color: "gray",
    textAlign: "center",
    marginTop: vs(40),
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#000080", // Fix the color from "#00080" to "#FF3D00"
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    marginLeft: rs(5),
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
  ingredientItem: {
    padding: rs(6),
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: vs(10),
  },
  ingredientHeader: {
    flexDirection: "row",
    justifyContent: "flex-start", // Keep this to have total closer to name
    alignItems: "center",
    marginBottom: vs(2),
  },
  ingredientText: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
    color: "black",
    marginRight: rs(10),
  },
  totalWeightText: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    color: "#404040",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsText: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    color: "#404040",
    flex: 1,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginRight: rs(8),
  },
  deleteButton: {
    marginLeft: rs(4),
  },
  calculateButtonContainer: {
    padding: rs(isSmallDevice ? 5 : 8),
    borderTopWidth: 0.7,
    borderTopColor: "#ded8d7",
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: vs(isSmallDevice ? 4 : 6),
  },
  ingredientButton: {
    flex: 1,
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    marginRight: rs(5),
    alignItems: "center",
    justifyContent: "center",
  },
  saveRecipeButton: {
    flex: 1,
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    marginLeft: rs(5),
    alignItems: "center",
    justifyContent: "center",
  },

  ingredientButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
  calculateButton: {
    flex: 1,
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    marginRight: rs(5),
    alignItems: "center",
    justifyContent: "center",
  },
  calculateButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 3 : 5),
  },
  bottomBarItem: {
    alignItems: "center",
  },
  bottomBarText: {
    fontSize: rs(isSmallDevice ? 10 : 12),
    color: "white",
    fontWeight: "bold",
    marginTop: vs(1),
  },
})

export default FoodInputScreen