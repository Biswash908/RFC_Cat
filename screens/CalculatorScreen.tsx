"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native"
import { useNavigation, useRoute, type RouteProp, useFocusEffect } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSaveContext } from "../SaveContext"
import { useUnit } from "../UnitContext"

// Add responsive sizing utilities
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const isIOS = Platform.OS === "ios"
const scale = SCREEN_WIDTH / 375
const verticalScale = SCREEN_HEIGHT / 812

// Responsive sizing functions
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (isIOS ? Math.min(verticalScale, 1.2) : verticalScale))

interface Ingredient {
  id: string
  name: string
  type: string
  amount: number
  unit: string
  bonePercent?: number
}

type RootStackParamList = {
  FoodInputScreen: undefined
  FoodInfoScreen: { ingredient: Ingredient; editMode: boolean }
  SearchScreen: undefined
  CalculatorScreen: { meat: number; bone: number; organ: number }
  CustomRatioScreen: undefined
}

type CalculatorScreenRouteProp = RouteProp<RootStackParamList, "CalculatorScreen">

const CalculatorScreen: React.FC = () => {
  const route = useRoute<CalculatorScreenRouteProp>()
  const { customRatios } = useSaveContext()
  const navigation = useNavigation()

  // Modify the navigateToCustomRatio function to always remember the last custom ratio values
  const navigateToCustomRatio = () => {
    // Mark as user-selected when navigating to custom ratio screen
    AsyncStorage.setItem("userSelectedRatio", "true")

    // Get the current recipe's custom ratio if it exists
    const getCurrentRecipeRatio = async () => {
      try {
        const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe")
        if (selectedRecipeStr) {
          const selectedRecipe = JSON.parse(selectedRecipeStr)

          // First check if this recipe has a saved custom ratio
          if (selectedRecipe.savedCustomRatio) {
            // Use the recipe's saved custom ratio (even if not currently selected)
            console.log("✅ Loading recipe's saved custom ratio for editing:", selectedRecipe.savedCustomRatio)

            navigation.navigate("CustomRatioScreen", {
              customRatio: {
                meat: selectedRecipe.savedCustomRatio.meat,
                bone: selectedRecipe.savedCustomRatio.bone,
                organ: selectedRecipe.savedCustomRatio.organ,
              },
            })
            return
          }

          // If no saved custom ratio but current ratio is custom, use that
          if (selectedRecipe.ratio && selectedRecipe.ratio.selectedRatio === "custom") {
            console.log("✅ Loading recipe's current custom ratio for editing:", selectedRecipe.ratio)

            navigation.navigate("CustomRatioScreen", {
              customRatio: {
                meat: selectedRecipe.ratio.meat,
                bone: selectedRecipe.ratio.bone,
                organ: selectedRecipe.ratio.organ,
              },
            })
            return
          }
        }

        // If no recipe-specific ratio, use the current custom ratio if selected
        if (selectedRatio === "custom") {
          console.log("✅ Loading current custom ratio for editing:", customRatio)
          navigation.navigate("CustomRatioScreen", {
            customRatio: customRatio,
          })
        } else {
          // Otherwise, check if we have saved custom values in AsyncStorage
          const customMeatRatio = await AsyncStorage.getItem("customMeatRatio")
          const customBoneRatio = await AsyncStorage.getItem("customBoneRatio")
          const customOrganRatio = await AsyncStorage.getItem("customOrganRatio")

          if (customMeatRatio && customBoneRatio && customOrganRatio) {
            console.log("✅ Loading saved custom ratio values:", {
              meat: customMeatRatio,
              bone: customBoneRatio,
              organ: customOrganRatio,
            })

            navigation.navigate("CustomRatioScreen", {
              customRatio: {
                meat: Number(customMeatRatio),
                bone: Number(customBoneRatio),
                organ: Number(customOrganRatio),
              },
            })
          } else {
            // If nothing else is available, start with zeros
            console.log("✅ Starting new custom ratio with zeros")
            navigation.navigate("CustomRatioScreen", {
              customRatio: { meat: 0, bone: 0, organ: 0 },
            })
          }
        }
      } catch (error) {
        console.error("Error getting current recipe ratio:", error)
        // Fallback to default behavior
        navigation.navigate("CustomRatioScreen", {
          customRatio: selectedRatio === "custom" ? customRatio : null,
        })
      }
    }

    getCurrentRecipeRatio()
  }

  const initialMeatWeight = route.params?.meat ?? 0
  const initialBoneWeight = route.params?.bone ?? 0
  const initialOrganWeight = route.params?.organ ?? 0

  const loadedRatio = route.params?.ratio
  const [userSelectedRatio, setUserSelectedRatio] = useState<boolean>(false)

  const { unit } = useUnit()

  const [newMeat, setNewMeat] = useState<number>(80) // Default to 80 instead of 0
  const [newBone, setNewBone] = useState<number>(10) // Default to 10 instead of 0
  const [newOrgan, setNewOrgan] = useState<number>(10) // Default to 10 instead of 0
  const [selectedRatio, setSelectedRatio] = useState<string>("80:10:10")
  const [customRatio, setCustomRatio] = useState<{
    meat: number
    bone: number
    organ: number
  }>({
    meat: 0,
    bone: 0,
    organ: 0,
  })

  const [meatCorrect, setMeatCorrect] = useState<{
    bone: number
    organ: number
  }>({ bone: 0, organ: 0 })
  const [boneCorrect, setBoneCorrect] = useState<{
    meat: number
    organ: number
  }>({ meat: 0, organ: 0 })
  const [organCorrect, setOrganCorrect] = useState<{
    meat: number
    bone: number
  }>({ meat: 0, bone: 0 })

  // Add state to track current weights for calculations
  const [currentMeatWeight, setCurrentMeatWeight] = useState<number>(initialMeatWeight)
  const [currentBoneWeight, setCurrentBoneWeight] = useState<number>(initialBoneWeight)
  const [currentOrganWeight, setCurrentOrganWeight] = useState<number>(initialOrganWeight)

  // Update current weights when route params change
  useEffect(() => {
    if (route.params?.meat !== undefined) setCurrentMeatWeight(route.params.meat)
    if (route.params?.bone !== undefined) setCurrentBoneWeight(route.params.bone)
    if (route.params?.organ !== undefined) setCurrentOrganWeight(route.params.organ)
  }, [route.params?.meat, route.params?.bone, route.params?.organ])

  const initializeCorrectorsWithDefaultValues = () => {
    console.log("🚀 Initializing correctors with zero values")

    // Set all corrector values to zero on initial load
    setMeatCorrect({ bone: 0, organ: 0 })
    setBoneCorrect({ meat: 0, organ: 0 })
    setOrganCorrect({ meat: 0, bone: 0 })
  }

  useEffect(() => {
    navigation.setOptions({ title: "Calculator" })

    // Initialize correctors with default values on mount
    initializeCorrectorsWithDefaultValues()
  }, [navigation])

  useEffect(() => {
    const loadSavedRatio = async () => {
      try {
        const savedMeat = await AsyncStorage.getItem("meatRatio")
        const savedBone = await AsyncStorage.getItem("boneRatio")
        const savedOrgan = await AsyncStorage.getItem("organRatio")
        const savedRatio = await AsyncStorage.getItem("selectedRatio")

        console.log("🔄 Loading saved ratios:", {
          savedMeat,
          savedBone,
          savedOrgan,
          savedRatio,
        })

        if (!userSelectedRatio && !route.params?.ratio) {
          setSelectedRatio(savedRatio || "80:10:10")
          setNewMeat(Number(savedMeat) || 80)
          setNewBone(Number(savedBone) || 10)
          setNewOrgan(Number(savedOrgan) || 10)

          if (savedRatio === "custom") {
            const customMeat = Number(savedMeat) || 0
            const customBone = Number(savedBone) || 0
            const customOrgan = Number(savedOrgan) || 0

            console.log("✅ Auto-loading custom ratio:", {
              customMeat,
              customBone,
              customOrgan,
            })

            setCustomRatio({
              meat: customMeat,
              bone: customBone,
              organ: customOrgan,
            })
            setSelectedRatio("custom")
          }
        }
      } catch (error) {
        console.log("❌ Failed to load ratios:", error)
      }
    }

    loadSavedRatio()
  }, [userSelectedRatio, route.params?.ratio])

  useEffect(() => {
    // ✅ FIXED: Only apply custom ratio if it's a user-defined recipe
    if (
      route.params?.ratio &&
      route.params.ratio.selectedRatio === "custom" &&
      route.params.ratio.isUserDefined &&
      !userSelectedRatio &&
      route.params.ratio.meat > 0 &&
      route.params.ratio.bone > 0 &&
      route.params.ratio.organ > 0
    ) {
      console.log("✅ Auto-applying saved custom ratio in the background...", route.params.ratio)

      // ✅ Apply the ratio directly (without navigating)
      setNewMeat(route.params.ratio.meat)
      setNewBone(route.params.ratio.bone)
      setNewOrgan(route.params.ratio.organ)
      setCustomRatio({
        meat: route.params.ratio.meat,
        bone: route.params.ratio.bone,
        organ: route.params.ratio.organ,
      })
      setSelectedRatio("custom")
      setUserSelectedRatio(true) // ✅ Mark as selected to prevent loops

      // ✅ Save the custom ratio persistently
      const saveCustomRatios = async () => {
        try {
          await AsyncStorage.setItem("meatRatio", route.params.ratio.meat.toString())
          await AsyncStorage.setItem("boneRatio", route.params.ratio.bone.toString())
          await AsyncStorage.setItem("organRatio", route.params.ratio.organ.toString())
          await AsyncStorage.setItem("selectedRatio", "custom")
        } catch (error) {
          console.log("❌ Failed to save custom ratios:", error)
        }
      }
      saveCustomRatios()
    }
  }, [route.params?.ratio])

  useEffect(() => {
    // ✅ NEW: Special handling for recipe ratios
    const loadRecipeRatio = async () => {
      try {
        const selectedRecipe = await AsyncStorage.getItem("selectedRecipe")
        if (selectedRecipe) {
          const parsedRecipe = JSON.parse(selectedRecipe)
          if (parsedRecipe.ratio) {
            console.log("✅ Loading ratio from selected recipe:", parsedRecipe.ratio)

            // ✅ FIXED: Only use custom ratio for user-defined recipes
            if (parsedRecipe.ratio.isUserDefined && parsedRecipe.ratio.selectedRatio === "custom") {
              // Set the custom ratio values for user-defined recipes
              setNewMeat(parsedRecipe.ratio.meat)
              setNewBone(parsedRecipe.ratio.bone)
              setNewOrgan(parsedRecipe.ratio.organ)
              setCustomRatio({
                meat: parsedRecipe.ratio.meat,
                bone: parsedRecipe.ratio.bone,
                organ: parsedRecipe.ratio.organ,
              })
              setSelectedRatio("custom")

              // Save the values to AsyncStorage
              await AsyncStorage.setItem("meatRatio", parsedRecipe.ratio.meat.toString())
              await AsyncStorage.setItem("boneRatio", parsedRecipe.ratio.bone.toString())
              await AsyncStorage.setItem("organRatio", parsedRecipe.ratio.organ.toString())
              await AsyncStorage.setItem("selectedRatio", "custom")
            } else {
              // For standard ratios or default recipes, use the appropriate standard ratio
              const ratioValues = `${parsedRecipe.ratio.meat}:${parsedRecipe.ratio.bone}:${parsedRecipe.ratio.organ}`

              if (ratioValues === "80:10:10") {
                setSelectedRatio("80:10:10")
                setNewMeat(80)
                setNewBone(10)
                setNewOrgan(10)
              } else if (ratioValues === "75:15:10") {
                setSelectedRatio("75:15:10")
                setNewMeat(75)
                setNewBone(15)
                setNewOrgan(10)
              } else {
                // For other standard ratios, use the values but not as custom
                setNewMeat(parsedRecipe.ratio.meat)
                setNewBone(parsedRecipe.ratio.bone)
                setNewOrgan(parsedRecipe.ratio.organ)
                setSelectedRatio(parsedRecipe.ratio.selectedRatio)
              }

              // Save the values to AsyncStorage
              await AsyncStorage.setItem("meatRatio", parsedRecipe.ratio.meat.toString())
              await AsyncStorage.setItem("boneRatio", parsedRecipe.ratio.bone.toString())
              await AsyncStorage.setItem("organRatio", parsedRecipe.ratio.organ.toString())
              await AsyncStorage.setItem("selectedRatio", parsedRecipe.ratio.selectedRatio)
            }
          }
        }
      } catch (error) {
        console.error("❌ Error loading recipe ratio:", error)
      }
    }

    loadRecipeRatio()
  }, [])

  useEffect(() => {
    if (selectedRatio === "custom") {
      console.log("✅ Updating Custom Ratio Button Display:", customRatio)

      // ✅ Ensure the button text updates immediately
      setCustomRatio((prev) => ({
        meat: prev.meat || newMeat,
        bone: prev.bone || newBone,
        organ: prev.organ || newOrgan,
      }))
    }
  }, [selectedRatio, newMeat, newBone, newOrgan])

  useEffect(() => {
    if (route.params?.ratio) {
      // Check if there's a user-selected ratio that should take precedence
      const checkUserSelection = async () => {
        const wasUserSelected = await AsyncStorage.getItem("userSelectedRatio")

        if (wasUserSelected === "true") {
          console.log("🔒 User has manually selected a ratio, not applying recipe ratio")
          return // Don't apply recipe ratio if user has selected one
        }

        console.log("✅ Applying loaded recipe ratio:", route.params.ratio)

        // Apply the recipe ratio
        setNewMeat(route.params.ratio.meat)
        setNewBone(route.params.ratio.bone)
        setNewOrgan(route.params.ratio.organ)
        setSelectedRatio(route.params.ratio.selectedRatio)

        if (route.params.ratio.selectedRatio === "custom") {
          setCustomRatio({
            meat: route.params.ratio.meat,
            bone: route.params.ratio.bone,
            organ: route.params.ratio.organ,
          })
        }

        // Save the loaded ratio
        await AsyncStorage.multiSet([
          ["meatRatio", route.params.ratio.meat.toString()],
          ["boneRatio", route.params.ratio.bone.toString()],
          ["organRatio", route.params.ratio.organ.toString()],
          ["selectedRatio", route.params.ratio.selectedRatio],
          ["userSelectedRatio", "false"], // Mark as not user-selected
        ])

        // For custom ratios, also save to custom ratio keys
        if (route.params.ratio.selectedRatio === "custom") {
          await AsyncStorage.multiSet([
            ["customMeatRatio", route.params.ratio.meat.toString()],
            ["customBoneRatio", route.params.ratio.bone.toString()],
            ["customOrganRatio", route.params.ratio.organ.toString()],
          ])
        }
      }

      checkUserSelection()
    }
  }, [route.params?.ratio])

  // Also modify the useFocusEffect to load recipe-specific ratios
  // Modify the useFocusEffect callback to properly handle user selections
  // Replace the existing useFocusEffect with this improved version

  useFocusEffect(
    React.useCallback(() => {
      const loadRatios = async () => {
        try {
          // First check if there's a selected recipe
          const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe")

          if (selectedRecipeStr) {
            const selectedRecipe = JSON.parse(selectedRecipeStr)

            // If the recipe has a ratio defined, use that
            if (selectedRecipe.ratio) {
              console.log("🔄 Loading recipe-specific ratio:", selectedRecipe.ratio)

              // Always set the ratio values from the recipe
              setSelectedRatio(selectedRecipe.ratio.selectedRatio)
              setNewMeat(selectedRecipe.ratio.meat)
              setNewBone(selectedRecipe.ratio.bone)
              setNewOrgan(selectedRecipe.ratio.organ)

              // For custom ratios, also update the customRatio state
              if (selectedRecipe.ratio.selectedRatio === "custom") {
                setCustomRatio({
                  meat: selectedRecipe.ratio.meat,
                  bone: selectedRecipe.ratio.bone,
                  organ: selectedRecipe.ratio.organ,
                })
              }

              // Save to AsyncStorage to ensure persistence
              await AsyncStorage.multiSet([
                ["meatRatio", selectedRecipe.ratio.meat.toString()],
                ["boneRatio", selectedRecipe.ratio.bone.toString()],
                ["organRatio", selectedRecipe.ratio.organ.toString()],
                ["selectedRatio", selectedRecipe.ratio.selectedRatio],
              ])

              // For custom ratios, also save to custom ratio keys
              if (selectedRecipe.ratio.selectedRatio === "custom") {
                await AsyncStorage.multiSet([
                  ["customMeatRatio", selectedRecipe.ratio.meat.toString()],
                  ["customBoneRatio", selectedRecipe.ratio.bone.toString()],
                  ["customOrganRatio", selectedRecipe.ratio.organ.toString()],
                ])
              }

              return // Exit early after loading recipe-specific ratio
            }
          }

          // IMPORTANT: Always check for saved ratio first, regardless of userSelectedRatio flag
          // This ensures persistence of user selections even on fresh install
          const savedRatio = await AsyncStorage.getItem("selectedRatio")
          const savedMeat = await AsyncStorage.getItem("meatRatio")
          const savedBone = await AsyncStorage.getItem("boneRatio")
          const savedOrgan = await AsyncStorage.getItem("organRatio")

          console.log("🔄 Loading saved ratio:", {
            savedRatio,
            savedMeat,
            savedBone,
            savedOrgan,
          })

          if (savedRatio) {
            // For custom ratios, check if they have valid values
            if (savedRatio === "custom") {
              const meat = Number(savedMeat) || 0
              const bone = Number(savedBone) || 0
              const organ = Number(savedOrgan) || 0
              const total = meat + bone + organ

              // Only use custom ratio if it has valid values
              if (total > 0 && Math.abs(total - 100) < 5) {
                setSelectedRatio("custom")
                setNewMeat(meat)
                setNewBone(bone)
                setNewOrgan(organ)
                setCustomRatio({
                  meat: meat,
                  bone: bone,
                  organ: organ,
                })
              } else {
                // If custom ratio has invalid values, default to 80:10:10
                console.log("⚠️ Saved custom ratio has invalid values, defaulting to 80:10:10")
                setSelectedRatio("80:10:10")
                setNewMeat(80)
                setNewBone(10)
                setNewOrgan(10)

                // Save the default ratio
                await AsyncStorage.multiSet([
                  ["meatRatio", "80"],
                  ["boneRatio", "10"],
                  ["organRatio", "10"],
                  ["selectedRatio", "80:10:10"],
                ])
              }
            } else {
              // For standard ratios, use the saved values
              setSelectedRatio(savedRatio)
              setNewMeat(Number(savedMeat) || 80)
              setNewBone(Number(savedBone) || 10)
              setNewOrgan(Number(savedOrgan) || 10)
            }
          } else {
            // If no saved ratio at all, default to 80:10:10
            console.log("⚠️ No saved ratio found, defaulting to 80:10:10")
            setSelectedRatio("80:10:10")
            setNewMeat(80)
            setNewBone(10)
            setNewOrgan(10)

            // Save the default ratio
            await AsyncStorage.multiSet([
              ["meatRatio", "80"],
              ["boneRatio", "10"],
              ["organRatio", "10"],
              ["selectedRatio", "80:10:10"],
            ])
          }
        } catch (error) {
          console.log("❌ Failed to load ratios:", error)
        }
      }

      loadRatios()
    }, []), // Remove navigation dependency to prevent unnecessary reloads
  )

  useFocusEffect(
    React.useCallback(() => {
      if (!userSelectedRatio && customRatios) {
        // Only auto-apply custom ratio if it has valid non-zero values
        // and the total is close to 100%
        const total = customRatios.meat + customRatios.bone + customRatios.organ
        const hasValidValues = total > 0 && Math.abs(total - 100) < 5

        if (hasValidValues) {
          // ✅ Apply custom if it has valid values
          console.log("🔄 Auto-applying custom ratio:", customRatios)

          setNewMeat(customRatios.meat)
          setNewBone(customRatios.bone)
          setNewOrgan(customRatios.organ)
          setCustomRatio(customRatios)
          setSelectedRatio("custom")

          // ✅ Save it persistently
          const saveCustomRatios = async () => {
            try {
              await AsyncStorage.setItem("meatRatio", customRatios.meat.toString())
              await AsyncStorage.setItem("boneRatio", customRatios.bone.toString())
              await AsyncStorage.setItem("organRatio", customRatios.organ.toString())
              await AsyncStorage.setItem("selectedRatio", "custom")
            } catch (error) {
              console.log("❌ Failed to save custom ratios:", error)
            }
          }
          saveCustomRatios()
        } else {
          // If custom ratio doesn't have valid values, default to 80:10:10
          console.log("⚠️ Custom ratio has invalid values, defaulting to 80:10:10")
          setNewMeat(80)
          setNewBone(10)
          setNewOrgan(10)
          setSelectedRatio("80:10:10")

          // Save the default ratio
          const saveDefaultRatio = async () => {
            try {
              await AsyncStorage.setItem("meatRatio", "80")
              await AsyncStorage.setItem("boneRatio", "10")
              await AsyncStorage.setItem("organRatio", "10")
              await AsyncStorage.setItem("selectedRatio", "80:10:10")
            } catch (error) {
              console.log("❌ Failed to save default ratio:", error)
            }
          }
          saveDefaultRatio()
        }
      }
    }, [customRatios, userSelectedRatio]), // ✅ Only reapply if custom ratios change
  )

  // Modified useEffect to ensure corrector calculations happen immediately
  useEffect(() => {
    const saveRatios = async () => {
      try {
        await AsyncStorage.setItem("meatRatio", newMeat.toString())
        await AsyncStorage.setItem("boneRatio", newBone.toString())
        await AsyncStorage.setItem("organRatio", newOrgan.toString())
        await AsyncStorage.setItem("selectedRatio", selectedRatio)

        if (selectedRatio === "custom") {
          await AsyncStorage.setItem("customMeatRatio", newMeat.toString())
          await AsyncStorage.setItem("customBoneRatio", newBone.toString())
          await AsyncStorage.setItem("customOrganRatio", newOrgan.toString())
        }
      } catch (error) {
        console.log("Failed to save ratios:", error)
      }
    }

    if (newMeat !== null && newBone !== null && newOrgan !== null) {
      saveRatios()

      // Always use the latest weight values from state
      calculateCorrectors(currentMeatWeight, currentBoneWeight, currentOrganWeight, newMeat, newBone, newOrgan)
    }
  }, [newMeat, newBone, newOrgan, selectedRatio, currentMeatWeight, currentBoneWeight, currentOrganWeight])

  // Add a specific useFocusEffect to recalculate correctors when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 Screen focused - recalculating correctors")

      // Always force a recalculation on focus, regardless of whether we have weights
      if (currentMeatWeight === 0 && currentBoneWeight === 0 && currentOrganWeight === 0) {
        // For fresh launch or no ingredients, use sample calculation
        calculateSampleCorrectorsForFreshLaunch()
      } else {
        // For normal case with ingredients, use actual weights
        calculateCorrectors(currentMeatWeight, currentBoneWeight, currentOrganWeight, newMeat, newBone, newOrgan)
      }
    }, [newMeat, newBone, newOrgan, currentMeatWeight, currentBoneWeight, currentOrganWeight]),
  )

  const calculateSampleCorrectorsForFreshLaunch = () => {
    console.log("📊 Setting correctors to zero for fresh launch")

    // Set all corrector values to zero when no ingredients are present
    const meatCorrect = { bone: 0, organ: 0 }
    const boneCorrect = { meat: 0, organ: 0 }
    const organCorrect = { meat: 0, bone: 0 }

    // Set the corrector values
    setMeatCorrect(meatCorrect)
    setBoneCorrect(boneCorrect)
    setOrganCorrect(organCorrect)
  }

  function calculateCorrectors(
    meatWeight: number,
    boneWeight: number,
    organWeight: number,
    newMeat: number,
    newBone: number,
    newOrgan: number,
  ) {
    console.log("📊 Calculating correctors with:", {
      meatWeight,
      boneWeight,
      organWeight,
      newMeat,
      newBone,
      newOrgan,
    })

    // If we have no weights at all (fresh launch or no ingredients), set all values to zero
    if (meatWeight === 0 && boneWeight === 0 && organWeight === 0) {
      console.log("📊 No ingredients detected, setting correctors to zero")
      setMeatCorrect({ bone: 0, organ: 0 })
      setBoneCorrect({ meat: 0, organ: 0 })
      setOrganCorrect({ meat: 0, bone: 0 })
      return
    }

    const meatCorrect = { bone: 0, organ: 0 }
    const boneCorrect = { meat: 0, organ: 0 }
    const organCorrect = { meat: 0, bone: 0 }

    // Normal calculation when we have actual weights
    if (meatWeight > 0) {
      meatCorrect.bone = (meatWeight / newMeat) * newBone - boneWeight
      meatCorrect.organ = (meatWeight / newMeat) * newOrgan - organWeight
    }

    if (boneWeight > 0) {
      boneCorrect.meat = (boneWeight / newBone) * newMeat - meatWeight
      boneCorrect.organ = (boneWeight / newBone) * newOrgan - organWeight
    }

    if (organWeight > 0) {
      organCorrect.meat = (organWeight / newOrgan) * newMeat - meatWeight
      organCorrect.bone = (organWeight / newOrgan) * newBone - boneWeight
    }

    setMeatCorrect(meatCorrect)
    setBoneCorrect(boneCorrect)
    setOrganCorrect(organCorrect)
  }

  const setRatio = (meat: number, bone: number, organ: number, ratio: string) => {
    console.log(`✅ Setting ratio: ${ratio} (${meat}:${bone}:${organ})`)

    // Update state
    setNewMeat(meat)
    setNewBone(bone)
    setNewOrgan(organ)
    setSelectedRatio(ratio)
    setUserSelectedRatio(true) // Mark as manually selected

    if (ratio === "custom") {
      setCustomRatio({ meat, bone, organ })
    }

    // Save to AsyncStorage immediately - this is critical for persistence
    const saveItems = [
      ["meatRatio", meat.toString()],
      ["boneRatio", bone.toString()],
      ["organRatio", organ.toString()],
      ["selectedRatio", ratio],
      ["userSelectedRatio", "true"], // Add this to track user selection
    ]

    if (ratio === "custom") {
      saveItems.push(
        ["customMeatRatio", meat.toString()],
        ["customBoneRatio", bone.toString()],
        ["customOrganRatio", organ.toString()],
      )
    }

    AsyncStorage.multiSet(saveItems)
      .then(() => {
        console.log("✅ Successfully saved ratio selection to AsyncStorage")

        // Force recalculation of correctors immediately after setting ratio
        if (currentMeatWeight === 0 && currentBoneWeight === 0 && currentOrganWeight === 0) {
          calculateSampleCorrectorsForFreshLaunch()
        } else {
          calculateCorrectors(currentMeatWeight, currentBoneWeight, currentOrganWeight, meat, bone, organ)
        }
      })
      .catch((error) => {
        console.error("❌ Failed to save ratio selection:", error)
      })

    // Update the route params to pass the ratio values to home
    navigation.setParams({
      ratio: {
        meat: meat,
        bone: bone,
        organ: organ,
        selectedRatio: ratio,
        isUserDefined: true,
      },
    })

    // Also update the selected recipe if one is loaded
    const updateSelectedRecipe = async () => {
      try {
        const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe")
        if (selectedRecipeStr) {
          const selectedRecipe = JSON.parse(selectedRecipeStr)

          // Update the selectedRecipe's ratio
          selectedRecipe.ratio = {
            meat: meat,
            bone: bone,
            organ: organ,
            selectedRatio: ratio,
            isUserDefined: true,
          }

          // If switching to custom ratio, also update savedCustomRatio
          if (ratio === "custom") {
            selectedRecipe.savedCustomRatio = {
              meat: meat,
              bone: bone,
              organ: organ,
            }
          }

          // If switching to a predefined ratio, preserve the existing savedCustomRatio
          // (don't overwrite it)

          await AsyncStorage.setItem("selectedRecipe", JSON.stringify(selectedRecipe))

          // Also update the ratio in the recipes array
          const storedRecipes = await AsyncStorage.getItem("recipes")
          if (storedRecipes) {
            const parsedRecipes = JSON.parse(storedRecipes)
            const recipeIndex = parsedRecipes.findIndex((r) => r.id === selectedRecipe.recipeId)

            if (recipeIndex !== -1) {
              // Update the recipe's ratio
              parsedRecipes[recipeIndex].ratio = {
                meat: meat,
                bone: bone,
                organ: organ,
                selectedRatio: ratio,
                isUserDefined: true,
              }

              // If switching to custom ratio, also update savedCustomRatio
              if (ratio === "custom") {
                parsedRecipes[recipeIndex].savedCustomRatio = {
                  meat: meat,
                  bone: bone,
                  organ: organ,
                }
              }
              // If switching to a predefined ratio, preserve the existing savedCustomRatio
              // (don't overwrite it)

              // Save the updated recipes
              await AsyncStorage.setItem("recipes", JSON.stringify(parsedRecipes))
              console.log(`✅ Updated ratio for recipe "${selectedRecipe.recipeName}"`)
            }
          }
        }
      } catch (error) {
        console.error("Error updating selected recipe ratio:", error)
      }
    }
    updateSelectedRecipe()
  }

  const showRatioInfoAlert = () => {
    Alert.alert(
      "Ratio Info",
      "• Adult cats: 80% meat, 10% bone, 10% secreting organs\n\n" +
        "• Kittens and pregnant/nursing cats: 75% meat, 15% bone, 10% secreting organs\n\n" +
        "The higher bone content for kittens and mothers provides essential calcium for growth and lactation.",
      [{ text: "OK" }],
    )
  }

  const showInfoAlert = () => {
    Alert.alert(
      "Corrector Info",
      "The corrector values help you achieve the intended ratio. Adjust these values to match your desired meat, bone, and organ distribution.",
      [{ text: "OK" }],
    )
  }

  const clearUserSelection = async () => {
    await AsyncStorage.setItem("userSelectedRatio", "false")
    setUserSelectedRatio(false)
  }

  // Updated formatWeight function to remove .00 for grams and make unit stick to number
  const formatWeight = (value: number, ingredient: string) => {
    if (isNaN(value)) value = 0

    // Format the number based on unit
    let formattedValue
    if (unit === "g") {
      // For grams, show whole numbers if possible
      formattedValue = Math.abs(value) % 1 === 0 ? Math.abs(value).toFixed(0) : Math.abs(value).toFixed(2)
    } else {
      // For kg and lbs, always show 2 decimal places
      formattedValue = Math.abs(value).toFixed(2)
    }

    const action = value > 0 ? "Add" : value < 0 ? "Remove" : "Add"
    // Return with no space between number and unit
    return `${action} ${formattedValue}${unit} of ${ingredient}`
  }

  const displayCustomRatio =
    selectedRatio === "custom" &&
    (customRatio.meat !== undefined || customRatio.bone !== undefined || customRatio.organ !== undefined)
      ? `${customRatio.meat}:${customRatio.bone}:${customRatio.organ}`
      : "Custom Ratio"

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
          <View style={styles.topBar} />

          {/* Ratio Selection */}
          <View style={styles.ratioTitleContainer}>
            <Text style={styles.ratioTitle}>Set your Meat: Bone: Organ ratio:</Text>
            <TouchableOpacity onPress={showRatioInfoAlert} style={styles.infoIcon}>
              <FontAwesome name="info-circle" size={rs(20)} color="#000080" />
            </TouchableOpacity>
          </View>
          <View style={styles.ratioButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.ratioButton,
                selectedRatio === "80:10:10" && selectedRatio !== "custom" && styles.selectedRatioButton,
              ]}
              onPress={() => setRatio(80, 10, 10, "80:10:10")}
            >
              <Text
                style={[
                  styles.ratioButtonText,
                  selectedRatio === "80:10:10" && selectedRatio !== "custom" && { color: "white" },
                ]}
              >
                80:10:10
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.ratioButton,
                selectedRatio === "75:15:10" && selectedRatio !== "custom" && styles.selectedRatioButton,
              ]}
              onPress={() => setRatio(75, 15, 10, "75:15:10")}
            >
              <Text
                style={[
                  styles.ratioButtonText,
                  selectedRatio === "75:15:10" && selectedRatio !== "custom" && { color: "white" },
                ]}
              >
                75:15:10
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Ratio Button */}
          <TouchableOpacity
            style={[
              styles.customButton,
              selectedRatio === "custom"
                ? styles.selectedCustomButton
                : { backgroundColor: "white", borderColor: "navy" },
            ]}
            onPress={navigateToCustomRatio}
          >
            <Text
              style={[styles.customButtonText, selectedRatio === "custom" ? { color: "white" } : { color: "black" }]}
            >
              {selectedRatio === "custom" ? displayCustomRatio : "Custom Ratio"}
            </Text>
          </TouchableOpacity>

          {/* Corrector Information */}
          <View style={styles.correctorInfoContainer}>
            <Text style={styles.correctorInfoText}>Use the corrector to achieve the intended ratio:</Text>
            <TouchableOpacity onPress={showInfoAlert} style={styles.infoIcon}>
              <FontAwesome name="info-circle" size={rs(20)} color="#000080" />
            </TouchableOpacity>
          </View>

          {/* Corrector Boxes */}
          <View style={styles.correctorContainer}>
            {/* Meat Corrector */}
            <View style={[styles.correctorBox, styles.meatCorrector]}>
              <Text style={styles.correctorTitle}>If Meat is correct</Text>
              <Text style={styles.correctorText}>{formatWeight(meatCorrect.bone, "bones")}</Text>
              <Text style={styles.correctorText}>{formatWeight(meatCorrect.organ, "organs")}</Text>
            </View>

            {/* Bone Corrector */}
            <View style={[styles.correctorBox, styles.boneCorrector]}>
              <Text style={styles.correctorTitle}>If Bone is correct</Text>
              <Text style={styles.correctorText}>{formatWeight(boneCorrect.meat, "meat")}</Text>
              <Text style={styles.correctorText}>{formatWeight(boneCorrect.organ, "organs")}</Text>
            </View>

            {/* Organ Corrector */}
            <View style={[styles.correctorBox, styles.organCorrector]}>
              <Text style={styles.correctorTitle}>If Organ is correct</Text>
              <Text style={styles.correctorText}>{formatWeight(organCorrect.meat, "meat")}</Text>
              <Text style={styles.correctorText}>{formatWeight(organCorrect.bone, "bones")}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  topBar: {
    marginBottom: 16,
  },
  ratioTitle: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
    textAlign: "left",
    flex: 1,
  },
  ratioTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 1,
  },
  ratioButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  ratioButton: {
    paddingVertical: vs(10),
    paddingHorizontal: rs(20),
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#000080",
  },
  selectedRatioButton: {
    backgroundColor: "#000080",
    borderColor: "green",
  },
  customButton: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: vs(10),
    paddingHorizontal: rs(50),
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#000080",
  },
  selectedCustomButton: {
    backgroundColor: "#000080",
    borderColor: "green",
  },
  customButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "600",
  },
  ratioButtonText: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "600",
    color: "black",
  },
  correctorInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  correctorInfoText: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    color: "black",
    fontWeight: "bold",
    flex: 1,
  },
  correctorContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    marginTop: 16,
  },
  correctorBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "transparent",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#4747f5",
  },
  correctorTitle: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
    marginBottom: 8,
  },
  correctorText: {
    fontSize: rs(isSmallDevice ? 12 : 14),
  },
  meatCorrector: {},
  boneCorrector: {},
  organCorrector: {},
  applyButton: {
    backgroundColor: "#000080",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
  },
})

export default CalculatorScreen

