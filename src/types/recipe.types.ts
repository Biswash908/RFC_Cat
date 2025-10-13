export interface Ingredient {
    id: string
    name: string
    totalWeight: number
    meatWeight: number
    boneWeight: number
    organWeight: number
    meat: number
    bone: number
    organ: number
    type: string
    unit: string
  }
  
  export interface RatioObject {
    meat: number
    bone: number
    organ: number
    selectedRatio?: string
    isUserDefined?: boolean
  }
  
  export interface Recipe {
    id: string
    name: string
    ingredients: Ingredient[]
    ratio: string | RatioObject
    savedCustomRatio?: RatioObject
  }
  
  export interface SelectedRecipeData {
    ingredients: Ingredient[]
    recipeName: string
    recipeId: string
    ratio: RatioObject
    isUserDefined: boolean
    originalRatio: RatioObject
    savedCustomRatio?: RatioObject
  }
  