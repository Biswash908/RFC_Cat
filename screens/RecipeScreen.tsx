"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  Dimensions,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import "react-native-get-random-values" // Required for UUID to work in React Native
import { FontAwesome } from "@expo/vector-icons"
import { v4 as uuidv4 } from "uuid" // Importing UUID

// Add responsive sizing utilities
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const isIOS = Platform.OS === "ios"
const scale = SCREEN_WIDTH / 375
const verticalScale = SCREEN_HEIGHT / 812

// Responsive sizing functions
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (isIOS ? Math.min(verticalScale, 1.2) : verticalScale))

const RecipeScreen = ({ route }) => {
  const navigation = useNavigation()
  const defaultRecipes = [
    {
      "id": "cat_recipe1_80_10_10",
      "name": "Chicken & Rabbit Mix",
      "ingredients": [
        {
          "id": "16",
          "name": "Chicken Heart",
          "totalWeight": 92,
          "meatWeight": 92,
          "boneWeight": 0,
          "organWeight": 0,
          "meat": 100,
          "bone": 0,
          "organ": 0,
          "type": "Meat",
          "unit": "g"
        },
        {
          "id": "171", // No Rabbit Neck in your list, keep this custom or add entry
          "name": "Rabbit Neck skinless",
          "totalWeight": 16,
          "meatWeight": 4,
          "boneWeight": 12,
          "organWeight": 0,
          "meat": 25,
          "bone": 75,
          "organ": 0,
          "type": "Meat",
          "unit": "g"
        },
        {
          "id": "19",
          "name": "Chicken Liver",
          "totalWeight": 6,
          "meatWeight": 0,
          "boneWeight": 0,
          "organWeight": 6,
          "meat": 0,
          "bone": 0,
          "organ": 100,
          "type": "Meat",
          "unit": "g"
        },
        {
          "id": "17",
          "name": "Chicken Kidney",
          "totalWeight": 6,
          "meatWeight": 0,
          "boneWeight": 0,
          "organWeight": 6,
          "meat": 0,
          "bone": 0,
          "organ": 100,
          "type": "Meat",
          "unit": "g"
        }
      ],
      "ratio": "80:10:10"
    },
    {
      "id": "cat_recipe2_75_15_10",
      "name": "Beef & Duck Blend",
      "ingredients": [
        {
          "id": "48",
          "name": "Beef Mince, boneless",
          "totalWeight": 98,
          "meatWeight": 98,
          "boneWeight": 0,
          "organWeight": 0,
          "meat": 100,
          "bone": 0,
          "organ": 0,
          "type": "Meat",
          "unit": "g"
        },
        {
          "id": "33", // Duck Neck (no skin variant listed)
          "name": "Duck Neck",
          "totalWeight": 28,
          "meatWeight": 7,
          "boneWeight": 21,
          "organWeight": 0,
          "meat": 25,
          "bone": 75,
          "organ": 0,
          "type": "Meat",
          "unit": "g"
        },
        {
          "id": "32",
          "name": "Duck Liver",
          "totalWeight": 7,
          "meatWeight": 0,
          "boneWeight": 0,
          "organWeight": 7,
          "meat": 0,
          "bone": 0,
          "organ": 100,
          "type": "Meat",
          "unit": "g"
        },
        {
          "id": "64", // Rabbit Kidney, but you're using this for Duck — you might want to create a Duck Kidney entry
          "name": "Duck Kidney",
          "totalWeight": 7,
          "meatWeight": 0,
          "boneWeight": 0,
          "organWeight": 7,
          "meat": 0,
          "bone": 0,
          "organ": 100,
          "type": "Meat",
          "unit": "g"
        }
      ],
      "ratio": "75:15:10"
    },
    {
      "id": "cat_recipe3_65_20_15",
      "name": "Lamb & Turkey Feast",
      "ingredients": [
        {
          "id": "41",
          "name": "Lamb Heart",
          "totalWeight": 56,
          "meatWeight": 56,
          "boneWeight": 0,
          "organWeight": 0,
          "meat": 100,
          "bone": 0,
          "organ": 0,
          "type": "Meat",
          "unit": "g"
        },
        {
          "id": "73",
          "name": "Turkey Neck",
          "totalWeight": 80,
          "meatWeight": 48,
          "boneWeight": 32,
          "organWeight": 0,
          "meat": 60,
          "bone": 40,
          "organ": 0,
          "type": "Meat",
          "unit": "g"
        },
        {
          "id": "72",
          "name": "Turkey Liver",
          "totalWeight": 12,
          "meatWeight": 0,
          "boneWeight": 0,
          "organWeight": 12,
          "meat": 0,
          "bone": 0,
          "organ": 100,
          "type": "Meat",
          "unit": "g"
        },
        {
          "id": "70",
          "name": "Turkey Kidney",
          "totalWeight": 12,
          "meatWeight": 0,
          "boneWeight": 0,
          "organWeight": 12,
          "meat": 0,
          "bone": 0,
          "organ": 100,
          "type": "Meat",
          "unit": "g"
        }
      ],
      "ratio": "65:20:15"
    },
  ]

  const [recipes, setRecipes] = useState([])
  const [newRecipeName, setNewRecipeName] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [recipeToEdit, setRecipeToEdit] = useState(null)
  const [ingredients, setIngredients] = useState([]) // Declare ingredients

  // Destructure `recipeName` and `recipeId` from route params if provided
  const { recipeName, recipeId } = route?.params || {}

  useEffect(() => {
    if (route?.params?.newRecipeName && route?.params?.ingredients) {
      const { newRecipeName, ingredients } = route.params

      // Check if newRecipeName is a valid string
      if (typeof newRecipeName === "string") {
        let uniqueRecipeName = newRecipeName.trim()
        let counter = 1

        // Ensure the recipe name is unique
        while (recipes.some((recipe) => recipe.name === uniqueRecipeName)) {
          uniqueRecipeName = `${newRecipeName.trim()}(${counter})`
          counter++
        }

        const newRecipe = {
          id: uuidv4(), // Use UUID for unique ID
          name: uniqueRecipeName,
          ingredients: ingredients, // Assign the passed ingredients here
        }

        // Add the new recipe to the list
        setRecipes((prevRecipes) => [...prevRecipes, newRecipe])

        // Save the updated recipes list to AsyncStorage
        AsyncStorage.setItem("recipes", JSON.stringify([...recipes, newRecipe]))

        // Clear the params after adding the recipe
        navigation.setParams({ newRecipeName: null, ingredients: null })
      }
    }
  }, [route.params, recipes, navigation])

  useFocusEffect(
    React.useCallback(() => {
      const loadRecipes = async () => {
        try {
          const storedRecipes = await AsyncStorage.getItem("recipes")
          let recipesToSet = []

          if (storedRecipes) {
            const parsedStoredRecipes = JSON.parse(storedRecipes)

            // Ensure we don't add default recipes again if they already exist
            if (parsedStoredRecipes.length > 0) {
              recipesToSet = parsedStoredRecipes
            } else {
              console.log("No recipes found, adding defaults.")
              recipesToSet = defaultRecipes
              await AsyncStorage.setItem("recipes", JSON.stringify(defaultRecipes))
            }
          } else {
            console.log("No saved recipes found, initializing with defaults.")
            recipesToSet = defaultRecipes
            await AsyncStorage.setItem("recipes", JSON.stringify(defaultRecipes))
          }

          console.log("Final loaded recipes:", recipesToSet)
          setRecipes(recipesToSet)
        } catch (error) {
          console.log("Error loading recipes: ", error)
        }
      }
      loadRecipes()
    }, []),
  )

  const calculateRecipeRatio = (recipe) => {
    if (!recipe || !recipe.ratio) return "No Ratio"

    // Handle ratio as object (for custom recipes)
    if (typeof recipe.ratio === "object") {
      if (recipe.ratio.meat !== undefined && recipe.ratio.bone !== undefined && recipe.ratio.organ !== undefined) {
        return `${recipe.ratio.meat} M : ${recipe.ratio.bone} B : ${recipe.ratio.organ} O`
      }
    }

    // Handle ratio as string (for predefined recipes)
    const ratioStr = String(recipe.ratio)
    const parts = ratioStr.split(":")

    if (parts.length === 3) {
      return `${parts[0]} M : ${parts[1]} B : ${parts[2]} O`
    }

    return "No Ratio" // Fallback for unexpected cases
  }

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem("recipes")
        if (storedRecipes) {
          console.log("Loaded Recipes:", JSON.parse(storedRecipes))
          setRecipes(JSON.parse(storedRecipes))
        } else {
          console.log("No recipes found in storage.")
        }
      } catch (error) {
        console.log("Error loading recipes: ", error)
      }
    }
    loadRecipes()
  }, [])

  const calculateTotals = (ingredients) => {
    // Implementation for calculateTotals function
    console.log("Calculating totals for ingredients:", ingredients)
  }

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const { recipeId, ingredients: passedIngredients } = route.params || {} // Ensure route.params is defined

        if (passedIngredients) {
          setIngredients(passedIngredients)
          calculateTotals(passedIngredients)
        } else if (recipeId) {
          const savedRecipe = await AsyncStorage.getItem(`recipe_${recipeId}`)
          if (savedRecipe) {
            const parsedRecipe = JSON.parse(savedRecipe)
            setIngredients(parsedRecipe.ingredients || [])
            calculateTotals(parsedRecipe.ingredients || [])
          }
        }
      } catch (error) {
        console.error("Failed to load recipe", error)
        Alert.alert("Error", "Failed to load the recipe.")
      }
    }

    fetchRecipeData()
  }, [route.params])

  useEffect(() => {
    const saveRecipes = async () => {
      try {
        console.log("Saving Recipes:", recipes)
        await AsyncStorage.setItem("recipes", JSON.stringify(recipes))
      } catch (error) {
        console.log("Error saving recipes: ", error)
      }
    }
    saveRecipes()
  }, [recipes])

  // Helper function to create a deep copy of an object
  const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
  }

  // Modify the navigateToRecipeContent function to properly handle temporary ratios
  const navigateToRecipeContent = (recipe) => {
    // First check if there are unsaved changes in the current recipe
    const checkUnsavedChanges = async () => {
      try {
        const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe")
        if (selectedRecipeStr) {
          const hasUnsavedChangesStr = await AsyncStorage.getItem("hasUnsavedChanges")
          const hasUnsavedChanges = hasUnsavedChangesStr === "true"

          if (hasUnsavedChanges) {
            // If there are unsaved changes, show a simplified confirmation dialog
            Alert.alert("Unsaved Changes", "Are you sure you want to load? You have unsaved changes.", [
              {
                text: "Load",
                onPress: () => loadRecipe(recipe),
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ])
            return
          }
        }

        // If no unsaved changes, proceed with loading the recipe
        loadRecipe(recipe)
      } catch (error) {
        console.error("Error checking for unsaved changes:", error)
        // If there's an error, proceed with loading the recipe
        loadRecipe(recipe)
      }
    }

    // Function to load the recipe
    const loadRecipe = (recipe) => {
      Alert.alert(
        "Load Recipe",
        `Do you want to load the recipe "${recipe.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {
              try {
                // Create a deep copy of the recipe to avoid reference issues
                const recipeCopy = deepCopy(recipe)

                // ✅ IMPROVED: Better ratio parsing to handle both string and object formats
                // ✅ FIXED: Properly determine if this is a standard ratio or custom ratio
                let ratioObject

                // Check if this is a default recipe with a standard ratio
                const isDefaultRecipe = recipe.id.startsWith("default")

                if (typeof recipeCopy.ratio === "string") {
                  const parts = recipeCopy.ratio.split(":")
                  if (parts.length === 3) {
                    // Check if this matches one of our standard ratios
                    const ratioString = recipeCopy.ratio
                    let selectedRatio = "custom"

                    if (ratioString === "80:10:10") {
                      selectedRatio = "80:10:10"
                    } else if (ratioString === "75:15:10") {
                      selectedRatio = "75:15:10"
                    } else {
                      selectedRatio = "custom"
                    }

                    ratioObject = {
                      meat: Number(parts[0]),
                      bone: Number(parts[1]),
                      organ: Number(parts[2]),
                      selectedRatio: selectedRatio,
                      isUserDefined: !isDefaultRecipe,
                    }
                  }
                } else if (recipeCopy.ratio && typeof recipeCopy.ratio === "object") {
                  // For object format ratios - create a new object to avoid reference issues
                  const ratioValues = `${recipeCopy.ratio.meat}:${recipeCopy.ratio.bone}:${recipeCopy.ratio.organ}`
                  let selectedRatio = "custom"

                  if (ratioValues === "80:10:10") {
                    selectedRatio = "80:10:10"
                  } else if (ratioValues === "75:15:10") {
                    selectedRatio = "75:15:10"
                  } else {
                    selectedRatio = "custom"
                  }

                  ratioObject = {
                    ...recipeCopy.ratio,
                    selectedRatio: recipeCopy.ratio.selectedRatio || selectedRatio,
                    isUserDefined:
                      recipeCopy.ratio.isUserDefined !== undefined ? recipeCopy.ratio.isUserDefined : !isDefaultRecipe,
                  }
                }

                if (!ratioObject) {
                  // Default fallback if we couldn't parse the ratio
                  ratioObject = {
                    meat: 80,
                    bone: 10,
                    organ: 10,
                    selectedRatio: "80:10:10",
                    isUserDefined: false,
                  }
                }

                console.log("Final ratio object being passed:", ratioObject)

                // Reset userSelectedRatio when loading a recipe to ensure recipe's ratio takes precedence
                await AsyncStorage.setItem("userSelectedRatio", "false")

                // Reset hasUnsavedChanges flag when loading a new recipe
                await AsyncStorage.setItem("hasUnsavedChanges", "false")

                // Reset temporary ratio to match the recipe's ratio
                await AsyncStorage.multiSet([
                  ["tempMeatRatio", ratioObject.meat.toString()],
                  ["tempBoneRatio", ratioObject.bone.toString()],
                  ["tempOrganRatio", ratioObject.organ.toString()],
                  ["tempSelectedRatio", ratioObject.selectedRatio],
                  // Also update permanent values for consistency
                  ["meatRatio", ratioObject.meat.toString()],
                  ["boneRatio", ratioObject.bone.toString()],
                  ["organRatio", ratioObject.organ.toString()],
                  ["selectedRatio", ratioObject.selectedRatio],
                ])

                // Create a deep copy of the ingredients to avoid reference issues
                const ingredientsCopy = deepCopy(recipeCopy.ingredients)

                // Save selected recipe details - but mark that we're not saving changes automatically
                const selectedRecipeData = {
                  ingredients: ingredientsCopy,
                  recipeName: recipeCopy.name,
                  recipeId: recipeCopy.id,
                  ratio: ratioObject,
                  isUserDefined: !isDefaultRecipe,
                  originalRatio: deepCopy(ratioObject), // Store the original ratio for comparison
                }

                // If this recipe has a saved custom ratio, include it
                if (recipeCopy.savedCustomRatio) {
                  selectedRecipeData.savedCustomRatio = deepCopy(recipeCopy.savedCustomRatio)
                }

                await AsyncStorage.setItem("selectedRecipe", JSON.stringify(selectedRecipeData))

                // Navigate to FoodInputScreen within HomeTabs
                navigation.navigate("HomeTabs", {
                  screen: "Home",
                  params: {
                    recipeName: recipeCopy.name,
                    recipeId: recipeCopy.id,
                    ingredients: ingredientsCopy,
                    ratio: ratioObject,
                    isUserDefined: !isDefaultRecipe,
                  },
                })
              } catch (error) {
                console.error("Error loading recipe into FoodInputScreen", error)
              }
            },
          },
        ],
        { cancelable: true },
      )
    }

    // Start the process by checking for unsaved changes
    checkUnsavedChanges()
  }

  const handleOpenEditModal = (recipe) => {
    setRecipeToEdit(recipe)
    setNewRecipeName(recipe.name)
    setIsModalVisible(true)
  }

  const handleSaveEditedRecipe = () => {
    if (newRecipeName.trim()) {
      let uniqueRecipeName = newRecipeName.trim()
      let counter = 1

      // Ensure unique recipe name when editing
      while (recipes.some((recipe) => recipe.name === uniqueRecipeName && recipe.id !== recipeToEdit.id)) {
        uniqueRecipeName = `${newRecipeName.trim()}(${counter})`
        counter++
      }

      // Update the recipe name
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === recipeToEdit.id ? { ...recipe, name: uniqueRecipeName } : recipe,
      )

      setRecipes(updatedRecipes)
      setIsModalVisible(false)
      setRecipeToEdit(null)
      setNewRecipeName("")
    } else {
      Alert.alert("Error", "Recipe name can't be empty.")
    }
  }

  const handleDeleteRecipe = (recipeId) => {
    const recipeName = recipes.find((recipe) => recipe.id === recipeId)?.name
    Alert.alert("Delete Recipe", `Are you sure you want to delete ${recipeName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId))
        },
      },
    ])
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {recipes.length === 0 ? (
          <Text style={styles.noRecipesText}>No recipes added yet</Text>
        ) : (
          recipes.map((recipe, index) => (
            <TouchableOpacity
              key={`${recipe.id}_${index}`}
              style={styles.recipeItem}
              onPress={() => navigateToRecipeContent(recipe)}
            >
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeText}>{recipe.name}</Text>
                <Text style={styles.ingredientCount}>{calculateRecipeRatio(recipe)}</Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleOpenEditModal(recipe)}>
                  <FontAwesome name="edit" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRecipe(recipe.id)}>
                  <FontAwesome name="trash" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <Modal transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{recipeToEdit ? "Edit Recipe" : "Add Recipe"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Recipe Name"
              value={newRecipeName}
              onChangeText={setNewRecipeName}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={recipeToEdit ? handleSaveEditedRecipe : null}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsModalVisible(false)
                  setNewRecipeName("")
                  setRecipeToEdit(null)
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  noRecipesText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  recipeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  recipeInfo: {
    flex: 1,
  },
  recipeText: {
    fontSize: 18,
    fontWeight: "500",
  },
  ingredientCount: {
    fontSize: 14,
    color: "gray",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginRight: 15,
  },
  deleteButton: {},
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#000080",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
})

export default RecipeScreen