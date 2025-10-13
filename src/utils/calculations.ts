import type { Ingredient, Totals } from "../types/food-input.types"
import { UNIT_CONVERSIONS } from "../constants/units"

export const convertToGrams = (amount: number, unit: string): number => {
  const conversion = UNIT_CONVERSIONS[unit as keyof typeof UNIT_CONVERSIONS] || 1
  return amount * conversion
}

export const convertFromGrams = (grams: number, unit: string): number => {
  const conversion = UNIT_CONVERSIONS[unit as keyof typeof UNIT_CONVERSIONS] || 1
  return grams / conversion
}

export const calculateTotals = (ingredients: Ingredient[]): Totals => {
  const totals = ingredients.reduce(
    (acc, ingredient) => {
      const amountInGrams = convertToGrams(ingredient.amount, ingredient.unit)

      switch (ingredient.type) {
        case "Meat":
          acc.meat += amountInGrams
          break
        case "Bone":
          acc.bone += amountInGrams
          break
        case "Organ":
          acc.organ += amountInGrams
          break
      }

      acc.weight += amountInGrams
      return acc
    },
    { meat: 0, bone: 0, organ: 0, weight: 0 },
  )

  return totals
}
