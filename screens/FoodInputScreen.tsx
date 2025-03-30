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

  // Add a ref to track the loaded recipe ID
  const loadedRecipeIdRef = useRef<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)

  const [newMeat, setNewMeat] = useState<number>(80)
  const [newBone, setNewBone] = useState<number>(10)
  const [newOrgan, setNewOrgan] = useState<number>(10)
  const [selectedRatio, setSelectedRatio] = useState<string>("80:10:10") // Default ratio

  const [meatRatio, setMeatRatio] = useState<number>(80)
  const [boneRatio, setBoneRatio] = useState<number>(10)
  const [organRatio, setOrganRatio] = useState<number>(10)

  const formatRatio = () => `(${meatRatio}:${boneRatio}:${organRatio})`

  // Add a state to track temporary ratio changes
  const [tempRatio, setTempRatio] = useState<{
    meat: number
    bone: number
    organ: number
    selectedRatio: string
    isUserDefined: boolean
  } | null>(null)

  // Add a state to track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Add refs to store the original ingredients and ratio
  const originalIngredientsRef = useRef<Ingredient[]>([])
  const originalRatioRef = useRef<{
    meat: number
    bone: number
    organ: number
    selectedRatio: string
  } | null>(null)

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

  // Modify the useEffect that handles ratio parameters to store in tempRatio instead of immediately saving
  useEffect(() => {
    console.log("Received ratio parameters in FIS:", route.params?.ratio)

    if (route.params?.ratio) {
      const { meat, bone, organ, selectedRatio } = route.params.ratio

      // Store in temporary ratio state instead of immediately saving
      setTempRatio({
        meat,
        bone,
        organ,
        selectedRatio,
        isUserDefined: true,
      })

      // Update UI with the new ratio values
      setNewMeat(meat)
      setNewBone(bone)
      setNewOrgan(organ)
      setSelectedRatio(selectedRatio)

      // Store the latest selected ratio for UI purposes only
      selectedRatioRef.current = selectedRatio

      console.log("✅ Updated temporary ratio in FIS:", {
        newMeat: meat,
        newBone: bone,
        newOrgan: organ,
        selectedRatio,
      })
    }
  }, [route.params?.ratio])

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

  // Add a useFocusEffect to load temporary ratio values when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadTemporaryRatio = async () => {
        try {
          // First check if there's a temporary ratio stored
          const tempSelectedRatio = await AsyncStorage.getItem("tempSelectedRatio")
          const tempMeatRatio = await AsyncStorage.getItem("tempMeatRatio")
          const tempBoneRatio = await AsyncStorage.getItem("tempBoneRatio")
          const tempOrganRatio = await AsyncStorage.getItem("tempOrganRatio")

          console.log("🔄 Loading temporary ratio in FoodInputScreen:", {
            tempSelectedRatio,
            tempMeatRatio,
            tempBoneRatio,
            tempOrganRatio,
          })

          if (tempSelectedRatio && tempMeatRatio && tempBoneRatio && tempOrganRatio) {
            // Use the temporary ratio values for UI display
            setSelectedRatio(tempSelectedRatio)
            setNewMeat(Number(tempMeatRatio))
            setNewBone(Number(tempBoneRatio))
            setNewOrgan(Number(tempOrganRatio))

            // Also update tempRatio state
            setTempRatio({
              meat: Number(tempMeatRatio),
              bone: Number(tempBoneRatio),
              organ: Number(tempOrganRatio),
              selectedRatio: tempSelectedRatio,
              isUserDefined: true,
            })

            console.log("✅ Applied temporary ratio from storage in FoodInputScreen:", {
              meat: Number(tempMeatRatio),
              bone: Number(tempBoneRatio),
              organ: Number(tempOrganRatio),
              selectedRatio: tempSelectedRatio,
            })
          }
        } catch (error) {
          console.log("❌ Failed to load temporary ratio:", error)
        }
      }

      loadTemporaryRatio()
    }, []),
  )

  // Add this to the checkForChanges function
  const checkForChanges = () => {
    // Check if ingredients have changed
    if (originalIngredientsRef.current.length !== ingredients.length) {
      setHasUnsavedChanges(true)
      AsyncStorage.setItem("hasUnsavedChanges", "true")
      return
    }

    // Check if any ingredient details have changed
    const ingredientsChanged = ingredients.some((ingredient, index) => {
      const original = originalIngredientsRef.current[index]
      if (!original) return true

      return (
        ingredient.name !== original.name ||
        ingredient.meatWeight !== original.meatWeight ||
        ingredient.boneWeight !== original.boneWeight ||
        ingredient.organWeight !== original.organWeight ||
        ingredient.totalWeight !== original.totalWeight
      )
    })

    // Check if ratio has changed
    const ratioChanged =
      originalRatioRef.current &&
      (newMeat !== originalRatioRef.current.meat ||
        newBone !== originalRatioRef.current.bone ||
        newOrgan !== originalRatioRef.current.organ ||
        selectedRatio !== originalRatioRef.current.selectedRatio)

    const hasChanges = ingredientsChanged || ratioChanged
    setHasUnsavedChanges(hasChanges)
    AsyncStorage.setItem("hasUnsavedChanges", hasChanges ? "true" : "false")
  }

  // Add this after the other useEffect hooks
  useEffect(() => {
    if (route.params?.saveChangesFirst) {
      // If we're returning to save changes, show the save dialog
      if (hasUnsavedChanges && loadedRecipeIdRef.current) {
        handleSaveRecipe()
      }
    }
  }, [route.params?.saveChangesFirst, hasUnsavedChanges])

  // Modified updateExistingRecipe function to properly update the recipe with the current ratio
  // Modify the handleSaveRecipe function to include the temporary ratio when saving
  const handleSaveRecipe = async () => {
    if (!recipeName.trim()) {
      setIsModalVisible(true) // Show modal to add recipe name
      return
    }

    if (ingredients.length === 0) {
      Alert.alert("Error", "Ingredients can't be empty.")
      return
    }

    // Check if we're editing a loaded recipe
    if (loadedRecipeIdRef.current) {
      // Ask user if they want to update the existing recipe or create a new one
      Alert.alert("Save Recipe", `Do you want to save changes to "${recipeName}"?`, [
        {
          text: "New Recipe",
          onPress: () => {
            // Show the modal to enter a new name
            setIsModalVisible(true)
          },
        },
        {
          text: "Update",
          onPress: () => {
            // Include tempRatio when updating the recipe
            updateExistingRecipe(loadedRecipeIdRef.current)
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ])
    } else {
      // No loaded recipe, create a new one with the current ratio
      createNewRecipe()
    }
  }

  // Modify the updateExistingRecipe function to accept the temporary ratio
  // Replace the existing updateExistingRecipe function with this version

  const updateExistingRecipe = async (recipeId: string) => {
    try {
      setIsSaving(true)
      const storedRecipes = await AsyncStorage.getItem("recipes")
      if (!storedRecipes) {
        Alert.alert("Error", "Could not find recipes in storage.")
        return
      }

      const parsedRecipes = JSON.parse(storedRecipes)

      // Get the current temporary ratio values
      const tempMeatRatio = (await AsyncStorage.getItem("tempMeatRatio")) || newMeat.toString()
      const tempBoneRatio = (await AsyncStorage.getItem("tempBoneRatio")) || newBone.toString()
      const tempOrganRatio = (await AsyncStorage.getItem("tempOrganRatio")) || newOrgan.toString()
      const tempSelectedRatio = (await AsyncStorage.getItem("tempSelectedRatio")) || selectedRatio

      // Create the updated ratio object using the temporary values
      const ratioObject = {
        meat: Number(tempMeatRatio),
        bone: Number(tempBoneRatio),
        organ: Number(tempOrganRatio),
        selectedRatio: tempSelectedRatio,
        isUserDefined: true,
      }

      console.log("✅ Saving recipe with ratio:", ratioObject)

      // Find and update the recipe
      const updatedRecipes = parsedRecipes.map((recipe) => {
        if (recipe.id === recipeId) {
          // Create a deep copy of the recipe to avoid reference issues
          const updatedRecipe = JSON.parse(JSON.stringify(recipe))

          // Update only the necessary fields
          updatedRecipe.name = recipeName
          updatedRecipe.ingredients = JSON.parse(JSON.stringify(ingredients))
          updatedRecipe.ratio = ratioObject

          // If this is a custom ratio, also save it separately
          if (tempSelectedRatio === "custom") {
            updatedRecipe.savedCustomRatio = {
              meat: Number(tempMeatRatio),
              bone: Number(tempBoneRatio),
              organ: Number(tempOrganRatio),
            }
          }

          return updatedRecipe
        }
        return recipe
      })

      // Save the updated recipes
      await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes))

      // Update the loaded recipe ID to the current one (in case it was a new recipe)
      loadedRecipeIdRef.current = recipeId

      // After saving, update the permanent ratio values to match the temporary ones
      await AsyncStorage.multiSet([
        ["meatRatio", tempMeatRatio],
        ["boneRatio", tempBoneRatio],
        ["organRatio", tempOrganRatio],
        ["selectedRatio", tempSelectedRatio],
      ])

      // Update the selected recipe in AsyncStorage
      const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe")
      if (selectedRecipeStr) {
        const selectedRecipe = JSON.parse(selectedRecipeStr)
        selectedRecipe.ratio = ratioObject

        // If this is a custom ratio, also save it separately
        if (tempSelectedRatio === "custom") {
          selectedRecipe.savedCustomRatio = {
            meat: Number(tempMeatRatio),
            bone: Number(tempBoneRatio),
            organ: Number(tempOrganRatio),
          }
        }

        await AsyncStorage.setItem("selectedRecipe", JSON.stringify(selectedRecipe))
      }

      Alert.alert("Success", `Recipe "${recipeName}" updated successfully!`)
      setHasUnsavedChanges(false)
      await AsyncStorage.setItem("hasUnsavedChanges", "false")
      // Store the updated state as the new original state
      originalIngredientsRef.current = JSON.parse(JSON.stringify(ingredients))
      originalRatioRef.current = ratioObject
    } catch (error) {
      console.error("Failed to update recipe", error)
      Alert.alert("Error", "Failed to update the recipe.")
    } finally {
      setIsSaving(false)
    }
  }

  // Modify the createNewRecipe function to accept the temporary ratio
  // Replace the existing createNewRecipe function with this version

  const createNewRecipe = async () => {
    try {
      setIsSaving(true)
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

      // Get the current temporary ratio values
      const tempMeatRatio = (await AsyncStorage.getItem("tempMeatRatio")) || newMeat.toString()
      const tempBoneRatio = (await AsyncStorage.getItem("tempBoneRatio")) || newBone.toString()
      const tempOrganRatio = (await AsyncStorage.getItem("tempOrganRatio")) || newOrgan.toString()
      const tempSelectedRatio = (await AsyncStorage.getItem("tempSelectedRatio")) || selectedRatio

      // Create the ratio object using the temporary values
      const ratioObject = {
        meat: Number(tempMeatRatio),
        bone: Number(tempBoneRatio),
        organ: Number(tempOrganRatio),
        selectedRatio: tempSelectedRatio,
        isUserDefined: true,
      }

      console.log("✅ Creating new recipe with ratio:", ratioObject)

      // Create the new recipe
      const newRecipe = {
        id: uuidv4(),
        name: uniqueRecipeName,
        ingredients,
        ratio: ratioObject,
      }

      // Append the new recipe
      const updatedRecipes = [...parsedRecipes, newRecipe]
      await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes))

      // After saving, update the permanent ratio values to match the temporary ones
      await AsyncStorage.multiSet([
        ["meatRatio", tempMeatRatio],
        ["boneRatio", tempBoneRatio],
        ["organRatio", tempOrganRatio],
        ["selectedRatio", tempSelectedRatio],
      ])

      Alert.alert("Success", `Recipe saved successfully as "${uniqueRecipeName}"!`)
      setIsModalVisible(false)
      setHasUnsavedChanges(false)
      await AsyncStorage.setItem("hasUnsavedChanges", "false")
      // Store the updated state as the new original state
      originalIngredientsRef.current = JSON.parse(JSON.stringify(ingredients))
      originalRatioRef.current = ratioObject
    } catch (error) {
      Alert.alert("Error", "Failed to save the recipe.")
      console.error("Failed to save recipe", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Also modify the handleClearScreen function to reset the hasUnsavedChanges flag in AsyncStorage
  const handleClearScreen = () => {
    Alert.alert("Clear Ingredients", "Are you sure you want to clear all ingredients and the recipe name?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        onPress: async () => {
          setIngredients([])
          setRecipeName("") // This will reset the header to "Raw Feeding Calc"
          setTotalMeat(0)
          setTotalBone(0)
          setTotalOrgan(0)
          setTotalWeight(0)
          // Reset the loaded recipe ID
          loadedRecipeIdRef.current = null
          // Reset change tracking
          setHasUnsavedChanges(false)
          await AsyncStorage.setItem("hasUnsavedChanges", "false")
          originalIngredientsRef.current = []
          originalRatioRef.current = null
        },
      },
    ])
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

    // Store the loaded recipe ID
    if (route.params?.recipeId) {
      loadedRecipeIdRef.current = route.params.recipeId
    }

    if (route.params?.ingredients) {
      const updatedIngredients = route.params.ingredients.map((ing) => ({
        ...ing,
        unit: ing.unit || globalUnit, // Ensure unit consistency
      }))

      setIngredients(updatedIngredients)
      calculateTotals(updatedIngredients) // Update totals for loaded ingredients
      originalIngredientsRef.current = JSON.parse(JSON.stringify(updatedIngredients))
    }
    if (route.params?.recipeName) {
      setRecipeName(route.params.recipeName)
    }
    if (route.params?.ratio) {
      setSelectedRatio(route.params.ratio) // Load the ratio if available
      originalRatioRef.current = route.params.ratio
    }
  }, [route.params])

  useEffect(() => {
    // Initial check for changes when the component mounts
    checkForChanges()
  }, [ingredients, newMeat, newBone, newOrgan, selectedRatio])

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
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    if (!recipeName.trim()) {
                      Alert.alert("Error", "Recipe name can't be empty.")
                      return
                    }
                    createNewRecipe()
                  }}
                >
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
              onPress={async () => {
                // Get the current temporary ratio values
                const tempMeatRatio = await AsyncStorage.getItem("tempMeatRatio")
                const tempBoneRatio = await AsyncStorage.getItem("tempBoneRatio")
                const tempOrganRatio = await AsyncStorage.getItem("tempOrganRatio")
                const tempSelectedRatio = await AsyncStorage.getItem("tempSelectedRatio")

                let latestRatio

                // Use temporary values if available, otherwise use state values
                if (tempMeatRatio && tempBoneRatio && tempOrganRatio && tempSelectedRatio) {
                  latestRatio = {
                    meat: Number(tempMeatRatio),
                    bone: Number(tempBoneRatio),
                    organ: Number(tempOrganRatio),
                    selectedRatio: tempSelectedRatio,
                    isUserDefined: true,
                  }
                } else {
                  latestRatio = {
                    meat: newMeat,
                    bone: newBone,
                    organ: newOrgan,
                    selectedRatio: selectedRatio,
                    isUserDefined: true,
                  }
                }

                console.log("Navigating to CS with latest ratio:", latestRatio)

                navigation.navigate("CalculatorScreen", {
                  meat: totalMeat,
                  bone: totalBone,
                  organ: totalOrgan,
                  ratio: latestRatio,
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
    marginTop: Platform.OS === "ios" ? (isSmallDevice ? 5 : -10) : 10,
    marginBottom: Platform.OS === "ios" ? (isSmallDevice ? 5 : -6) : -6,
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
    padding: Platform.OS === "ios" ? 10 : rs(isSmallDevice ? 6 : 10),
    paddingTop: Platform.OS === "ios" ? 8 : rs(isSmallDevice ? 3 : 8),
    paddingBottom: Platform.OS === "ios" ? 5 : rs(isSmallDevice ? 3 : 5),
    borderTopWidth: 0.7,
    borderTopColor: "#ded8d7",
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: Platform.OS === "ios" ? 4 : vs(isSmallDevice ? 2 : 4),
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

