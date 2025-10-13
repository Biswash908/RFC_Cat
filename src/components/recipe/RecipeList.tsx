import type React from "react"
import { ScrollView, StyleSheet, Alert } from "react-native"
import type { Recipe } from "../../types/recipe.types"
import { RecipeItem } from "./RecipeItem"
import { EmptyState } from "./EmptyState"

interface RecipeListProps {
  recipes: Recipe[]
  onRecipePress: (recipe: Recipe) => void
  onRecipeEdit: (recipe: Recipe) => void
  onRecipeDelete: (recipeId: string, recipeName: string) => void
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onRecipePress, onRecipeEdit, onRecipeDelete }) => {
  const handleDelete = (recipeId: string, recipeName: string) => {
    Alert.alert("Delete Recipe", `Are you sure you want to delete ${recipeName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => onRecipeDelete(recipeId, recipeName),
      },
    ])
  }

  if (recipes.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <EmptyState />
      </ScrollView>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipes.map((recipe, index) => (
        <RecipeItem
          key={`${recipe.id}_${index}`}
          recipe={recipe}
          onPress={() => onRecipePress(recipe)}
          onEdit={() => onRecipeEdit(recipe)}
          onDelete={() => handleDelete(recipe.id, recipe.name)}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
})
