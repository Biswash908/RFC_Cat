import type React from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"
import { rs, isSmallDevice } from "../../constants/responsive"

interface WeightInputProps {
  ingredientName: string
  weight: string
  selectedUnit: "g" | "kg" | "lbs"
  onWeightChange: (weight: string) => void
}

export const WeightInput: React.FC<WeightInputProps> = ({ ingredientName, weight, selectedUnit, onWeightChange }) => {
  return (
    <View>
      <Text style={styles.title}>{ingredientName}</Text>
      <View style={styles.underline} />
      <TextInput
        style={styles.input}
        placeholder={`Enter ingredient weight in ${selectedUnit}`}
        keyboardType="numeric"
        value={weight}
        onChangeText={onWeightChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
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
})
