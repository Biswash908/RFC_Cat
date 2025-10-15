"use client"

import React, { useEffect, useState } from "react"
import { View, Text, StatusBar, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
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

  const navigateToCustomRatio = async () => {
    await AsyncStorage.setItem("userSelectedRatio", "true")
    ;(navigation as any).navigate("CustomRatioScreen", { customRatio })
  }

  const handleSetRatio = async (meat: number, bone: number, organ: number, ratio: string) => {
    await setRatio(meat, bone, organ, ratio)
    ;(navigation as any).setParams({
      ratio: { meat, bone, organ, selectedRatio: ratio, isUserDefined: true, isTemporary: true },
    })
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  topBar: {
    marginBottom: 0,
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
