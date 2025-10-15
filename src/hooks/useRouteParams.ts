"use client"

import type React from "react"

import { useEffect } from "react"
import { useRoute, type RouteProp } from "@react-navigation/native"
import type { Ingredient } from "../components/food-input/ui/IngredientItem"

type RootStackParamList = {
  FoodInputScreen: undefined
  FoodInfoScreen: { ingredient: Ingredient; editMode: boolean }
  SearchScreen: undefined
  CalculatorScreen: { meat: number; bone: number; organ: number }
}

type FoodInputScreenRouteProp = RouteProp<RootStackParamList, "FoodInfoScreen">

export const useRouteParams = (
  globalUnit: "g" | "kg" | "lbs",
  ingredients: Ingredient[],
  setIngredients: (ingredients: Ingredient[]) => void,
  calculateTotals: (ingredients: Ingredient[]) => void,
  setRecipeName: (name: string) => void,
  setSelectedRatio: (ratio: string) => void,
  setNewMeat: (meat: number) => void,
  setNewBone: (bone: number) => void,
  setNewOrgan: (organ: number) => void,
  setTempRatio: (ratio: any) => void,
  selectedRatioRef: React.MutableRefObject<string | null>,
  loadedRecipeIdRef: React.MutableRefObject<string | null>,
  originalIngredientsRef: React.MutableRefObject<Ingredient[]>,
  originalRatioRef: React.MutableRefObject<any>,
) => {
  const route = useRoute<FoodInputScreenRouteProp>()

  useEffect(() => {
    const newIngredient = route.params?.updatedIngredient
    if (newIngredient) {
      newIngredient.unit = newIngredient.unit || globalUnit

      const existingIngredientIndex = ingredients.findIndex((ing) => ing.name === newIngredient.name)

      let updatedIngredients
      if (existingIngredientIndex !== -1) {
        updatedIngredients = ingredients.map((ing, index) => (index === existingIngredientIndex ? newIngredient : ing))
      } else {
        updatedIngredients = [...ingredients, newIngredient]
      }

      setIngredients(updatedIngredients)
      calculateTotals(updatedIngredients)
    }
  }, [route.params?.updatedIngredient, globalUnit])

  useEffect(() => {
    if (route.params?.ratio) {
      const { meat, bone, organ, selectedRatio } = route.params.ratio
      setTempRatio({
        meat,
        bone,
        organ,
        selectedRatio,
        isUserDefined: true,
      })
      setNewMeat(meat)
      setNewBone(bone)
      setNewOrgan(organ)
      setSelectedRatio(selectedRatio)
      selectedRatioRef.current = selectedRatio
    }
  }, [route.params?.ratio])

  useEffect(() => {
    if (route.params?.recipeId) {
      loadedRecipeIdRef.current = route.params?.recipeId
    }

    if (route.params?.ingredients) {
      const updatedIngredients = route.params.ingredients.map((ing) => ({
        ...ing,
        unit: ing.unit || globalUnit,
      }))
      setIngredients(updatedIngredients)
      calculateTotals(updatedIngredients)
      originalIngredientsRef.current = JSON.parse(JSON.stringify(updatedIngredients))
    }

    if (route.params?.recipeName) {
      setRecipeName(route.params.recipeName)
    }

    if (route.params?.ratio) {
      setSelectedRatio(route.params.ratio)
      originalRatioRef.current = route.params.ratio
    }
  }, [route.params])
}
