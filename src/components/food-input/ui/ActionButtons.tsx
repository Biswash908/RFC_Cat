import type React from "react"
import { View, TouchableOpacity, Text, StyleSheet, Platform, Dimensions, ActivityIndicator } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const scale = SCREEN_WIDTH / 375
const verticalScale = SCREEN_HEIGHT / 812
const rs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(verticalScale, 1.2) : verticalScale))

interface ActionButtonsProps {
  onAddIngredient: () => void
  onSaveRecipe: () => void
  onCalculate: () => void
  onClear: () => void
  isSaving: boolean
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddIngredient,
  onSaveRecipe,
  onCalculate,
  onClear,
  isSaving,
}) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.calculateButtonContainer,
        {
          bottom: Platform.OS === "ios" ? -insets.bottom : 0,
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 4 : 4,
        },
      ]}
    >
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.ingredientButton} onPress={onAddIngredient}>
          <Text style={styles.ingredientButtonText}>Add Ingredients</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveRecipeButton, isSaving && { backgroundColor: "grey" }]}
          onPress={onSaveRecipe}
          disabled={isSaving}
        >
          {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save Recipe</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.calculateButton} onPress={onCalculate}>
          <Text style={styles.calculateButtonText}>Ratio / Calculate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  calculateButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingTop: 8,
    borderTopWidth: 0.7,
    borderTopColor: "#ded8d7",
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  ingredientButton: {
    flex: 1,
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    marginRight: rs(5),
    alignItems: "center",
    justifyContent: "center",
  },
  saveRecipeButton: {
    flex: 1,
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    marginLeft: rs(5),
    alignItems: "center",
    justifyContent: "center",
  },
  ingredientButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
  calculateButton: {
    flex: 1,
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    marginRight: rs(5),
    alignItems: "center",
    justifyContent: "center",
  },
  calculateButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    marginLeft: rs(5),
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
})
