"use client"

import React, { useEffect } from "react"
import { View, Text, StatusBar, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute, type RouteProp, useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSaveContext } from "../context/SaveContext"
import { useCustomRatio } from "../hooks/useCustomRatio"
import { RatioInputGrid } from "../components/custom-ratio/RatioInputGrid"
import { InfoButton } from "../components/calculator/InfoButton"
import { CUSTOM_RATIO_INFO_TEXT } from "../constants/ratios"

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
  CalculatorScreen: { meat: number; bone: number; organ: number; ratio?: any }
  CustomRatioScreen: { customRatio?: { meat: number; bone: number; organ: number } | null }
}

type CustomRatioScreenRouteProp = RouteProp<RootStackParamList, "CustomRatioScreen">

const CustomRatioScreen: React.FC = () => {
  const route = useRoute<CustomRatioScreenRouteProp>()
  const navigation = useNavigation()
  const { customRatios } = useSaveContext()

  const initialCustomRatio = route.params?.customRatio || null

  const { meatRatio, boneRatio, organRatio, totalRatio, handleRatioChange, handleUseRatio } =
    useCustomRatio(initialCustomRatio)

  useEffect(() => {
    navigation.setOptions({ title: "Custom Ratio" })
  }, [navigation])

  // Load custom ratio from AsyncStorage when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadCustomRatio = async () => {
        try {
          const customMeatRatio = await AsyncStorage.getItem("customMeatRatio")
          const customBoneRatio = await AsyncStorage.getItem("customBoneRatio")
          const customOrganRatio = await AsyncStorage.getItem("customOrganRatio")

          if (customMeatRatio && customBoneRatio && customOrganRatio) {
            handleRatioChange("meat", customMeatRatio)
            handleRatioChange("bone", customBoneRatio)
            handleRatioChange("organ", customOrganRatio)
          }
        } catch (error) {
          console.log("Failed to load custom ratio:", error)
        }
      }

      loadCustomRatio()
    }, []),
  )

  const onUseRatio = async () => {
    await handleUseRatio()
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
          <View style={styles.ratioTitleContainer}>
            <Text style={styles.ratioTitle}>Enter your custom ratio:</Text>
            <InfoButton title="Custom Ratio Info" message={CUSTOM_RATIO_INFO_TEXT} />
          </View>

          <RatioInputGrid
            meatRatio={meatRatio}
            boneRatio={boneRatio}
            organRatio={organRatio}
            totalRatio={totalRatio}
            onRatioChange={handleRatioChange}
            onUseRatio={onUseRatio}
          />
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
    paddingHorizontal: 16,
    paddingTop: 24, // no overlap with header
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
    marginBottom: 12, // remove marginTop completely
  },
})

export default CustomRatioScreen
