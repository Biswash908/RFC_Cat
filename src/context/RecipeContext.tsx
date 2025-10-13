"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import type { Ingredient } from "../types/food-input.types"

interface RecipeContextType {
  selectedRecipe: {
    name: string
    ingredients: Ingredient[]
  } | null
  setSelectedRecipe: (recipe: { name: string; ingredients: Ingredient[] } | null) => void
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<{
    name: string
    ingredients: Ingredient[]
  } | null>(null)

  return <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe }}>{children}</RecipeContext.Provider>
}

export const useRecipe = () => {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error("useRecipe must be used within RecipeProvider")
  }
  return context
}
