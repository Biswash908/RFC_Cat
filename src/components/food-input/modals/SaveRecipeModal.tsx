"use client"

import type React from "react"
import { useState } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"

interface SaveRecipeModalProps {
  visible: boolean
  onClose: () => void
  onSave: (name: string) => void
  currentName?: string
}

export const SaveRecipeModal: React.FC<SaveRecipeModalProps> = ({ visible, onClose, onSave, currentName = "" }) => {
  const [recipeName, setRecipeName] = useState(currentName)

  const handleSave = () => {
    if (!recipeName.trim()) {
      Alert.alert("Error", "Please enter a recipe name")
      return
    }
    onSave(recipeName.trim())
    setRecipeName("")
    onClose()
  }

  const handleClose = () => {
    setRecipeName("")
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Save Recipe</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter recipe name"
            value={recipeName}
            onChangeText={setRecipeName}
            autoFocus
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
