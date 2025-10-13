import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Recipe } from "../types/food-input.types"

const RECIPES_KEY = "@recipes"

export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const existingRecipes = await loadRecipes()
    const updatedRecipes = [...existingRecipes, recipe]
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes))
  } catch (error) {
    console.error("Error saving recipe:", error)
    throw error
  }
}

export const loadRecipes = async (): Promise<Recipe[]> => {
  try {
    const recipesJson = await AsyncStorage.getItem(RECIPES_KEY)
    return recipesJson ? JSON.parse(recipesJson) : []
  } catch (error) {
    console.error("Error loading recipes:", error)
    return []
  }
}

export const deleteRecipe = async (recipeName: string): Promise<void> => {
  try {
    const recipes = await loadRecipes()
    const updatedRecipes = recipes.filter((r) => r.name !== recipeName)
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes))
  } catch (error) {
    console.error("Error deleting recipe:", error)
    throw error
  }
}
