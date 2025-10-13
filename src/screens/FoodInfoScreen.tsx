"use client"

import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { useUnit } from "../context/UnitContext"
import { WeightInput } from "../components/food-info/WeightInput"
import { UnitSelector } from "../components/shared/UnitSelector"
import { ResultDisplay } from "../components/food-info/ResultDisplay"
import { useWeightCalculation } from "../hooks/useWeightCalculation"
import { convertWeight } from "../utils/weight-conversion"
import { rs, vs, isSmallDevice } from "../constants/responsive"

type RootStackParamList = {
  FoodInfoScreen: {
    ingredient: {
      id: string
      name: string
      meat: number
      bone: number
      organ: number
      weight?: number
      unit: "g" | "kg" | "lbs"
      isSupplement?: boolean
    }
    editMode: boolean
  }
  HomeTabs: {
    screen: string
    params: {
      updatedIngredient: any
    }
  }
}

type FoodInfoScreenRouteProp = RouteProp<RootStackParamList, "FoodInfoScreen">
type FoodInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, "FoodInfoScreen">

type Props = {
  route: FoodInfoScreenRouteProp
  navigation: FoodInfoScreenNavigationProp
}

const FoodInfoScreen = ({ route, navigation }: Props) => {
  const { setUnit } = useUnit()
  const { ingredient, editMode } = route.params

  const initialWeight = editMode && ingredient.weight ? ingredient.weight.toString() : ""
  const [weight, setWeight] = useState(initialWeight)
  const [selectedUnit, setSelectedUnit] = useState<"g" | "kg" | "lbs">(ingredient.unit || "g")

  const { meatWeight, boneWeight, organWeight } = useWeightCalculation(weight, selectedUnit, ingredient)

  const isSupplement =
    ingredient.name === "Bone Meal" || ingredient.name === "Powdered Eggshell" || ingredient.isSupplement

  const handleUnitChange = (unit: "g" | "kg" | "lbs") => {
    setSelectedUnit(unit)
    if (weight && !isNaN(Number.parseFloat(weight))) {
      setWeight(convertWeight(Number.parseFloat(weight)).toString())
    }
  }

  const handleSaveIngredient = () => {
    const weightInGrams = convertWeight(Number.parseFloat(weight))
    const totalWeight = weightInGrams

    const actualMeatWeight = (totalWeight * ingredient.meat) / 100
    const actualBoneWeight = (totalWeight * ingredient.bone) / 100
    const actualOrganWeight = (totalWeight * ingredient.organ) / 100

    const updatedIngredient = {
      ...ingredient,
      weight: weightInGrams,
      meatWeight: actualMeatWeight,
      boneWeight: actualBoneWeight,
      organWeight: actualOrganWeight,
      totalWeight,
      unit: selectedUnit,
      isSupplement: isSupplement,
    }

    setUnit(selectedUnit)

    navigation.navigate("HomeTabs", {
      screen: "Home",
      params: { updatedIngredient },
    })
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <WeightInput
          ingredientName={ingredient.name}
          weight={weight}
          selectedUnit={selectedUnit}
          onWeightChange={setWeight}
        />

        <UnitSelector selectedUnit={selectedUnit} onUnitChange={handleUnitChange} />

        <ResultDisplay
          ingredient={ingredient}
          meatWeight={meatWeight}
          boneWeight={boneWeight}
          organWeight={organWeight}
          selectedUnit={selectedUnit}
        />

        <TouchableOpacity style={styles.button} onPress={handleSaveIngredient}>
          <Text style={styles.buttonText}>{editMode ? "Save Ingredient" : "Add Ingredient"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#000080",
    paddingVertical: vs(15),
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
  },
})

export default FoodInfoScreen
