import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import type { IngredientData } from "../../constants/ingredients-data"

interface IngredientListItemProps {
  ingredient: IngredientData
  onPress: (ingredient: IngredientData) => void
}

export const IngredientListItem: React.FC<IngredientListItemProps> = ({ ingredient, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(ingredient)}>
      <View style={styles.container}>
        <Text style={styles.text}>
          {ingredient.name}
          {ingredient.isSupplement && <Text style={styles.supplementLabel}> </Text>}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  text: {
    fontSize: 16,
  },
  supplementLabel: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#000080",
  },
})
