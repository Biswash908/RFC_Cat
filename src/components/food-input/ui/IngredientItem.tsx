import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(scale, 1.2) : scale))

export type Ingredient = {
  name: string
  meatWeight: number
  boneWeight: number
  organWeight: number
  totalWeight: number
  unit: "g" | "kg" | "lbs"
  isSupplement?: boolean
}

interface IngredientItemProps {
  ingredient: Ingredient
  formatWeight: (weight: number, unit: "g" | "kg" | "lbs") => string
  onEdit: () => void
  onDelete: () => void
}

export const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, formatWeight, onEdit, onDelete }) => {
  const getDisplayedBoneWeight = (ing: Ingredient) => {
    return formatWeight(ing.boneWeight, ing.unit)
  }

  return (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientHeader}>
        <Text style={styles.ingredientText}>
          {ingredient.name}
          {(ingredient.name === "Bone Meal" || ingredient.name === "Powdered Eggshell" || ingredient.isSupplement) && (
            <Text style={styles.supplementLabel}> (Supplement)</Text>
          )}
        </Text>
        <Text style={styles.totalWeightText}>
          Total: {formatWeight(isNaN(ingredient.totalWeight) ? 0 : ingredient.totalWeight, ingredient.unit)}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>
          M: {formatWeight(ingredient.meatWeight, ingredient.unit)} | B: {getDisplayedBoneWeight(ingredient)} | O:{" "}
          {formatWeight(ingredient.organWeight, ingredient.unit)}
        </Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <FontAwesome name="edit" size={rs(24)} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <FontAwesome name="trash" size={rs(24)} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ingredientItem: {
    padding: rs(6),
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: vs(10),
  },
  ingredientHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: vs(2),
  },
  ingredientText: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
    color: "black",
    marginRight: rs(10),
  },
  supplementLabel: {
    fontSize: rs(isSmallDevice ? 12 : 14),
    fontStyle: "italic",
    color: "#000080",
  },
  totalWeightText: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    color: "#404040",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsText: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    color: "#404040",
    flex: 1,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginRight: rs(8),
  },
  deleteButton: {
    marginLeft: rs(4),
  },
})
