"use client"

import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { v4 as uuidv4 } from "uuid"
import type { Recipe } from "../types/recipe.types"
import { DEFAULT_RECIPES } from "../constants/default-recipes"
import { generateUniqueRecipeName } from "../utils/recipe-utils"

export const useRecipeList = (routeParams?: any) => {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  // Load recipes from storage
  const loadRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem("recipes")
      let recipesToSet: Recipe[] = []

      if (storedRecipes) {
        const parsedStoredRecipes = JSON.parse(storedRecipes)
        if (parsedStoredRecipes.length > 0) {
          recipesToSet = parsedStoredRecipes
        } else {
          recipesToSet = DEFAULT_RECIPES
          await AsyncStorage.setItem("recipes", JSON.stringify(DEFAULT_RECIPES))
        }
      } else {
        recipesToSet = DEFAULT_RECIPES
        await AsyncStorage.setItem("recipes", JSON.stringify(DEFAULT_RECIPES))
      }

      setRecipes(recipesToSet)
    } catch (error) {
      console.log("Error loading recipes: ", error)
    }
  }

  // Save recipes to storage
  const saveRecipes = async (recipesToSave: Recipe[]) => {
    try {
      await AsyncStorage.setItem("recipes", JSON.stringify(recipesToSave))
    } catch (error) {
      console.log("Error saving recipes: ", error)
    }
  }

  // Add new recipe from route params
  useEffect(() => {
    if (routeParams?.newRecipeName && routeParams?.ingredients) {
      const { newRecipeName, ingredients } = routeParams

      if (typeof newRecipeName === "string") {
        const uniqueRecipeName = generateUniqueRecipeName(newRecipeName, recipes)

        const newRecipe: Recipe = {
          id: uuidv4(),
          name: uniqueRecipeName,
          ingredients: ingredients,
          ratio: "80:10:10", // Default ratio
        }

        const updatedRecipes = [...recipes, newRecipe]
        setRecipes(updatedRecipes)
        saveRecipes(updatedRecipes)
      }
    }
  }, [routeParams])

  // Save recipes whenever they change
  useEffect(() => {
    if (recipes.length > 0) {
      saveRecipes(recipes)
    }
  }, [recipes])

  // Update recipe name
  const updateRecipeName = (recipeId: string, newName: string): boolean => {
    const uniqueName = generateUniqueRecipeName(newName, recipes, recipeId)
    const updatedRecipes = recipes.map((recipe) => (recipe.id === recipeId ? { ...recipe, name: uniqueName } : recipe))
    setRecipes(updatedRecipes)
    return true
  }

  // Delete recipe
  const deleteRecipe = (recipeId: string) => {
    setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId))
  }

  return {
    recipes,
    loadRecipes,
    updateRecipeName,
    deleteRecipe,
  }
}
