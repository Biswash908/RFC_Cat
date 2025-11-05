import type React from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native"

interface WeightInputProps {
  value: string
  onChangeText: (text: string) => void
  label?: string
  placeholder?: string
  unit?: string
  onUnitChange?: (unit: string) => void
}

export const WeightInput: React.FC<WeightInputProps> = ({
  value,
  onChangeText,
  label = "Weight",
  placeholder = "Enter weight",
  unit = "kg",
  onUnitChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChangeText}
        />
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, unit === "kg" && styles.unitButtonActive]}
            onPress={() => onUnitChange?.("kg")}
          >
            <Text style={[styles.unitText, unit === "kg" && styles.unitTextActive]}>kg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === "lbs" && styles.unitButtonActive]}
            onPress={() => onUnitChange?.("lbs")}
          >
            <Text style={[styles.unitText, unit === "lbs" && styles.unitTextActive]}>lbs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  unitToggle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  unitButtonActive: {
    backgroundColor: "#000080",
  },
  unitText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  unitTextActive: {
    color: "#fff",
  },
})
