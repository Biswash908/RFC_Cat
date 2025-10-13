import type React from "react"
import { FlatList, Text, StyleSheet, View } from "react-native"
import type { Ingredient } from "../../../types/food-input.types"
import { IngredientItem } from "./IngredientItem"

interface IngredientListProps {
  ingredients: Ingredient[]
  unit: string
  onEdit: (item: Ingredient) => void
  onDelete: (id: string) => void
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredients, unit, onEdit, onDelete }) => {
  if (ingredients.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No ingredients added yet</Text>
        <Text style={styles.emptySubtext}>Tap "Add Ingredient" to get started</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={ingredients}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <IngredientItem item={item} unit={unit} onEdit={onEdit} onDelete={onDelete} />}
      contentContainerStyle={styles.listContainer}
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
  },
})
