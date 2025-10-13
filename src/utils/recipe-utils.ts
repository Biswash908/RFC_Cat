import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Recipe, RatioObject, SelectedRecipeData } from "../types/recipe.types"

// Deep copy utility
export const deepCopy = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

// Parse ratio from string or object format
export const parseRatio = (recipe: Recipe): RatioObject => {
  const isDefaultRecipe = recipe.id.startsWith("default") || recipe.id.startsWith("cat_recipe")

  if (typeof recipe.ratio === "string") {
    const parts = recipe.ratio.split(":")
    if (parts.length === 3) {
      const ratioString = recipe.ratio
      let selectedRatio = "custom"

      if (ratioString === "80:10:10") {
        selectedRatio = "80:10:10"
      } else if (ratioString === "75:15:10") {
        selectedRatio = "75:15:10"
      }

      return {
        meat: Number(parts[0]),
        bone: Number(parts[1]),
        organ: Number(parts[2]),
        selectedRatio,
        isUserDefined: !isDefaultRecipe,
      }
    }
  } else if (recipe.ratio && typeof recipe.ratio === "object") {
    const ratioValues = `${recipe.ratio.meat}:${recipe.ratio.bone}:${recipe.ratio.organ}`
    let selectedRatio = "custom"

    if (ratioValues === "80:10:10") {
      selectedRatio = "80:10:10"
    } else if (ratioValues === "75:15:10") {
      selectedRatio = "75:15:10"
    }

    return {
      ...recipe.ratio,
      selectedRatio: recipe.ratio.selectedRatio || selectedRatio,
      isUserDefined: recipe.ratio.isUserDefined !== undefined ? recipe.ratio.isUserDefined : !isDefaultRecipe,
    }
  }

  // Default fallback
  return {
    meat: 80,
    bone: 10,
    organ: 10,
    selectedRatio: "80:10:10",
    isUserDefined: false,
  }
}

// Format ratio for display
export const formatRatioDisplay = (recipe: Recipe): string => {
  if (!recipe || !recipe.ratio) return "No Ratio"

  if (typeof recipe.ratio === "object") {
    if (recipe.ratio.meat !== undefined && recipe.ratio.bone !== undefined && recipe.ratio.organ !== undefined) {
      return `${recipe.ratio.meat} M : ${recipe.ratio.bone} B : ${recipe.ratio.organ} O`
    }
  }

  const ratioStr = String(recipe.ratio)
  const parts = ratioStr.split(":")

  if (parts.length === 3) {
    return `${parts[0]} M : ${parts[1]} B : ${parts[2]} O`
  }

  return "No Ratio"
}

// Check for unsaved changes
export const checkUnsavedChanges = async (): Promise<boolean> => {
  try {
    const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe")
    if (selectedRecipeStr) {
      const hasUnsavedChangesStr = await AsyncStorage.getItem("hasUnsavedChanges")
      return hasUnsavedChangesStr === "true"
    }
    return false
  } catch (error) {
    console.error("Error checking for unsaved changes:", error)
    return false
  }
}

// Prepare recipe for loading
export const prepareRecipeForLoading = async (recipe: Recipe): Promise<SelectedRecipeData> => {
  const recipeCopy = deepCopy(recipe)
  const ratioObject = parseRatio(recipeCopy)
  const isDefaultRecipe = recipe.id.startsWith("default") || recipe.id.startsWith("cat_recipe")

  // Reset flags
  await AsyncStorage.multiSet([
    ["userSelectedRatio", "false"],
    ["hasUnsavedChanges", "false"],
    ["tempMeatRatio", ratioObject.meat.toString()],
    ["tempBoneRatio", ratioObject.bone.toString()],
    ["tempOrganRatio", ratioObject.organ.toString()],
    ["tempSelectedRatio", ratioObject.selectedRatio || "custom"],
    ["meatRatio", ratioObject.meat.toString()],
    ["boneRatio", ratioObject.bone.toString()],
    ["organRatio", ratioObject.organ.toString()],
    ["selectedRatio", ratioObject.selectedRatio || "custom"],
  ])

  const ingredientsCopy = deepCopy(recipeCopy.ingredients)

  const selectedRecipeData: SelectedRecipeData = {
    ingredients: ingredientsCopy,
    recipeName: recipeCopy.name,
    recipeId: recipeCopy.id,
    ratio: ratioObject,
    isUserDefined: !isDefaultRecipe,
    originalRatio: deepCopy(ratioObject),
  }

  if (recipeCopy.savedCustomRatio) {
    selectedRecipeData.savedCustomRatio = deepCopy(recipeCopy.savedCustomRatio)
  }

  await AsyncStorage.setItem("selectedRecipe", JSON.stringify(selectedRecipeData))

  return selectedRecipeData
}

// Generate unique recipe name
export const generateUniqueRecipeName = (baseName: string, existingRecipes: Recipe[], excludeId?: string): string => {
  let uniqueName = baseName.trim()
  let counter = 1

  while (existingRecipes.some((recipe) => recipe.name === uniqueName && recipe.id !== excludeId)) {
    uniqueName = `${baseName.trim()}(${counter})`
    counter++
  }

  return uniqueName
}
