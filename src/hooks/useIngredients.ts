"use client"

import { useState, useCallback } from "react"
import { Alert } from "react-native"
import type { Ingredient, Totals } from "../types/food-input.types"
import { calculateTotals } from "../utils/calculations"

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [totals, setTotals] = useState<Totals>({
    meat: 0,
    bone: 0,
    organ: 0,
    weight: 0,
  })

  const addIngredient = useCallback((ingredient: Ingredient) => {
    setIngredients((prev) => {
      const updated = [...prev, ingredient]
      setTotals(calculateTotals(updated))
      return updated
    })
  }, [])

  const updateIngredient = useCallback((id: string, updated: Ingredient) => {
    setIngredients((prev) => {
      const newIngredients = prev.map((ing) => (ing.id === id ? updated : ing))
      setTotals(calculateTotals(newIngredients))
      return newIngredients
    })
  }, [])

  const deleteIngredient = useCallback((id: string) => {
    Alert.alert("Delete Ingredient", "Are you sure you want to delete this ingredient?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setIngredients((prev) => {
            const updated = prev.filter((ing) => ing.id !== id)
            setTotals(calculateTotals(updated))
            return updated
          })
        },
      },
    ])
  }, [])

  const clearIngredients = useCallback(() => {
    Alert.alert("Clear All", "Are you sure you want to clear all ingredients?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setIngredients([])
          setTotals({ meat: 0, bone: 0, organ: 0, weight: 0 })
        },
      },
    ])
  }, [])

  const loadRecipeIngredients = useCallback((recipeIngredients: Ingredient[]) => {
    setIngredients(recipeIngredients)
    setTotals(calculateTotals(recipeIngredients))
  }, [])

  return {
    ingredients,
    totals,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    clearIngredients,
    loadRecipeIngredients,
  }
}
