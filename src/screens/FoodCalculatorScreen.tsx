"use client"

import React, { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { WeightInput } from "../components/food-calculator/WeightInput"
import { DropdownField } from "../components/food-calculator/DropdownField"
import { BasicResultCard } from "../components/food-calculator/BasicResultCard"
import { calculateBasicFeeding, type BasicFeedingResult } from "../utils/feeding-calculator"

const FoodCalculatorScreen: React.FC = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [weight, setWeight] = useState("")
  const [ageGroup, setAgeGroup] = useState("adult")
  const [unit, setUnit] = useState("kg")
  const [basicResult, setBasicResult] = useState<BasicFeedingResult | null>(null)

  React.useEffect(() => {
    navigation.setOptions({ title: "Daily Portions" })
  }, [navigation])

  const handleCalculate = () => {
    if (!weight || Number.parseFloat(weight) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid cat weight")
      return
    }

    let weightInKg = Number.parseFloat(weight)
    if (unit === "lbs") {
      weightInKg = weightInKg / 2.20462
    }

    if (ageGroup === "kitten") {
      Alert.alert(
        "Kitten Feeding",
        "Feed as much as the kitten wants. Kittens self-regulate their food intake and should have access to food throughout the day.",
      )
      return
    }

    const basicCalcResult = calculateBasicFeeding(weightInKg, ageGroup as "kitten" | "adult" | "senior")
    setBasicResult(basicCalcResult)
  }

  const handleClear = () => {
    setWeight("")
    setAgeGroup("adult")
    setUnit("kg")
    setBasicResult(null)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["left"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={[styles.scrollContainer, { }]}>
        <View style={styles.container}>
          <View style={styles.inputCard}>
            <DropdownField
              label="Age Group"
              value={ageGroup}
              options={[
                { label: "Kitten (below 1 year)", value: "kitten" },
                { label: "Adult (1 year and above)", value: "adult" },
                { label: "Senior (7 years and above)", value: "senior" },
              ]}
              onSelect={setAgeGroup}
            />

            <WeightInput
              value={weight}
              onChangeText={setWeight}
              label="Weight"
              placeholder="Enter cat weight"
              unit={unit}
              onUnitChange={setUnit}
            />
          </View>

                    <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleCalculate}>
              <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {basicResult && <BasicResultCard result={basicResult} />}


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContainer: {},
  container: {
    padding: 16,
  },
  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#000080",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#000080",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default FoodCalculatorScreen
