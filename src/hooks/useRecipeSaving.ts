"use client"

import type React from "react"

import { useCallback } from "react"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { v4 as uuidv4 } from "uuid"
import type { Ingredient } from "../components/food-input/ui/IngredientItem"

export const useRecipeSaving = (
  ingredients: Ingredient[],
  recipeName: string,
  setRecipeName: (name: string) => void,
  setIsSaving: (saving: boolean) => void,
  setHasUnsavedChanges: (hasChanges: boolean) => void,
  setIsModalVisible: (visible: boolean) => void,
  loadedRecipeIdRef: React.MutableRefObject<string | null>,
  originalIngredientsRef: React.MutableRefObject<Ingredient[]>,
  originalRatioRef: React.MutableRefObject<any>,
) => {
  const generateUniqueRecipeName = useCallback((name: string, existingRecipes: any[]) => {
    let newName = name
    let counter = 1
    while (existingRecipes.some((r: any) => r.name.toLowerCase() === newName.toLowerCase())) {
      newName = `${name}(${counter})`
      counter++
    }
    return newName
  }, [])

  const getRatioObject = useCallback(
    async (newMeat: number, newBone: number, newOrgan: number, selectedRatio: string) => {
      const tempMeatRatio = (await AsyncStorage.getItem("tempMeatRatio")) || newMeat.toString()
      const tempBoneRatio = (await AsyncStorage.getItem("tempBoneRatio")) || newBone.toString()
      const tempOrganRatio = (await AsyncStorage.getItem("tempOrganRatio")) || newOrgan.toString()
      const tempSelectedRatio = (await AsyncStorage.getItem("tempSelectedRatio")) || selectedRatio

      return {
        meat: Number(tempMeatRatio),
        bone: Number(tempBoneRatio),
        organ: Number(tempOrganRatio),
        selectedRatio: tempSelectedRatio,
        isUserDefined: true,
      }
    },
    [],
  )

  const updateExistingRecipe = useCallback(
    async (recipeId: string, newMeat: number, newBone: number, newOrgan: number, selectedRatio: string) => {
      try {
        setIsSaving(true)
        const storedRecipes = await AsyncStorage.getItem("recipes")
        if (!storedRecipes) {
          Alert.alert("Error", "Could not find recipes in storage.")
          return
        }

        const parsedRecipes = JSON.parse(storedRecipes)
        const ratioObject = await getRatioObject(newMeat, newBone, newOrgan, selectedRatio)

        const updatedRecipes = parsedRecipes.map((recipe: any) => {
          if (recipe.id === recipeId) {
            const updatedRecipe = JSON.parse(JSON.stringify(recipe))
            updatedRecipe.name = recipeName
            updatedRecipe.ingredients = JSON.parse(JSON.stringify(ingredients))
            updatedRecipe.ratio = ratioObject
            if (ratioObject.selectedRatio === "custom") {
              updatedRecipe.savedCustomRatio = {
                meat: ratioObject.meat,
                bone: ratioObject.bone,
                organ: ratioObject.organ,
              }
            }
            return updatedRecipe
          }
          return recipe
        })

        await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes))
        loadedRecipeIdRef.current = recipeId

        await AsyncStorage.multiSet([
          ["meatRatio", ratioObject.meat.toString()],
          ["boneRatio", ratioObject.bone.toString()],
          ["organRatio", ratioObject.organ.toString()],
          ["selectedRatio", ratioObject.selectedRatio],
        ])

        Alert.alert("Success", `Recipe "${recipeName}" updated successfully!`)
        setHasUnsavedChanges(false)
        await AsyncStorage.setItem("hasUnsavedChanges", "false")
        originalIngredientsRef.current = JSON.parse(JSON.stringify(ingredients))
        originalRatioRef.current = ratioObject
      } catch (error) {
        console.error("Failed to update recipe", error)
        Alert.alert("Error", "Failed to update the recipe.")
      } finally {
        setIsSaving(false)
      }
    },
    [
      ingredients,
      recipeName,
      setIsSaving,
      setHasUnsavedChanges,
      loadedRecipeIdRef,
      originalIngredientsRef,
      originalRatioRef,
      getRatioObject,
    ],
  )

  const createNewRecipe = useCallback(
    async (newMeat: number, newBone: number, newOrgan: number, selectedRatio: string) => {
      try {
        setIsSaving(true)
        const storedRecipes = await AsyncStorage.getItem("recipes")
        const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : []

        const uniqueRecipeName = generateUniqueRecipeName(recipeName.trim(), parsedRecipes)
        setRecipeName(uniqueRecipeName)

        const ratioObject = await getRatioObject(newMeat, newBone, newOrgan, selectedRatio)

        const newRecipe = {
          id: uuidv4(),
          name: uniqueRecipeName,
          ingredients,
          ratio: ratioObject,
        }

        const updatedRecipes = [...parsedRecipes, newRecipe]
        await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes))

        await AsyncStorage.multiSet([
          ["meatRatio", ratioObject.meat.toString()],
          ["boneRatio", ratioObject.bone.toString()],
          ["organRatio", ratioObject.organ.toString()],
          ["selectedRatio", ratioObject.selectedRatio],
        ])

        Alert.alert("Success", `Recipe saved successfully as "${uniqueRecipeName}"!`)
        setIsModalVisible(false)
        setHasUnsavedChanges(false)
        await AsyncStorage.setItem("hasUnsavedChanges", "false")
        originalIngredientsRef.current = JSON.parse(JSON.stringify(ingredients))
        originalRatioRef.current = ratioObject
      } catch (error) {
        Alert.alert("Error", "Failed to save the recipe.")
        console.error("Failed to save recipe", error)
      } finally {
        setIsSaving(false)
      }
    },
    [
      ingredients,
      recipeName,
      setRecipeName,
      setIsSaving,
      setHasUnsavedChanges,
      setIsModalVisible,
      originalIngredientsRef,
      originalRatioRef,
      generateUniqueRecipeName,
      getRatioObject,
    ],
  )

  const handleSaveRecipe = useCallback(
    async (newMeat: number, newBone: number, newOrgan: number, selectedRatio: string) => {
      if (!recipeName.trim()) {
        setIsModalVisible(true)
        return
      }

      if (ingredients.length === 0) {
        Alert.alert("Error", "Ingredients can't be empty.")
        return
      }

      if (loadedRecipeIdRef.current) {
        Alert.alert("Save Recipe", `Do you want to save changes to "${recipeName}"?`, [
          {
            text: "New Recipe",
            onPress: () => setIsModalVisible(true),
          },
          {
            text: "Update",
            onPress: () => updateExistingRecipe(loadedRecipeIdRef.current!, newMeat, newBone, newOrgan, selectedRatio),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ])
      } else {
        createNewRecipe(newMeat, newBone, newOrgan, selectedRatio)
      }
    },
    [recipeName, ingredients, loadedRecipeIdRef, setIsModalVisible, updateExistingRecipe, createNewRecipe],
  )

  return {
    handleSaveRecipe,
    createNewRecipe,
    updateExistingRecipe,
  }
}
