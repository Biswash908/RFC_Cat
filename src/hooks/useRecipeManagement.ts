import { useState, useCallback } from "react"
import { Alert } from "react-native"
import type { Recipe } from "../types/food-input.types"
import { saveRecipe as saveRecipeToStorage } from "../utils/storage"

export const useRecipeManagement = () => {
  const [recipeName, setRecipeName] = useState("New Recipe")
  const [saveModalVisible, setSaveModalVisible] = useState(false)

  const openSaveModal = useCallback(() => {
    setSaveModalVisible(true)
  }, [])

  const closeSaveModal = useCallback(() => {
    setSaveModalVisible(false)
  }, [])

  const saveRecipe = useCallback(async (name: string, recipe: Omit<Recipe, "name">) => {
    try {
      const fullRecipe: Recipe = { name, ...recipe }
      await saveRecipeToStorage(fullRecipe)
      setRecipeName(name)
      Alert.alert("Success", `Recipe "${name}" saved successfully!`)
    } catch (error) {
      Alert.alert("Error", "Failed to save recipe. Please try again.")
    }
  }, [])

  return {
    recipeName,
    setRecipeName,
    saveModalVisible,
    openSaveModal,
    closeSaveModal,
    saveRecipe,
  }
}
