import { FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useIngredientSearch } from "../hooks/useIngredientSearch"
import { SearchBar } from "../components/search/SearchBar"
import { IngredientListItem } from "../components/search/IngredientListItem"
import type { IngredientData } from "../constants/ingredients-data"

const SearchScreen = () => {
  const navigation = useNavigation()
  const { searchQuery, setSearchQuery, filteredIngredients } = useIngredientSearch()

  const handlePressIngredient = (ingredient: IngredientData) => {
    navigation.navigate("FoodInfoScreen", { ingredient, editMode: false })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <FlatList
        data={filteredIngredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IngredientListItem ingredient={item} onPress={handlePressIngredient} />}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No ingredients found</Text>}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
})

export default SearchScreen
