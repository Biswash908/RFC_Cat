import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import type { Recipe } from "../../types/recipe.types"
import { formatRatioDisplay } from "../../utils/recipe-utils"

interface RecipeItemProps {
  recipe: Recipe
  onPress: () => void
  onEdit: () => void
  onDelete: () => void
}

export const RecipeItem: React.FC<RecipeItemProps> = ({ recipe, onPress, onEdit, onDelete }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{recipe.name}</Text>
        <Text style={styles.ratio}>{formatRatioDisplay(recipe)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <FontAwesome name="edit" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <FontAwesome name="trash" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  ratio: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginRight: 15,
  },
  deleteButton: {},
})
