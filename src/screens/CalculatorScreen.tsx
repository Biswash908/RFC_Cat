"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native"
import { useNavigation, useRoute, type RouteProp, useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSaveContext } from "../context/SaveContext"
import { useUnit } from "../context/UnitContext"
import { useRatioManagement } from "../hooks/useRatioManagement"
import { RatioSelector } from "../components/calculator/RatioSelector"
import { CustomRatioButton } from "../components/calculator/CustomRatioButton"
import { CorrectorGrid } from "../components/calculator/CorrectorGrid"
import { InfoButton } from "../components/calculator/InfoButton"
import { RATIO_INFO_TEXT } from "../constants/ratios"
import { calculateCorrectorValues } from "../utils/calculator-utils"
import type { RatioValues, CorrectorValues, BoneCorrectorValues, OrganCorrectorValues } from "../types/calculator.types"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const isIOS = Platform.OS === "ios"
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))

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
  CalculatorScreen: { meat: number; bone: number; organ: number; ratio?: RatioValues }
  CustomRatioScreen: { customRatio?: { meat: number; bone: number; organ: number } | null }
}

type CalculatorScreenRouteProp = RouteProp<RootStackParamList, "CalculatorScreen">

const CalculatorScreen: React.FC = () => {
  const route = useRoute<CalculatorScreenRouteProp>()
  const { customRatios } = useSaveContext()
  const navigation = useNavigation()
  const { unit } = useUnit()

  const initialMeatWeight = route.params?.meat ?? 0
  const initialBoneWeight = route.params?.bone ?? 0
  const initialOrganWeight = route.params?.organ ?? 0

  const [currentMeatWeight, setCurrentMeatWeight] = useState<number>(initialMeatWeight)
  const [currentBoneWeight, setCurrentBoneWeight] = useState<number>(initialBoneWeight)
  const [currentOrganWeight, setCurrentOrganWeight] = useState<number>(initialOrganWeight)

  const [meatCorrect, setMeatCorrect] = useState<CorrectorValues>({ bone: 0, organ: 0 })
  const [boneCorrect, setBoneCorrect] = useState<BoneCorrectorValues>({ meat: 0, organ: 0 })
  const [organCorrect, setOrganCorrect] = useState<OrganCorrectorValues>({ meat: 0, bone: 0 })

  const {
    newMeat,
    newBone,
    newOrgan,
    selectedRatio,
    customRatio,
    userSelectedRatio,
    setRatio,
    setCustomRatio,
    clearUserSelection,
  } = useRatioManagement(route.params?.ratio)

  useEffect(() => {
    navigation.setOptions({ title: "Calculator" })
  }, [navigation])

  // Update current weights when route params change
  useEffect(() => {
    if (route.params?.meat !== undefined) setCurrentMeatWeight(route.params.meat)
    if (route.params?.bone !== undefined) setCurrentBoneWeight(route.params.bone)
    if (route.params?.organ !== undefined) setCurrentOrganWeight(route.params.organ)
  }, [route.params?.meat, route.params?.bone, route.params?.organ])

  // Calculate correctors whenever weights or ratios change
  useEffect(() => {
    const correctors = calculateCorrectorValues(
      currentMeatWeight,
      currentBoneWeight,
      currentOrganWeight,
      newMeat,
      newBone,
      newOrgan,
    )
    setMeatCorrect(correctors.meatCorrect)
    setBoneCorrect(correctors.boneCorrect)
    setOrganCorrect(correctors.organCorrect)
  }, [newMeat, newBone, newOrgan, currentMeatWeight, currentBoneWeight, currentOrganWeight])

  // Recalculate correctors when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const correctors = calculateCorrectorValues(
        currentMeatWeight,
        currentBoneWeight,
        currentOrganWeight,
        newMeat,
        newBone,
        newOrgan,
      )
      setMeatCorrect(correctors.meatCorrect)
      setBoneCorrect(correctors.boneCorrect)
      setOrganCorrect(correctors.organCorrect)
    }, [newMeat, newBone, newOrgan, currentMeatWeight, currentBoneWeight, currentOrganWeight]),
  )

  // Load temporary or recipe-specific ratios on focus
  useFocusEffect(
    React.useCallback(() => {
      const loadRatios = async () => {
        try {
          const tempSelectedRatio = await AsyncStorage.getItem("tempSelectedRatio")
          const tempMeatRatio = await AsyncStorage.getItem("tempMeatRatio")
          const tempBoneRatio = await AsyncStorage.getItem("tempBoneRatio")
          const tempOrganRatio = await AsyncStorage.getItem("tempOrganRatio")

          if (tempSelectedRatio && tempMeatRatio && tempBoneRatio && tempOrganRatio) {
            await setRatio(Number(tempMeatRatio), Number(tempBoneRatio), Number(tempOrganRatio), tempSelectedRatio)
            return
          }

          const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe")
          if (selectedRecipeStr) {
            const selectedRecipe = JSON.parse(selectedRecipeStr)
            if (selectedRecipe.ratio) {
              await setRatio(
                selectedRecipe.ratio.meat,
                selectedRecipe.ratio.bone,
                selectedRecipe.ratio.organ,
                selectedRecipe.ratio.selectedRatio,
              )
            }
          }
        } catch (error) {
          console.log("❌ Failed to load ratios:", error)
        }
      }

      loadRatios()
    }, []),
  )

  const navigateToCustomRatio = async () => {
    await AsyncStorage.setItem("userSelectedRatio", "true")

    try {
      const selectedRecipeStr = await AsyncStorage.getItem("selectedRecipe")
      if (selectedRecipeStr) {
        const selectedRecipe = JSON.parse(selectedRecipeStr)

        if (selectedRecipe.savedCustomRatio) {
          ;(navigation as any).navigate("CustomRatioScreen", {
            customRatio: selectedRecipe.savedCustomRatio,
          })
          return
        }

        if (selectedRecipe.ratio?.selectedRatio === "custom") {
          ;(navigation as any).navigate("CustomRatioScreen", {
            customRatio: {
              meat: selectedRecipe.ratio.meat,
              bone: selectedRecipe.ratio.bone,
              organ: selectedRecipe.ratio.organ,
            },
          })
          return
        }
      }

      if (selectedRatio === "custom") {
        ;(navigation as any).navigate("CustomRatioScreen", { customRatio })
      } else {
        const customMeatRatio = await AsyncStorage.getItem("customMeatRatio")
        const customBoneRatio = await AsyncStorage.getItem("customBoneRatio")
        const customOrganRatio = await AsyncStorage.getItem("customOrganRatio")

        if (customMeatRatio && customBoneRatio && customOrganRatio) {
          ;(navigation as any).navigate("CustomRatioScreen", {
            customRatio: {
              meat: Number(customMeatRatio),
              bone: Number(customBoneRatio),
              organ: Number(customOrganRatio),
            },
          })
        } else {
          ;(navigation as any).navigate("CustomRatioScreen", {
            customRatio: null,
          })
        }
      }
    } catch (error) {
      console
        .error(
          "Error getting current recipe ratio:",
          error,
        )(navigation as any)
        .navigate("CustomRatioScreen", {
          customRatio: selectedRatio === "custom" ? customRatio : null,
        })
    }
  }

  const handleSetRatio = async (meat: number, bone: number, organ: number, ratio: string) => {
    await setRatio(
      meat,
      bone,
      organ,
      ratio,
    )(navigation as any).setParams({
      ratio: {
        meat,
        bone,
        organ,
        selectedRatio: ratio,
        isUserDefined: true,
        isTemporary: true,
      },
    })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
          <View style={styles.topBar} />

          <View style={styles.ratioTitleContainer}>
            <Text style={styles.ratioTitle}>Set your Meat: Bone: Organ ratio:</Text>
            <InfoButton title="Ratio Info" message={RATIO_INFO_TEXT} />
          </View>

          <RatioSelector selectedRatio={selectedRatio} onSelectRatio={handleSetRatio} />

          <CustomRatioButton selectedRatio={selectedRatio} customRatio={customRatio} onPress={navigateToCustomRatio} />

          <CorrectorGrid meatCorrect={meatCorrect} boneCorrect={boneCorrect} organCorrect={organCorrect} unit={unit} />
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
})

export default CalculatorScreen
