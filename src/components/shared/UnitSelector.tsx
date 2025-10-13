import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { rs, vs } from "../../constants/responsive"

interface UnitSelectorProps {
  selectedUnit: "g" | "kg" | "lbs"
  onUnitChange: (unit: "g" | "kg" | "lbs") => void
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({ selectedUnit, onUnitChange }) => {
  return (
    <View style={styles.buttonContainer}>
      {(["g", "kg", "lbs"] as const).map((unit) => (
        <TouchableOpacity
          key={unit}
          style={[styles.unitButton, selectedUnit === unit ? styles.activeUnitButton : styles.inactiveUnitButton]}
          onPress={() => onUnitChange(unit)}
        >
          <Text style={styles.unitButtonText}>{unit}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  unitButton: {
    paddingVertical: vs(10),
    paddingHorizontal: rs(25),
    borderRadius: 5,
  },
  activeUnitButton: {
    backgroundColor: "#000080",
  },
  inactiveUnitButton: {
    backgroundColor: "#ccc",
  },
  unitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: rs(14),
  },
})
