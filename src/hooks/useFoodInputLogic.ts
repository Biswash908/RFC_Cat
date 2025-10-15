"use client"

import { useState, useRef, useCallback } from "react"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Ingredient } from "../components/food-input/ui/IngredientItem"

export const useFoodInputLogic = (globalUnit: "g" | "kg" | "lbs") => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [totalMeat, setTotalMeat] = useState(0)
  const [totalBone, setTotalBone] = useState(0)
  const [totalOrgan, setTotalOrgan] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)
  const [recipeName, setRecipeName] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const loadedRecipeIdRef = useRef<string | null>(null)
  const originalIngredientsRef = useRef<Ingredient[]>([])
  const originalRatioRef = useRef<any>(null)

  const convertToUnit = useCallback((weight: number, fromUnit: "g" | "kg" | "lbs", toUnit: "g" | "kg" | "lbs") => {
    if (fromUnit === toUnit) return weight
    switch (fromUnit) {
      case "g":
        return toUnit === "kg" ? weight / 1000 : weight / 453.592
      case "kg":
        return toUnit === "g" ? weight * 1000 : weight * 2.20462
      case "lbs":
        return toUnit === "g" ? weight * 453.592 : weight / 2.20462
    }
  }, [])

  const calculateTotals = useCallback(
    (updatedIngredients: Ingredient[]) => {
      let meatWeight = 0
      let boneWeight = 0
      let organWeight = 0

      updatedIngredients.forEach((ing) => {
        const actualWeight = convertToUnit(ing.totalWeight, ing.unit, globalUnit)

        if (ing.name !== "Bone Meal" && ing.name !== "Powdered Eggshell" && !ing.isSupplement) {
          meatWeight += convertToUnit(ing.meatWeight, ing.unit, globalUnit)
          boneWeight += convertToUnit(ing.boneWeight, ing.unit, globalUnit)
          organWeight += convertToUnit(ing.organWeight, ing.unit, globalUnit)
        } else {
          if (ing.name === "Bone Meal") {
            boneWeight += actualWeight * 4.16667
          } else if (ing.name === "Powdered Eggshell") {
            boneWeight += actualWeight * 25
          }
        }
      })

      const grandTotalWeight = meatWeight + boneWeight + organWeight
      setTotalWeight(grandTotalWeight)
      setTotalMeat(meatWeight)
      setTotalBone(boneWeight)
      setTotalOrgan(organWeight)
    },
    [convertToUnit, globalUnit],
  )

  const checkForChanges = useCallback(() => {
    if (originalIngredientsRef.current.length !== ingredients.length) {
      setHasUnsavedChanges(true)
      AsyncStorage.setItem("hasUnsavedChanges", "true")
      return
    }

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

    const hasChanges = ingredientsChanged
    setHasUnsavedChanges(hasChanges)
    AsyncStorage.setItem("hasUnsavedChanges", hasChanges ? "true" : "false")
  }, [ingredients])

  const handleDeleteIngredient = useCallback(
    (name: string) => {
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
    },
    [ingredients, calculateTotals],
  )

  const handleClearScreen = useCallback(() => {
    Alert.alert("Clear Ingredients", "Are you sure you want to clear all ingredients and the recipe name?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        onPress: async () => {
          setIngredients([])
          setRecipeName("")
          setTotalMeat(0)
          setTotalBone(0)
          setTotalOrgan(0)
          setTotalWeight(0)
          loadedRecipeIdRef.current = null
          setHasUnsavedChanges(false)
          await AsyncStorage.setItem("hasUnsavedChanges", "false")
          originalIngredientsRef.current = []
          originalRatioRef.current = null
        },
      },
    ])
  }, [])

  return {
    ingredients,
    setIngredients,
    totalMeat,
    totalBone,
    totalOrgan,
    totalWeight,
    recipeName,
    setRecipeName,
    isModalVisible,
    setIsModalVisible,
    isSaving,
    setIsSaving,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    loadedRecipeIdRef,
    originalIngredientsRef,
    originalRatioRef,
    calculateTotals,
    checkForChanges,
    handleDeleteIngredient,
    handleClearScreen,
    convertToUnit,
  }
}
