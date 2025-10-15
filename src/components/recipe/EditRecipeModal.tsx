import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native"
import type { Recipe } from "../../types/recipe.types"

interface EditRecipeModalProps {
  visible: boolean
  recipe: Recipe | null
  onSave: (recipeId: string, newName: string) => void
  onCancel: () => void
}

export const EditRecipeModal: React.FC<EditRecipeModalProps> = ({ visible, recipe, onSave, onCancel }) => {
  const [recipeName, setRecipeName] = useState("")

  useEffect(() => {
    if (recipe) {
      setRecipeName(recipe.name)
    }
  }, [recipe])

  const handleSave = () => {
    if (recipeName.trim()) {
      if (recipe) {
        onSave(recipe.id, recipeName)
      }
    } else {
      Alert.alert("Error", "Recipe name can't be empty.")
    }
  }

  const handleCancel = () => {
    setRecipeName("")
    onCancel()
  }

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Recipe</Text>
          <TextInput style={styles.input} placeholder="Recipe Name" value={recipeName} onChangeText={setRecipeName} />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
  buttons: {
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
})
