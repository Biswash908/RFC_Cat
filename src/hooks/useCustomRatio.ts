"use client"

import { useState, useEffect } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { validateRatioTotal } from "../utils/ratio-validation"

export const useCustomRatio = (initialCustomRatio?: { meat: number; bone: number; organ: number } | null) => {
  const navigation = useNavigation()

  const [meatRatio, setMeatRatio] = useState<string>("")
  const [boneRatio, setBoneRatio] = useState<string>("")
  const [organRatio, setOrganRatio] = useState<string>("")

  const totalRatio = (Number(meatRatio) || 0) + (Number(boneRatio) || 0) + (Number(organRatio) || 0)

  useEffect(() => {
    const loadSavedRatios = async () => {
      try {
        // First check if we have custom ratio from initial params
        if (initialCustomRatio) {
          console.log("✅ Loading custom ratio from params:", initialCustomRatio)
          setMeatRatio(initialCustomRatio.meat.toString())
          setBoneRatio(initialCustomRatio.bone.toString())
          setOrganRatio(initialCustomRatio.organ.toString())
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
          setMeatRatio(customMeatRatio)
          setBoneRatio(customBoneRatio)
          setOrganRatio(customOrganRatio)
        }
      } catch (error) {
        console.log("Failed to load saved ratios:", error)
      }
    }

    loadSavedRatios()
  }, [initialCustomRatio])

  const handleRatioChange = (type: "meat" | "bone" | "organ", value: string) => {
    switch (type) {
      case "meat":
        setMeatRatio(value)
        break
      case "bone":
        setBoneRatio(value)
        break
      case "organ":
        setOrganRatio(value)
        break
    }
  }

  const handleUseRatio = async () => {
    const meat = Number(meatRatio) || 0
    const bone = Number(boneRatio) || 0
    const organ = Number(organRatio) || 0

    // Validate ratios
    const validation = validateRatioTotal(meat, bone, organ)
    if (!validation.isValid) {
      Alert.alert("Error", validation.error || "Invalid ratio values")
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
        ["meatRatio", meat.toString()],
        ["boneRatio", bone.toString()],
        ["organRatio", organ.toString()],
        ["selectedRatio", "custom"],

        // Custom ratio values (for future reference)
        ["customMeatRatio", meat.toString()],
        ["customBoneRatio", bone.toString()],
        ["customOrganRatio", organ.toString()],

        // Temporary ratio values (separate from permanent recipe data)
        ["tempMeatRatio", meat.toString()],
        ["tempBoneRatio", bone.toString()],
        ["tempOrganRatio", organ.toString()],
        ["tempSelectedRatio", "custom"],
      ])

      console.log("🚀 Setting custom ratio (temporary):", {
        meat,
        bone,
        organ,
        recipeId,
      })

      // If we have a recipe ID and a selected recipe, update the temporary ratio in memory
      if (recipeId && selectedRecipeStr) {
        const selectedRecipe = JSON.parse(selectedRecipeStr)

        // Only update the temporary ratio in memory, not in storage
        selectedRecipe.tempRatio = {
          meat,
          bone,
          organ,
          selectedRatio: "custom",
          isUserDefined: true,
          isTemporary: true,
        }

        // Save the updated selectedRecipe with the temporary ratio
        await AsyncStorage.setItem("selectedRecipe", JSON.stringify(selectedRecipe))
      }
      // Navigate back with the custom ratio
      ;(navigation as any).navigate("CalculatorScreen", {
        ratio: {
          meat,
          bone,
          organ,
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
    totalRatio,
    handleRatioChange,
    handleUseRatio,
  }
}
