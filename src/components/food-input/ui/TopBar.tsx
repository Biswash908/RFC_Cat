import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface TopBarProps {
  recipeName: string
  onLoadRecipe: () => void
}

export const TopBar: React.FC<TopBarProps> = ({ recipeName, onLoadRecipe }) => {
  return (
    <View style={styles.topBar}>
      <Text style={styles.recipeNameText}>{recipeName}</Text>
      <TouchableOpacity style={styles.loadButton} onPress={onLoadRecipe}>
        <Text style={styles.loadButtonText}>Load Recipe</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  recipeNameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  loadButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
})
