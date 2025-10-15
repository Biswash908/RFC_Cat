"use client"

import type React from "react"
import { useState } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Dimensions } from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const scale = SCREEN_WIDTH / 375
const verticalScale = SCREEN_HEIGHT / 812
const rs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(verticalScale, 1.2) : verticalScale))

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
      Alert.alert("Error", "Recipe name can't be empty.")
      return
    }
    onSave(recipeName.trim())
    setRecipeName("")
  }

  const handleClose = () => {
    setRecipeName("")
    onClose()
  }

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Add Recipe</Text>
          <TextInput style={styles.input} placeholder="Recipe Name" value={recipeName} onChangeText={setRecipeName} />
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    padding: rs(16),
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
    marginBottom: vs(12),
    textAlign: "center",
  },
  input: {
    height: Platform.OS === "ios" ? vs(40) : vs(isSmallDevice ? 50 : 40),
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: rs(10),
    marginBottom: vs(16),
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#000080",
    flex: 1,
    paddingVertical: vs(8),
    borderRadius: 5,
    alignItems: "center",
    marginRight: rs(5),
  },
  cancelButton: {
    backgroundColor: "grey",
    flex: 1,
    paddingVertical: vs(8),
    borderRadius: 5,
    alignItems: "center",
    marginLeft: rs(5),
  },
  saveButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: rs(isSmallDevice ? 12 : 14),
  },
})
