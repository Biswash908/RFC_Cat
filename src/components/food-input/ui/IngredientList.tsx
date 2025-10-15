import type React from "react"
import { ScrollView, Text, StyleSheet, Dimensions, Platform } from "react-native"
import type { Ingredient } from "./IngredientItem"
import { IngredientItem } from "./IngredientItem"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(scale, 1.2) : scale))

interface IngredientListProps {
  ingredients: Ingredient[]
  formatWeight: (weight: number, unit: "g" | "kg" | "lbs") => string
  onEdit: (ingredient: Ingredient) => void
  onDelete: (name: string) => void
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredients, formatWeight, onEdit, onDelete }) => {
  if (ingredients.length === 0) {
    return <Text style={styles.noIngredientsText}>No ingredients added yet</Text>
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {ingredients.map((ingredient, index) => (
        <IngredientItem
          key={index}
          ingredient={ingredient}
          formatWeight={formatWeight}
          onEdit={() => onEdit(ingredient)}
          onDelete={() => onDelete(ingredient.name)}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: rs(8),
    paddingBottom: vs(5),
  },
  noIngredientsText: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    color: "gray",
    textAlign: "center",
    marginTop: vs(40),
  },
})
