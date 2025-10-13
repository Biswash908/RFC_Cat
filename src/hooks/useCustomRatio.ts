"use client"

import { useState, useEffect } from "react"
import { Alert } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSaveContext } from "../context/SaveContext"
import { validateRatioTotal } from "../utils/ratio-validation"

export const useCustomRatio = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { saveCustomRatios } = useSaveContext()

  const [meatRatio, setMeatRatio] = useState<number>(0)
  const [boneRatio, setBoneRatio] = useState<number>(0)
  const [organRatio, setOrganRatio] = useState<number>(0)

  useEffect(() => {
    const loadSavedRatios = async () => {
      try {
        // First check if we have custom ratio from route params
        if (route.params?.customRatio) {
          console.log("✅ Loading custom ratio from params:", route.params.customRatio)
          setMeatRatio(route.params.customRatio.meat || 0)
          setBoneRatio(route.params.customRatio.bone || 0)
          setOrganRatio(route.params.customRatio.organ || 0)
          return
        }

        // Otherwise load from AsyncStorage
        const customMeatRatio = await AsyncStorage.getItem("customMeatRatio")
        const customBoneRatio = await AsyncStorage.getItem("customBoneRatio")
        const customOrganRatio = await AsyncStorage.getItem("customOrganRatio")

        console.log("✅ Loading saved custom ratios in CustomRatioScreen:", {
          meat: customMeatRatio,
          bone: customBoneRatio,
          organ: customOrganRatio,
        })

        // Set saved ratios if they exist
        if (customMeatRatio && customBoneRatio && customOrganRatio) {
          setMeatRatio(Number.parseFloat(customMeatRatio))
          setBoneRatio(Number.parseFloat(customBoneRatio))
          setOrganRatio(Number.parseFloat(customOrganRatio))
        }
      } catch (error) {
        console.log("Failed to load saved ratios:", error)
      }
    }

    loadSavedRatios()
  }, [route.params?.customRatio])

  const handleSaveRatio = async () => {
    // Validate ratios
    const validation = validateRatioTotal(meatRatio, boneRatio, organRatio)
    if (!validation.isValid) {
      Alert.alert("Error", validation.error)
      return
    }

    try {
      // Get the current recipe ID if available
      const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe")
      const recipeId = selectedRecipeStr ? JSON.parse(selectedRecipeStr).recipeId : null

      // Mark this as a user-selected ratio - critical for persistence
      await AsyncStorage.setItem("userSelectedRatio", "true")

      // Save to global AsyncStorage for current session and temporary storage
      await AsyncStorage.multiSet([
        // Regular ratio values (used for UI display)
        ["meatRatio", meatRatio.toString()],
        ["boneRatio", boneRatio.toString()],
        ["organRatio", organRatio.toString()],
        ["selectedRatio", "custom"],

        // Custom ratio values (for future reference)
        ["customMeatRatio", meatRatio.toString()],
        ["customBoneRatio", boneRatio.toString()],
        ["customOrganRatio", organRatio.toString()],

        // Temporary ratio values (separate from permanent recipe data)
        ["tempMeatRatio", meatRatio.toString()],
        ["tempBoneRatio", boneRatio.toString()],
        ["tempOrganRatio", organRatio.toString()],
        ["tempSelectedRatio", "custom"],
      ])

      console.log("🚀 Setting custom ratio (temporary):", {
        meat: meatRatio,
        bone: boneRatio,
        organ: organRatio,
        recipeId,
      })

      // Save to context
      saveCustomRatios({
        meat: meatRatio,
        bone: boneRatio,
        organ: organRatio,
      })

      // If we have a recipe ID and a selected recipe, update the temporary ratio in memory
      if (recipeId && selectedRecipeStr) {
        const selectedRecipe = JSON.parse(selectedRecipeStr)

        // Only update the temporary ratio in memory, not in storage
        selectedRecipe.tempRatio = {
          meat: meatRatio,
          bone: boneRatio,
          organ: organRatio,
          selectedRatio: "custom",
          isUserDefined: true,
          isTemporary: true,
        }

        // Save the updated selectedRecipe with the temporary ratio
        await AsyncStorage.setItem("selectedRecipe", JSON.stringify(selectedRecipe))
      }

      // Navigate back with the custom ratio
      navigation.navigate("CalculatorScreen", {
        ratio: {
          meat: meatRatio,
          bone: boneRatio,
          organ: organRatio,
          selectedRatio: "custom",
          isUserDefined: true,
          isTemporary: true,
        },
      })
    } catch (error) {
      console.log("Failed to save ratios:", error)
      Alert.alert("Error", "Failed to save the ratio. Please try again.")
    }
  }

  return {
    meatRatio,
    boneRatio,
    organRatio,
    setMeatRatio,
    setBoneRatio,
    setOrganRatio,
    handleSaveRatio,
  }
}
