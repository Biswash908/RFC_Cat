export interface Ingredient {
    id: string
    name: string
    amount: number
    unit: string
    type: "Meat" | "Bone" | "Organ"
  }
  
  export interface Recipe {
    name: string
    ingredients: Ingredient[]
    totalMeat: number
    totalBone: number
    totalOrgan: number
    totalWeight: number
  }
  
  export interface Totals {
    meat: number
    bone: number
    organ: number
    weight: number
  }
  