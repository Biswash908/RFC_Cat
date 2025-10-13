import type React from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"

interface ActionButtonsProps {
  onAddIngredient: () => void
  onSaveRecipe: () => void
  onCalculate: () => void
  onClear: () => void
  hasIngredients: boolean
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddIngredient,
  onSaveRecipe,
  onCalculate,
  onClear,
  hasIngredients,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.addButton} onPress={onAddIngredient}>
        <Text style={styles.buttonText}>Add Ingredient</Text>
      </TouchableOpacity>

      {hasIngredients && (
        <>
          <TouchableOpacity style={styles.saveButton} onPress={onSaveRecipe}>
            <Text style={styles.buttonText}>Save Recipe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.calculateButton} onPress={onCalculate}>
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 15,
    gap: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  calculateButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
})
