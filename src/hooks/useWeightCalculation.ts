"use client"

import { useState, useEffect } from "react"
import { convertWeight, calculateComponentWeights } from "../utils/weight-conversion"

interface Ingredient {
  meat: number
  bone: number
  organ: number
}

export const useWeightCalculation = (weight: string, selectedUnit: "g" | "kg" | "lbs", ingredient: Ingredient) => {
  const [meatWeight, setMeatWeight] = useState(0)
  const [boneWeight, setBoneWeight] = useState(0)
  const [organWeight, setOrganWeight] = useState(0)

  useEffect(() => {
    if (weight && !isNaN(Number.parseFloat(weight))) {
      const weightInGrams = convertWeight(Number.parseFloat(weight))
      const weights = calculateComponentWeights(weightInGrams, ingredient)

      setMeatWeight(weights.meatWeight)
      setBoneWeight(weights.boneWeight)
      setOrganWeight(weights.organWeight)
    } else {
      setMeatWeight(0)
      setBoneWeight(0)
      setOrganWeight(0)
    }
  }, [weight, selectedUnit, ingredient])

  return { meatWeight, boneWeight, organWeight }
}
