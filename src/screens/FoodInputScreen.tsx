"use client"

import { useEffect } from "react"
import { View, StyleSheet, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useUnit } from "../context/UnitContext"
import { useRecipe } from "../context/RecipeContext"
import { useIngredients } from "../hooks/useIngredients"
import { useRecipeManagement } from "../hooks/useRecipeManagement"
import { TopBar } from "../components/food-input/ui/TopBar"
import { IngredientList } from "../components/food-input/ui/IngredientList"
import { TotalBar } from "../components/food-input/ui/TotalBar"
import { ActionButtons } from "../components/food-input/ui/ActionButtons"
import { SaveRecipeModal } from "../components/food-input/modals/SaveRecipeModal"

export default function FoodInputScreen() {
  const navigation = useNavigation()
  const { unit } = useUnit()
  const { selectedRecipe, setSelectedRecipe } = useRecipe()

  const {
    ingredients,
    totals,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    clearIngredients,
    loadRecipeIngredients,
  } = useIngredients()

  const { recipeName, setRecipeName, saveModalVisible, openSaveModal, closeSaveModal, saveRecipe } =
    useRecipeManagement()

  // Load selected recipe
  useEffect(() => {
    if (selectedRecipe) {
      setRecipeName(selectedRecipe.name)
      loadRecipeIngredients(selectedRecipe.ingredients)
      setSelectedRecipe(null)
    }
  }, [selectedRecipe])

  const handleAddIngredient = () => {
    navigation.navigate("Search" as never)
  }

  const handleEditIngredient = (ingredient: any) => {
    navigation.navigate("FoodInfo" as never, { ingredient } as never)
  }

  const handleLoadRecipe = () => {
    navigation.navigate("Recipe" as never)
  }

  const handleCalculate = () => {
    navigation.navigate(
      "Calculator" as never,
      {
        totalMeat: totals.meat,
        totalBone: totals.bone,
        totalOrgan: totals.organ,
        totalWeight: totals.weight,
      } as never,
    )
  }

  const handleSaveRecipe = async (name: string) => {
    await saveRecipe(name, {
      ingredients,
      totalMeat: totals.meat,
      totalBone: totals.bone,
      totalOrgan: totals.organ,
      totalWeight: totals.weight,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar recipeName={recipeName} onLoadRecipe={handleLoadRecipe} />

      <View style={styles.content}>
        <IngredientList
          ingredients={ingredients}
          unit={unit}
          onEdit={handleEditIngredient}
          onDelete={deleteIngredient}
        />

        {ingredients.length > 0 && (
          <TotalBar
            totalMeat={totals.meat}
            totalBone={totals.bone}
            totalOrgan={totals.organ}
            totalWeight={totals.weight}
            unit={unit}
          />
        )}
      </View>

      <ActionButtons
        onAddIngredient={handleAddIngredient}
        onSaveRecipe={openSaveModal}
        onCalculate={handleCalculate}
        onClear={clearIngredients}
        hasIngredients={ingredients.length > 0}
      />

      <SaveRecipeModal
        visible={saveModalVisible}
        onClose={closeSaveModal}
        onSave={handleSaveRecipe}
        currentName={recipeName}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
})
