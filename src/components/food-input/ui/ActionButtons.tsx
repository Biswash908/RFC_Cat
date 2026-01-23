import type React from "react"
import { View, TouchableOpacity, Text, StyleSheet, Platform, Dimensions, ActivityIndicator } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CopilotStep } from "react-native-copilot"
import { WalkthroughableView } from "../../common/WalkthroughableView"

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
        <CopilotStep
          name="addIngredientsButton"
          order={3}
          text="Tap this button to add an ingredient from the list. You can then choose the quantity for your recipe."
          verticalOffset={Platform.OS === "ios" ? 100 : 80}
        >
          <WalkthroughableView style={styles.walkthroughViewFlex}>
            <TouchableOpacity style={styles.ingredientButton} onPress={onAddIngredient}>
              <Text style={styles.ingredientButtonText}>Add Ingredients</Text>
            </TouchableOpacity>
          </WalkthroughableView>
        </CopilotStep>

        <CopilotStep
          name="saveRecipeButton"
          order={4}
          text="Tap here to save your recipe. You can load it anytime to reuse or modify it later."
          verticalOffset={Platform.OS === "ios" ? 100 : 80}
        >
          <WalkthroughableView style={styles.walkthroughViewFlex}>
            <TouchableOpacity
              style={[styles.saveRecipeButton, isSaving && { backgroundColor: "grey" }]}
              onPress={onSaveRecipe}
              disabled={isSaving}
            >
              {isSaving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save Recipe</Text>}
            </TouchableOpacity>
          </WalkthroughableView>
        </CopilotStep>
      </View>

      <View style={styles.buttonRow}>
        <CopilotStep
          name="ratioCalculateButton"
          order={5}
          text="Use this button to set or calculate the feeding ratio for your recipe. You can select a predefined ratio or create your own custom ratio."
          verticalOffset={Platform.OS === "ios" ? 100 : 80}
        >
          <WalkthroughableView style={styles.walkthroughViewFlex}>
            <TouchableOpacity style={styles.calculateButton} onPress={onCalculate}>
              <Text style={styles.calculateButtonText}>Ratio / Calculate</Text>
            </TouchableOpacity>
          </WalkthroughableView>
        </CopilotStep>

        <CopilotStep
          name="clearButton"
          order={6}
          text="Use this button to clear all ingredients and start a new recipe from scratch."
          verticalOffset={Platform.OS === "ios" ? 100 : 80}
        >
          <WalkthroughableView style={styles.walkthroughViewFlex}>
            <TouchableOpacity style={styles.clearButton} onPress={onClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </WalkthroughableView>
        </CopilotStep>
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
    gap: rs(5),
  },
  walkthroughViewFlex: {
    flex: 1,
  },
  ingredientButton: {
    flex: 1,
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saveRecipeButton: {
    flex: 1,
    backgroundColor: "#000080",
    paddingVertical: vs(isSmallDevice ? 8 : 10),
    paddingHorizontal: rs(10),
    borderRadius: 10,
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
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
})
