"use client"

import React, { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { WeightInput } from "../components/food-calculator/WeightInput"
import { DropdownField } from "../components/food-calculator/DropdownField"
import { ResultCard } from "../components/food-calculator/ResultCard"
import { BasicResultCard } from "../components/food-calculator/BasicResultCard"
import {
  calculateFeeding,
  type FeedingCalculationParams,
  type FeedingResult,
  calculateBasicFeeding,
  type BasicFeedingResult,
} from "../utils/feeding-calculator"

const FoodCalculatorScreen: React.FC = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [isBasicMode, setIsBasicMode] = useState(true)
  const [weight, setWeight] = useState("")
  const [ageGroup, setAgeGroup] = useState("adult")
  const [unit, setUnit] = useState("kg")
  const [sex, setSex] = useState("male")
  const [reproductiveState, setReproductiveState] = useState("neutered")
  const [activityLevel, setActivityLevel] = useState("normal")
  const [feedingGoal, setFeedingGoal] = useState("maintain")
  const [currentFeed, setCurrentFeed] = useState("")
  const [result, setResult] = useState<FeedingResult | null>(null)
  const [basicResult, setBasicResult] = useState<BasicFeedingResult | null>(null)

  React.useEffect(() => {
    navigation.setOptions({ title: "Feeding Calculator" })
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

    if (isBasicMode && ageGroup === "kitten") {
      Alert.alert(
        "Kitten Feeding",
        "Feed as much as the kitten wants. Kittens self-regulate their food intake and should have access to food throughout the day.",
      )
      return
    }

    if (isBasicMode) {
      const basicCalcResult = calculateBasicFeeding(weightInKg, ageGroup as "kitten" | "adult" | "senior")
      setBasicResult(basicCalcResult)
      setResult(null)
      return
    }

    if (feedingGoal === "lose" && (!currentFeed || Number.parseFloat(currentFeed) <= 0)) {
      Alert.alert("Invalid Input", "Please enter current daily feed amount for weight loss calculation")
      return
    }

    const params: FeedingCalculationParams = {
      weight: weightInKg,
      ageGroup: ageGroup as "kitten" | "adult" | "senior",
      sex: sex as "male" | "female",
      reproductiveState: reproductiveState as "intact" | "neutered",
      activityLevel: activityLevel as "low" | "normal" | "high",
      feedingGoal: feedingGoal as "maintain" | "lose" | "gain",
      currentFeed: currentFeed ? Number.parseFloat(currentFeed) : undefined,
    }

    const calculatedResult = calculateFeeding(params)
    setResult(calculatedResult)
    setBasicResult(null)
  }

  const handleClear = () => {
    setWeight("")
    setAgeGroup("adult")
    setUnit("kg")
    setSex("male")
    setReproductiveState("neutered")
    setActivityLevel("normal")
    setFeedingGoal("maintain")
    setCurrentFeed("")
    setResult(null)
    setBasicResult(null)
  }

  const handleSavePlan = () => {
    if (!result) return
    Alert.alert("Save Plan", "This feature will save the plan to your recipes. Coming soon!")
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 20 + insets.bottom }]}>
        <View style={styles.container}>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, isBasicMode && styles.modeButtonActive]}
              onPress={() => setIsBasicMode(true)}
            >
              <Text style={[styles.modeButtonText, isBasicMode && styles.modeButtonTextActive]}>Basic</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, !isBasicMode && styles.modeButtonActive]}
              onPress={() => setIsBasicMode(false)}
            >
              <Text style={[styles.modeButtonText, !isBasicMode && styles.modeButtonTextActive]}>Advanced</Text>
            </TouchableOpacity>
          </View>

          {/* Input Section */}
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

            {!isBasicMode && (
              <>
                <DropdownField
                  label="Sex"
                  value={sex}
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  onSelect={setSex}
                />

                <DropdownField
                  label="Reproductive State"
                  value={reproductiveState}
                  options={[
                    { label: "Intact", value: "intact" },
                    { label: "Neutered/Spayed", value: "neutered" },
                  ]}
                  onSelect={setReproductiveState}
                />

                <DropdownField
                  label="Activity Level"
                  value={activityLevel}
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Normal", value: "normal" },
                    { label: "High", value: "high" },
                  ]}
                  onSelect={setActivityLevel}
                />

                <DropdownField
                  label="Feeding Goal"
                  value={feedingGoal}
                  options={[
                    { label: "Maintain", value: "maintain" },
                    { label: "Lose Weight", value: "lose" },
                    { label: "Gain Weight", value: "gain" },
                  ]}
                  onSelect={setFeedingGoal}
                />

                {feedingGoal === "lose" && (
                  <WeightInput
                    value={currentFeed}
                    onChangeText={setCurrentFeed}
                    placeholder="Current Feed (g/day)"
                    label="Current Daily Feed"
                  />
                )}
              </>
            )}
          </View>

          {/* Result Section */}
          {basicResult && <BasicResultCard result={basicResult} />}
          {result && <ResultCard result={result} />}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleCalculate}>
              <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>

            {result && (
              <TouchableOpacity style={styles.secondaryButton} onPress={handleSavePlan}>
                <Text style={styles.buttonText}>Save Plan</Text>
              </TouchableOpacity>
            )}

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
  modeToggle: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modeButtonActive: {
    backgroundColor: "#000080",
    borderColor: "#000080",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  modeButtonTextActive: {
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
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#000080",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#000080",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  clearButton: {
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
