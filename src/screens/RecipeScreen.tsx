import React, { useState } from "react"
import { KeyboardAvoidingView, Platform, Alert, StyleSheet } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useRecipeList } from "../hooks/useRecipeList"
import { RecipeList } from "../components/recipe/RecipeList"
import { EditRecipeModal } from "../components/recipe/EditRecipeModal"
import type { Recipe } from "../types/recipe.types"
import { checkUnsavedChanges, prepareRecipeForLoading } from "../utils/recipe-utils"

const RecipeScreen = ({ route }: any) => {
  const navigation = useNavigation()
  const { recipes, loadRecipes, updateRecipeName, deleteRecipe } = useRecipeList(route?.params)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null)

  // Load recipes when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadRecipes()
    }, []),
  )

  // Handle recipe press - load into FoodInputScreen
  const handleRecipePress = async (recipe: Recipe) => {
    const hasUnsaved = await checkUnsavedChanges()

    if (hasUnsaved) {
      Alert.alert("Unsaved Changes", "Are you sure you want to load? You have unsaved changes.", [
        {
          text: "Load",
          onPress: () => loadRecipe(recipe),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ])
    } else {
      loadRecipe(recipe)
    }
  }

  // Load recipe into FoodInputScreen
  const loadRecipe = (recipe: Recipe) => {
    Alert.alert("Load Recipe", `Do you want to load the recipe "${recipe.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const selectedRecipeData = await prepareRecipeForLoading(recipe)

            navigation.navigate(
              "HomeTabs" as never,
              {
                screen: "Home",
                params: {
                  recipeName: selectedRecipeData.recipeName,
                  recipeId: selectedRecipeData.recipeId,
                  ingredients: selectedRecipeData.ingredients,
                  ratio: selectedRecipeData.ratio,
                  isUserDefined: selectedRecipeData.isUserDefined,
                },
              } as never,
            )
          } catch (error) {
            console.error("Error loading recipe into FoodInputScreen", error)
          }
        },
      },
    ])
  }

  // Handle edit button press
  const handleEditPress = (recipe: Recipe) => {
    setRecipeToEdit(recipe)
    setIsModalVisible(true)
  }

  // Handle save edited recipe
  const handleSaveEdit = (recipeId: string, newName: string) => {
    updateRecipeName(recipeId, newName)
    setIsModalVisible(false)
    setRecipeToEdit(null)
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsModalVisible(false)
    setRecipeToEdit(null)
  }

  // Handle delete recipe
  const handleDeleteRecipe = (recipeId: string, recipeName: string) => {
    deleteRecipe(recipeId)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <RecipeList
        recipes={recipes}
        onRecipePress={handleRecipePress}
        onRecipeEdit={handleEditPress}
        onRecipeDelete={handleDeleteRecipe}
      />
      <EditRecipeModal
        visible={isModalVisible}
        recipe={recipeToEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
})

export default RecipeScreen
