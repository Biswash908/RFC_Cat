import type React from "react"
import { TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from "react-native"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const isIOS = Platform.OS === "ios"
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))

interface CustomRatioButtonProps {
  selectedRatio: string
  customRatio: { meat: number; bone: number; organ: number }
  onPress: () => void
}

export const CustomRatioButton: React.FC<CustomRatioButtonProps> = ({ selectedRatio, customRatio, onPress }) => {
  const displayCustomRatio =
    selectedRatio === "custom" &&
    (customRatio.meat !== undefined || customRatio.bone !== undefined || customRatio.organ !== undefined)
      ? `${customRatio.meat}:${customRatio.bone}:${customRatio.organ}`
      : "Custom Ratio"

  return (
    <TouchableOpacity
      style={[
        styles.customButton,
        selectedRatio === "custom" ? styles.selectedCustomButton : { backgroundColor: "white", borderColor: "navy" },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.customButtonText, selectedRatio === "custom" ? { color: "white" } : { color: "black" }]}>
        {selectedRatio === "custom" ? displayCustomRatio : "Custom Ratio"}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  customButton: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#000080",
  },
  selectedCustomButton: {
    backgroundColor: "#000080",
    borderColor: "green",
  },
  customButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "600",
  },
})
