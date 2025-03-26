"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native"
import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
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
    }
    editMode: boolean
  }
  FoodInputScreen: {
    updatedIngredient: {
      id: string
      name: string
      meat: number
      bone: number
      organ: number
      weight: number
      meatWeight: number
      boneWeight: number
      organWeight: number
      totalWeight: number
      unit: "g" | "kg" | "lbs"
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

  const initialWeight = editMode ? ingredient.totalWeight?.toString() : ""
  const [weight, setWeight] = useState(initialWeight)
  const [selectedUnit, setSelectedUnit] = useState<"g" | "kg" | "lbs">(ingredient.unit || "g")
  const [meatWeight, setMeatWeight] = useState(0)
  const [boneWeight, setBoneWeight] = useState(0)
  const [organWeight, setOrganWeight] = useState(0)

  useEffect(() => {
    if (weight && !isNaN(Number.parseFloat(weight))) {
      // Calculate weights if weight is a valid number
      const weightInGrams = convertWeight(Number.parseFloat(weight))
      calculateWeights(weightInGrams)
    } else {
      // Reset weights to zero if weight is empty or invalid
      setMeatWeight(0)
      setBoneWeight(0)
      setOrganWeight(0)
    }
  }, [weight, selectedUnit])

  const calculateWeights = (totalWeight: number) => {
    setMeatWeight((totalWeight * ingredient.meat) / 100)
    setBoneWeight((totalWeight * ingredient.bone) / 100)
    setOrganWeight((totalWeight * ingredient.organ) / 100)
  }

  const convertWeight = (weight: number): number => {
    // If weight is NaN, return 0
    if (isNaN(weight)) return 0

    switch (selectedUnit) {
      case "kg":
        return weight
      case "lbs":
        return weight
      default:
        return weight
    }
  }

  const handleSaveIngredient = () => {
    const weightInGrams = convertWeight(Number.parseFloat(weight))
    const totalWeight = weightInGrams

    const updatedIngredient = {
      ...ingredient,
      weight: weightInGrams,
      meatWeight,
      boneWeight,
      organWeight,
      totalWeight,
      unit: selectedUnit,
    }

    setUnit(selectedUnit)

    navigation.navigate("HomeTabs", {
      screen: "Home",
      params: { updatedIngredient },
    })
  }

  // Updated formatWeight function to remove .00 for grams and make unit stick to number
  const formatWeight = (value: number, unit: "g" | "kg" | "lbs") => {
    // Handle NaN values
    if (isNaN(value)) value = 0

    // Format the number based on unit
    let formattedNumber
    if (unit === "g") {
      // For grams, show whole numbers if possible
      formattedNumber = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)
    } else {
      // For kg and lbs, always show 2 decimal places
      formattedNumber = value.toFixed(2)
    }

    // Return with no space between number and unit
    return formattedNumber + unit
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{ingredient.name}</Text>
        <View style={styles.underline} />

        <TextInput
          style={styles.input}
          placeholder={`Enter ingredient weight in ${selectedUnit}`}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <View style={styles.buttonContainer}>
          {["g", "kg", "lbs"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.unitButton, selectedUnit === item ? styles.activeUnitButton : styles.inactiveUnitButton]}
              onPress={() => {
                setSelectedUnit(item as "g" | "kg" | "lbs")
                // Only try to convert if weight is a valid number
                if (weight && !isNaN(Number.parseFloat(weight))) {
                  setWeight(convertWeight(Number.parseFloat(weight)).toString())
                }
                // If weight is empty or invalid, keep it as is
              }}
            >
              <Text style={styles.unitButtonText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Meat: {ingredient.meat}% - {formatWeight(meatWeight, selectedUnit)}
          </Text>
          <Text style={styles.resultText}>
            Bone: {ingredient.bone}% - {formatWeight(boneWeight, selectedUnit)}
          </Text>
          <Text style={styles.resultText}>
            Organ: {ingredient.organ}% - {formatWeight(organWeight, selectedUnit)}
          </Text>
        </View>
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
  title: {
    fontSize: rs(isSmallDevice ? 20 : 24),
    fontWeight: "bold",
    textAlign: "center",
  },
  underline: {
    height: 2,
    backgroundColor: "black",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
    fontSize: rs(isSmallDevice ? 14 : 16),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  unitButton: {
    paddingVertical: vs(10),
    paddingHorizontal: rs(25),
    borderRadius: 5,
  },
  activeUnitButton: {
    backgroundColor: "#000080",
  },
  inactiveUnitButton: {
    backgroundColor: "#ccc",
  },
  unitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: rs(isSmallDevice ? 14 : 16),
  },
  resultContainer: {
    marginTop: 15,
  },
  resultText: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    marginVertical: 5,
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