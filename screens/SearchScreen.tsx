"use client"

import { useState } from "react"
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [ingredients, setIngredients] = useState([
    { id: "1", name: "Beef Heart", meat: 100, bone: 0, organ: 0 },
    { id: "2", name: "Beef Kidney", meat: 0, bone: 0, organ: 100 },
    { id: "3", name: "Beef Liver", meat: 0, bone: 0, organ: 100 },
    { id: "4", name: "Beef Ribs", meat: 48, bone: 52, organ: 0 },
    { id: "5", name: "Beef Steak", meat: 100, bone: 0, organ: 0 },
    { id: "6", name: "Beef Trachea", meat: 100, bone: 0, organ: 0 },
    { id: "7", name: "Bone 100%", meat: 0, bone: 100, organ: 0 },
    { id: "8", name: "Bone Meal", meat: 0, bone: 416.667, organ: 0, isSupplement: true },
    { id: "9", name: "Chicken Back", meat: 50, bone: 50, organ: 0 },
    { id: "10", name: "Chicken Breast boneless", meat: 100, bone: 0, organ: 0 },
    { id: "11", name: "Chicken Breast portion", meat: 80, bone: 20, organ: 0 },
    { id: "12", name: "Chicken Drumstick", meat: 66, bone: 33, organ: 0 },
    { id: "13", name: "Chicken Feet", meat: 40, bone: 60, organ: 0 },
    { id: "14", name: "Chicken Frame", meat: 56, bone: 44, organ: 0 },
    { id: "15", name: "Chicken Gizzard", meat: 100, bone: 0, organ: 0 },
    { id: "16", name: "Chicken Heart", meat: 100, bone: 0, organ: 0 },
    { id: "17", name: "Chicken Kidney", meat: 0, bone: 0, organ: 100 },
    { id: "18", name: "Chicken Leg quarter", meat: 73, bone: 27, organ: 0 },
    { id: "19", name: "Chicken Liver", meat: 0, bone: 0, organ: 100 },
    { id: "20", name: "Chicken Neck skinless", meat: 25, bone: 75, organ: 0 },
    { id: "21", name: "Chicken Neck with skin", meat: 64, bone: 36, organ: 0 },
    { id: "22", name: "Chicken Stripped 100% bone", meat: 0, bone: 100, organ: 0 },
    { id: "23", name: "Chicken Thigh Boneless", meat: 100, bone: 0, organ: 0 },
    { id: "24", name: "Chicken Thigh Bone In", meat: 79, bone: 21, organ: 0 },
    { id: "25", name: "Chicken Whole DeBone Leg and Wings", meat: 78, bone: 22, organ: 0 },
    { id: "26", name: "Chicken Whole oven ready", meat: 70, bone: 30, organ: 0 },
    { id: "27", name: "Chicken Wing", meat: 54, bone: 46, organ: 0 },
    { id: "28", name: "Cornish Game Hen Whole", meat: 61, bone: 39, organ: 0 },
    { id: "29", name: "Duck Feet", meat: 40, bone: 60, organ: 0 },
    { id: "30", name: "Duck Frame", meat: 25, bone: 75, organ: 0 },
    { id: "31", name: "Duck Head", meat: 25, bone: 75, organ: 0 },
    { id: "32", name: "Duck Liver", meat: 0, bone: 0, organ: 100 },
    { id: "33", name: "Duck Neck", meat: 50, bone: 50, organ: 0 },
    { id: "34", name: "Duck Whole Domestic Oven ready Duck", meat: 72, bone: 28, organ: 0 },
    { id: "35", name: "Duck wild, Breast portion", meat: 85, bone: 15, organ: 0 },
    { id: "36", name: "Duck Wings", meat: 54, bone: 46, organ: 0 },
    { id: "37", name: "Fish Whole", meat: 80, bone: 10, organ: 10 },
    { id: "38", name: "Lamb Arm", meat: 91, bone: 9, organ: 0 },
    { id: "39", name: "Lamb Blade", meat: 72, bone: 28, organ: 0 },
    { id: "40", name: "Lamb Centre Slice Leg", meat: 94, bone: 6, organ: 0 },
    { id: "41", name: "Lamb Heart", meat: 100, bone: 0, organ: 0 },
    { id: "42", name: "Lamb Kidney", meat: 0, bone: 0, organ: 100 },
    { id: "43", name: "Lamb Liver", meat: 0, bone: 0, organ: 100 },
    { id: "44", name: "Lamb Loin", meat: 72, bone: 28, organ: 0 },
    { id: "45", name: "Lamb Ribs", meat: 74, bone: 26, organ: 0 },
    { id: "46", name: "Lamb Whole Shank", meat: 86, bone: 14, organ: 0 },
    { id: "47", name: "Lamb Half Shank", meat: 83, bone: 17, organ: 0 },
    { id: "48", name: "Beef Mince, boneless", meat: 100, bone: 0, organ: 0 },
    { id: "49", name: "Chicken Mince, boneless", meat: 100, bone: 0, organ: 0 },
    { id: "50", name: "Lamb Mince, boneless", meat: 100, bone: 0, organ: 0 },
    { id: "51", name: "Pork Mince, boneless", meat: 100, bone: 0, organ: 0 },
    { id: "52", name: "Rabbit Mince, boneless", meat: 100, bone: 0, organ: 0 },
    { id: "53", name: "Turkey Mince, boneless", meat: 100, bone: 0, organ: 0 },
    { id: "54", name: "Pork Feet", meat: 70, bone: 30, organ: 0 },
    { id: "55", name: "Pork Heart", meat: 100, bone: 0, organ: 0 },
    { id: "56", name: "Pork Kidney", meat: 0, bone: 0, organ: 100 },
    { id: "57", name: "Pork Liver", meat: 0, bone: 0, organ: 100 },
    { id: "58", name: "Pork Loin steak", meat: 100, bone: 0, organ: 0 },
    { id: "59", name: "Pork Ribs", meat: 70, bone: 30, organ: 0 },
    { id: "60", name: "Pork Tails", meat: 70, bone: 30, organ: 0 },
    { id: "61", name: "Powdered Eggshell", meat: 0, bone: 2500, organ: 0, isSupplement: true },
    { id: "62", name: "Quail Liver", meat: 0, bone: 0, organ: 100 },
    { id: "63", name: "Quail Whole Oven Ready", meat: 73, bone: 27, organ: 0 },
    { id: "64", name: "Rabbit Kidney", meat: 0, bone: 0, organ: 100 },
    { id: "65", name: "Rabbit Liver", meat: 0, bone: 0, organ: 100 },
    { id: "66", name: "Rabbit Whole Rabbit (Dressed)", meat: 70, bone: 30, organ: 0 },
    { id: "67", name: "Turkey Back", meat: 59, bone: 41, organ: 0 },
    { id: "68", name: "Turkey Breast", meat: 90, bone: 10, organ: 0 },
    { id: "69", name: "Turkey Drumstick", meat: 79, bone: 21, organ: 0 },
    { id: "70", name: "Turkey Kidney", meat: 0, bone: 0, organ: 100 },
    { id: "71", name: "Turkey Leg", meat: 83, bone: 17, organ: 0 },
    { id: "72", name: "Turkey Liver", meat: 0, bone: 0, organ: 100 },
    { id: "73", name: "Turkey Neck", meat: 60, bone: 40, organ: 0 },
    { id: "74", name: "Turkey Tail", meat: 76, bone: 24, organ: 0 },
    { id: "75", name: "Turkey Thigh", meat: 81, bone: 19, organ: 0 },
    { id: "76", name: "Turkey Wing", meat: 66, bone: 34, organ: 0 },
  ])

  const navigation = useNavigation()

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePressIngredient = (ingredient: {
    id: string
    name: string
    meat: number
    bone: number
    organ: number
    isSupplement?: boolean
  }) => {
    navigation.navigate("FoodInfoScreen", { ingredient, editMode: false })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust the offset for iOS
    >
      <FlatList
        data={filteredIngredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressIngredient(item)}>
            <View style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>
                {item.name}
                {item.isSupplement && <Text style={styles.supplementLabel}> </Text>}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No ingredients found</Text>}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />

      <View style={[styles.searchBarContainer, Platform.OS === "android" && { marginBottom: 10 }]}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search ingredients..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  listContent: {
    paddingBottom: 100, // Ensures enough padding at the bottom to accommodate the keyboard
  },
  ingredientItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  ingredientText: {
    fontSize: 16,
  },
  supplementLabel: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#000080",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
  searchBarContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  searchBar: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  searchIcon: {
    marginLeft: 10,
  },
})

export default SearchScreen

