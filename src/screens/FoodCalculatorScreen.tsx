"use client"

import React, { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { WeightInput } from "../components/food-calculator/WeightInput"
import { DropdownField } from "../components/food-calculator/DropdownField"
import { BasicResultCard } from "../components/food-calculator/BasicResultCard"
import { AdvancedResultCard } from "../components/food-calculator/AdvancedResultCard"
import {
  calculateBasicFeeding,
  calculateAdvancedFeeding,
  type BasicFeedingResult,
  type AdvancedFeedingResult,
} from "../utils/feeding-calculator"

const FoodCalculatorScreen: React.FC = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [weight, setWeight] = useState("")
  const [ageGroup, setAgeGroup] = useState("adult")
  const [unit, setUnit] = useState("kg")
  const [basicResult, setBasicResult] = useState<BasicFeedingResult | null>(null)
  const [calculatorMode, setCalculatorMode] = useState<"basic" | "advanced">("basic")
  const [advancedResult, setAdvancedResult] = useState<AdvancedFeedingResult | null>(null)
  const [reproductiveStatus, setReproductiveStatus] = useState("intact")
  const [activityLevel, setActivityLevel] = useState("normal")
  const [weightGoal, setWeightGoal] = useState("maintain")

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

    if (ageGroup === "mother") {
      Alert.alert(
        "Mother Cat Feeding",
        "Feed as much as the mother cat wants. Pregnant and lactating mothers have increased nutritional needs and should have unlimited access to food.",
      )
      return
    }

    if (calculatorMode === "basic") {
      const basicCalcResult = calculateBasicFeeding(weightInKg, ageGroup as "kitten" | "adult" | "senior" | "mother")
      setBasicResult(basicCalcResult)
      setAdvancedResult(null)
    } else {
      const advancedCalcResult = calculateAdvancedFeeding(
        weightInKg,
        ageGroup as "kitten" | "adult" | "senior",
        reproductiveStatus as "intact" | "neutered" | "pregnant" | "nursing",
        activityLevel as "low" | "normal" | "active" | "very_active",
        weightGoal as "maintain" | "gain" | "lose",
      )
      setAdvancedResult(advancedCalcResult)
      setBasicResult(null)
    }
  }

  const handleClear = () => {
    setWeight("")
    setAgeGroup("adult")
    setUnit("kg")
    setBasicResult(null)
    setAdvancedResult(null)
    setReproductiveStatus("intact")
    setActivityLevel("normal")
    setWeightGoal("maintain")
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 60 + insets.bottom + 20 }]}>
        <View style={styles.container}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, calculatorMode === "basic" && styles.toggleButtonActive]}
              onPress={() => {
                setCalculatorMode("basic")
                setBasicResult(null)
                setAdvancedResult(null)
              }}
            >
              <Text style={[styles.toggleButtonText, calculatorMode === "basic" && styles.toggleButtonTextActive]}>
                Basic
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, calculatorMode === "advanced" && styles.toggleButtonActive]}
              onPress={() => {
                setCalculatorMode("advanced")
                setBasicResult(null)
                setAdvancedResult(null)
              }}
            >
              <Text style={[styles.toggleButtonText, calculatorMode === "advanced" && styles.toggleButtonTextActive]}>
                Advanced
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputCard}>
            <DropdownField
              label="Age Group"
              value={ageGroup}
              options={[
                { label: "Kitten (below 1 year)", value: "kitten" },
                { label: "Pregnant/Lactating Mother", value: "mother" },
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

            {calculatorMode === "advanced" && ageGroup !== "kitten" && ageGroup !== "mother" && (
              <>
                <DropdownField
                  label="Reproductive Status"
                  value={reproductiveStatus}
                  options={[
                    { label: "Intact", value: "intact" },
                    { label: "Neutered / Spayed", value: "neutered" },
                  ]}
                  onSelect={setReproductiveStatus}
                />

                <DropdownField
                  label="Activity Level"
                  value={activityLevel}
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Normal", value: "normal" },
                    { label: "Active", value: "active" },
                    { label: "Very Active", value: "very_active" },
                  ]}
                  onSelect={setActivityLevel}
                />

                <DropdownField
                  label="Weight Goal"
                  value={weightGoal}
                  options={[
                    { label: "Maintain Weight", value: "maintain" },
                    { label: "Gain Weight", value: "gain" },
                    { label: "Lose Weight", value: "lose" },
                  ]}
                  onSelect={setWeightGoal}
                />
              </>
            )}
          </View>

          {basicResult && <BasicResultCard result={basicResult} />}
          {advancedResult && <AdvancedResultCard result={advancedResult} />}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleCalculate}>
              <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
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
  toggleContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#000080",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  toggleButtonActive: {
    backgroundColor: "#000080",
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000080",
  },
  toggleButtonTextActive: {
    color: "#fff",
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
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
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
