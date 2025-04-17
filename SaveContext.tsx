"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Recipe = {
  id: string
  name: string
  ingredients: string
}

type SaveContextType = {
  customRatios: { meat: number; bone: number; organ: number }
  recipes: Recipe[]
  saveCustomRatios: (newRatios: { meat: number; bone: number; organ: number }) => void
  addRecipe: (recipe: Omit<Recipe, "id">) => void
}

const SaveContext = createContext<SaveContextType | undefined>(undefined)

export const SaveProvider: React.FC = ({ children }) => {
  const [customRatios, setCustomRatios] = useState({
    meat: 0,
    bone: 0,
    organ: 0,
  })
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    const loadData = async () => {
      const storedRatios = await AsyncStorage.getItem("customRatios")
      if (storedRatios) setCustomRatios(JSON.parse(storedRatios))

      const storedRecipes = await AsyncStorage.getItem("recipes")
      if (storedRecipes) setRecipes(JSON.parse(storedRecipes))
    }
    loadData()
  }, [])

  const saveCustomRatios = (newRatios: { meat: number; bone: number; organ: number }) => {
    setCustomRatios(newRatios)
    AsyncStorage.setItem("customRatios", JSON.stringify(newRatios))
  }

  const addRecipe = async (recipe: Omit<Recipe, "id">) => {
    const newRecipe = {
      ...recipe,
      id: Math.random().toString(36).substring(2, 15),
    }

    setRecipes((prev) => [...prev, newRecipe])
    AsyncStorage.setItem("recipes", JSON.stringify([...recipes, newRecipe]))
  }

  return (
    <SaveContext.Provider
      value={{
        customRatios,
        recipes,
        saveCustomRatios,
        addRecipe,
      }}
    >
      {children}
    </SaveContext.Provider>
  )
}

export const useSaveContext = () => {
  const context = useContext(SaveContext)
  if (!context) {
    throw new Error("useSaveContext must be used within a SaveProvider")
  }
  return context
}
