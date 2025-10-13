import type React from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"
import { sanitizeNumericInput } from "../../utils/ratio-validation"

interface RatioInputFieldProps {
  label: string
  value: number
  onChangeValue: (value: number) => void
}

export const RatioInputField: React.FC<RatioInputFieldProps> = ({ label, value, onChangeValue }) => {
  const handleChange = (text: string) => {
    const sanitized = sanitizeNumericInput(text)
    onChangeValue(sanitized)
  }

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.ratioInput}
        keyboardType="numeric"
        value={value.toString()}
        onChangeText={handleChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "48%",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ratioInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
})
