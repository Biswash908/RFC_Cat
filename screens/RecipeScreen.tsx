import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import 'react-native-get-random-values';
import { FontAwesome } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

const RecipeScreen = ({ route }) => {
  const navigation = useNavigation();
  const defaultRecipes = [
    {
      id: "default1",
      name: "Beef Mix",
      ingredients: [
        {
          id: "5",
          name: "Beef Steak",
          totalWeight: 500,
          meatWeight: 500,
          boneWeight: 0,
          organWeight: 0,
          meat: 100,
          bone: 0,
          organ: 0,
          unit: "g",
        },
        {
          id: "2",
          name: "Beef Kidney",
          totalWeight: 200,
          meatWeight: 0,
          boneWeight: 0,
          organWeight: 200,
          meat: 0,
          bone: 0,
          organ: 100,
          unit: "g",
        },
        {
          id: "3",
          name: "Beef Liver",
          totalWeight: 150,
          meatWeight: 0,
          boneWeight: 0,
          organWeight: 150,
          meat: 0,
          bone: 0,
          organ: 100,
          unit: "g",
        },
        {
          id: "1",
          name: "Beef Heart",
          totalWeight: 150,
          meatWeight: 150,
          boneWeight: 0,
          organWeight: 0,
          meat: 100,
          bone: 0,
          organ: 0,
          unit: "g",
        },
        {
          id: "4",
          name: "Beef Ribs",
          totalWeight: 100,
          meatWeight: 48,
          boneWeight: 52,
          organWeight: 0,
          meat: 48,
          bone: 52,
          organ: 0,
          unit: "g",
        },
      ],
      ratio: "80:10:10", // Default ratio for Beef Mix
    },
    {
      id: "default2",
      name: "Chicken Delight",
      ingredients: [
        {
          id: "12",
          name: "Chicken Drumstick",
          totalWeight: 300,
          meatWeight: 198,
          boneWeight: 99,
          organWeight: 0,
          meat: 66,
          bone: 33,
          organ: 0,
          unit: "g",
        },
        {
          id: "19",
          name: "Chicken Liver",
          totalWeight: 100,
          meatWeight: 0,
          boneWeight: 0,
          organWeight: 100,
          meat: 0,
          bone: 0,
          organ: 100,
          unit: "g",
        },
        {
          id: "15",
          name: "Chicken Gizzard",
          totalWeight: 200,
          meatWeight: 200,
          boneWeight: 0,
          organWeight: 0,
          meat: 100,
          bone: 0,
          organ: 0,
          unit: "g",
        },
        {
          id: "10",
          name: "Chicken Breast boneless",
          totalWeight: 300,
          meatWeight: 300,
          boneWeight: 0,
          organWeight: 0,
          meat: 100,
          bone: 0,
          organ: 0,
          unit: "g",
        },
        {
          id: "9",
          name: "Chicken Back",
          totalWeight: 100,
          meatWeight: 50,
          boneWeight: 50,
          organWeight: 0,
          meat: 50,
          bone: 50,
          organ: 0,
          unit: "g",
        },
      ],
      ratio: "75:15:10", // Default ratio for Chicken Delight
    },
    {
      id: "default3",
      name: "Lamb Feast",
      ingredients: [
        {
          id: "45",
          name: "Lamb Ribs",
          totalWeight: 350,
          meatWeight: 259,
          boneWeight: 91,
          organWeight: 0,
          meat: 74,
          bone: 26,
          organ: 0,
          unit: "g",
        },
        {
          id: "42",
          name: "Lamb Kidney",
          totalWeight: 100,
          meatWeight: 0,
          boneWeight: 0,
          organWeight: 100,
          meat: 0,
          bone: 0,
          organ: 100,
          unit: "g",
        },
        {
          id: "43",
          name: "Lamb Liver",
          totalWeight: 120,
          meatWeight: 0,
          boneWeight: 0,
          organWeight: 120,
          meat: 0,
          bone: 0,
          organ: 100,
          unit: "g",
        },
        {
          id: "41",
          name: "Lamb Heart",
          totalWeight: 200,
          meatWeight: 200,
          boneWeight: 0,
          organWeight: 0,
          meat: 100,
          bone: 0,
          organ: 0,
          unit: "g",
        },
        {
          id: "44",
          name: "Lamb Loin",
          totalWeight: 150,
          meatWeight: 108,
          boneWeight: 42,
          organWeight: 0,
          meat: 72,
          bone: 28,
          organ: 0,
          unit: "g",
        },
      ],
      ratio: "65:25:10", // Default ratio for Lamb Feast
    },
  ];

  const [recipes, setRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [ingredients, setIngredients] = useState([]); // Declare ingredients
  const API_URL = "http://192.168.1.64:3000/api/saveState";

  const { recipeName, recipeId } = route?.params || {};

  useEffect(() => {
    if (route?.params?.newRecipeName && route?.params?.ingredients) {
      const { newRecipeName, ingredients } = route.params;

      // Check if newRecipeName is a valid string
      if (typeof newRecipeName === "string") {
        let uniqueRecipeName = newRecipeName.trim();
        let counter = 1;

        // Ensure the recipe name is unique
        while (recipes.some((recipe) => recipe.name === uniqueRecipeName)) {
          uniqueRecipeName = `${newRecipeName.trim()}(${counter})`;
          counter++;
        }

        const newRecipe = {
          id: uuidv4(),
          name: uniqueRecipeName,
          ingredients: ingredients,
          ratio: { meat: 75, bone: 15, organ: 10, selectedRatio: "75:15:10" }, // Save ratio as an object
        };

        // Save locally
        setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
        AsyncStorage.setItem(
          "recipes",
          JSON.stringify([...recipes, newRecipe])
        );

        // Save to the server
        saveRecipeToServer(newRecipe.id, newRecipe.name);

        // Clear the params after adding the recipe
        navigation.setParams({ newRecipeName: null, ingredients: null });
      }
    }
  }, [route.params, recipes, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const loadRecipes = async () => {
        try {
          const storedRecipes = await AsyncStorage.getItem("recipes");
          let recipesToSet = [];

          if (storedRecipes) {
            const parsedStoredRecipes = JSON.parse(storedRecipes);

            // Ensure we don't add default recipes again if they already exist
            if (parsedStoredRecipes.length > 0) {
              recipesToSet = parsedStoredRecipes;
            } else {
              console.log("No recipes found, adding defaults.");
              recipesToSet = defaultRecipes;
              await AsyncStorage.setItem(
                "recipes",
                JSON.stringify(defaultRecipes)
              );
            }
          } else {
            console.log("No saved recipes found, initializing with defaults.");
            recipesToSet = defaultRecipes;
            await AsyncStorage.setItem(
              "recipes",
              JSON.stringify(defaultRecipes)
            );
          }

          console.log("Final loaded recipes:", recipesToSet);
          setRecipes(recipesToSet);
        } catch (error) {
          console.log("Error loading recipes: ", error);
        }
      };

      loadRecipes();
    }, [])
  );

  const calculateRecipeRatio = (recipe) => {
    if (!recipe || !recipe.ratio) return "No Ratio";

    // Handle ratio as object (for custom recipes)
    if (typeof recipe.ratio === "object") {
      if (
        recipe.ratio.meat !== undefined &&
        recipe.ratio.bone !== undefined &&
        recipe.ratio.organ !== undefined
      ) {
        return `${recipe.ratio.meat} M : ${recipe.ratio.bone} B : ${recipe.ratio.organ} O`;
      }
    }

    // Handle ratio as string (for predefined recipes)
    const ratioStr = String(recipe.ratio);
    const parts = ratioStr.split(":");

    if (parts.length === 3) {
      return `${parts[0]} M : ${parts[1]} B : ${parts[2]} O`;
    }

    return "No Ratio"; // Fallback for unexpected cases
  };

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem("recipes");
        if (storedRecipes) {
          console.log("Loaded Recipes:", JSON.parse(storedRecipes));
          setRecipes(JSON.parse(storedRecipes));
        } else {
          console.log("No recipes found in storage.");
        }
      } catch (error) {
        console.log("Error loading recipes: ", error);
      }
    };
    loadRecipes();
  }, []);

  const calculateTotals = (ingredients) => {
    // Implementation for calculateTotals function
    console.log("Calculating totals for ingredients:", ingredients);
  };

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const { recipeId, ingredients: passedIngredients } = route.params || {}; // Ensure route.params is defined

        if (passedIngredients) {
          setIngredients(passedIngredients);
          calculateTotals(passedIngredients);
        } else if (recipeId) {
          const savedRecipe = await AsyncStorage.getItem(`recipe_${recipeId}`);
          if (savedRecipe) {
            const parsedRecipe = JSON.parse(savedRecipe);
            setIngredients(parsedRecipe.ingredients || []);
            calculateTotals(parsedRecipe.ingredients || []);
          }
        }
      } catch (error) {
        console.error("Failed to load recipe", error);
        Alert.alert("Error", "Failed to load the recipe.");
      }
    };

    fetchRecipeData();
  }, [route.params]);

  useEffect(() => {
    const saveRecipes = async () => {
      try {
        console.log("Saving Recipes:", recipes);
        await AsyncStorage.setItem("recipes", JSON.stringify(recipes));
      } catch (error) {
        console.log("Error saving recipes: ", error);
      }
    };
    saveRecipes();
  }, [recipes]);

  const updateRecipeInDatabase = async (recipe) => {
    try {
      // Send a PUT request to the API to update the recipe
      const response = await axios.put(`${API_URL}/${recipe.id}`, recipe); // Replace with your API endpoint
      console.log("Recipe updated in the database:", response.data);
    } catch (error) {
      console.error("Error updating recipe in the database:", error);
    }
  };

  const navigateToRecipeContent = (recipe) => {
    Alert.alert(
      "Load Recipe",
      `Do you want to load the recipe "${recipe.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              // ✅ IMPROVED: Better ratio parsing to handle both string and object formats
              // ✅ FIXED: Properly determine if this is a standard ratio or custom ratio
              let ratioObject;

              // Check if this is a default recipe with a standard ratio
              const isDefaultRecipe = recipe.id.startsWith("default");

              if (typeof recipe.ratio === "string") {
                const parts = recipe.ratio.split(":");
                if (parts.length === 3) {
                  // Check if this matches one of our standard ratios
                  const ratioString = recipe.ratio;
                  let selectedRatio = "custom";

                  if (ratioString === "80:10:10") {
                    selectedRatio = "80:10:10";
                  } else if (ratioString === "75:15:10") {
                    selectedRatio = "75:15:10";
                  } else {
                    selectedRatio = "custom";
                  }

                  ratioObject = {
                    meat: Number(parts[0]),
                    bone: Number(parts[1]),
                    organ: Number(parts[2]),
                    selectedRatio: selectedRatio,
                    isUserDefined: !isDefaultRecipe,
                  };
                }
              } else if (recipe.ratio && typeof recipe.ratio === "object") {
                // For object format ratios
                const ratioValues = `${recipe.ratio.meat}:${recipe.ratio.bone}:${recipe.ratio.organ}`;
                let selectedRatio = "custom";

                if (ratioValues === "80:10:10") {
                  selectedRatio = "80:10:10";
                } else if (ratioValues === "75:15:10") {
                  selectedRatio = "75:15:10";
                } else {
                  selectedRatio = "custom";
                }

                ratioObject = {
                  ...recipe.ratio,
                  selectedRatio: selectedRatio,
                  isUserDefined: !isDefaultRecipe,
                };
              }

              if (!ratioObject) {
                // Default fallback if we couldn't parse the ratio
                ratioObject = {
                  meat: 80,
                  bone: 10,
                  organ: 10,
                  selectedRatio: "80:10:10",
                  isUserDefined: false,
                };
              }

              console.log("Final ratio object being passed:", ratioObject);

              // Save selected recipe details
              await AsyncStorage.setItem(
                "selectedRecipe",
                JSON.stringify({
                  ingredients: recipe.ingredients,
                  recipeName: recipe.name,
                  recipeId: recipe.id,
                  ratio: ratioObject,
                  isUserDefined: !isDefaultRecipe,
                })
              );

              // Navigate to FoodInputScreen within HomeTabs
              navigation.navigate("HomeTabs", {
                screen: "Home",
                params: {
                  recipeName: recipe.name,
                  recipeId: recipe.id,
                  ingredients: recipe.ingredients,
                  ratio: ratioObject,
                  isUserDefined: !isDefaultRecipe,
                },
              });
            } catch (error) {
              console.error("Error loading recipe into FoodInputScreen", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleOpenEditModal = (recipe) => {
    setRecipeToEdit(recipe);
    setNewRecipeName(recipe.name);
    setIsModalVisible(true);
  };

  const handleSaveEditedRecipe = () => {
    if (newRecipeName.trim()) {
      let uniqueRecipeName = newRecipeName.trim();
      let counter = 1;

      // Ensure unique recipe name when editing
      while (
        recipes.some(
          (recipe) =>
            recipe.name === uniqueRecipeName && recipe.id !== recipeToEdit.id
        )
      ) {
        uniqueRecipeName = `${newRecipeName.trim()}(${counter})`;
        counter++;
      }

      // Update the recipe name
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === recipeToEdit.id
          ? { ...recipe, name: uniqueRecipeName }
          : recipe
      );

      setRecipes(updatedRecipes);
      setIsModalVisible(false);
      setRecipeToEdit(null);
      setNewRecipeName("");
    } else {
      Alert.alert("Error", "Recipe name can't be empty.");
    }
  };

  const handleDeleteRecipe = (recipeId) => {
    const recipeName = recipes.find((recipe) => recipe.id === recipeId)?.name;
    Alert.alert(
      "Delete Recipe",
      `Are you sure you want to delete ${recipeName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            setRecipes((prevRecipes) =>
              prevRecipes.filter((recipe) => recipe.id !== recipeId)
            );
          },
        },
      ]
    );
  };

  const handleAddNewRecipe = () => {
    if (newRecipeName.trim()) {
      let uniqueRecipeName = newRecipeName.trim();
      let counter = 1;

      while (recipes.some((recipe) => recipe.name === uniqueRecipeName)) {
        uniqueRecipeName = `${newRecipeName.trim()}(${counter})`;
        counter++;
      }

      const newRecipe = {
        id: uuidv4(),
        name: uniqueRecipeName,
        ingredients: ingredients,
        ratio: { meat: 75, bone: 15, organ: 10, selectedRatio: "75:15:10" }, // Save ratio as an object
      };

      setRecipes([...recipes, newRecipe]);
      setIsModalVisible(false);
      setNewRecipeName("");
    } else {
      Alert.alert("Error", "Recipe name can't be empty.");
    }
  };

  const saveRecipeToServer = async (recipeId, recipeName) => {
    try {
      const response = await fetch("http://192.168.1.64:3000/api/saveState", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId, recipeName }),
      });

      if (response.ok) {
        console.log("Recipe saved successfully");
      } else {
        console.error("Failed to save recipe");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {recipes.length === 0 ? (
          <Text style={styles.noRecipesText}>No recipes added yet</Text>
        ) : (
          recipes.map((recipe, index) => (
            <TouchableOpacity
              key={`${recipe.id}_${index}`}
              style={styles.recipeItem}
              onPress={() => navigateToRecipeContent(recipe)}
            >
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeText}>{recipe.name}</Text>
                <Text style={styles.ingredientCount}>
                  {calculateRecipeRatio(recipe)}
                </Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleOpenEditModal(recipe)}
                >
                  <FontAwesome name="edit" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteRecipe(recipe.id)}
                >
                  <FontAwesome name="trash" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {recipeToEdit ? "Edit Recipe" : "Add Recipe"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Recipe Name"
              value={newRecipeName}
              onChangeText={setNewRecipeName}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={
                  recipeToEdit ? handleSaveEditedRecipe : handleAddNewRecipe
                }
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsModalVisible(false);
                  setNewRecipeName("");
                  setRecipeToEdit(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  noRecipesText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  recipeItem: {
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
  recipeInfo: {
    flex: 1,
  },
  recipeText: {
    fontSize: 18,
    fontWeight: "500",
  },
  ingredientCount: {
    fontSize: 14,
    color: "gray",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    marginRight: 15,
  },
  deleteButton: {},
  addButtonContainer: {
    paddingHorizontal: 25,
    justifyContent: "center",
    paddingBottom: 20,
    borderTopWidth: 0.7,
    borderTopColor: "#ded8d7",
  },
  addNewRecipeButton: {
    backgroundColor: "#000080",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 0,
    marginTop: 20,
    alignItems: "center",
  },
  addNewRecipeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#000080",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default RecipeScreen;
