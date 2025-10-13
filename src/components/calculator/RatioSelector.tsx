import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const isIOS = Platform.OS === "ios"
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))

interface RatioSelectorProps {
  selectedRatio: string
  onSelectRatio: (meat: number, bone: number, organ: number, ratio: string) => void
}

export const RatioSelector: React.FC<RatioSelectorProps> = ({ selectedRatio, onSelectRatio }) => {
  return (
    <View style={styles.ratioButtonsContainer}>
      <TouchableOpacity
        style={[
          styles.ratioButton,
          selectedRatio === "80:10:10" && selectedRatio !== "custom" && styles.selectedRatioButton,
        ]}
        onPress={() => onSelectRatio(80, 10, 10, "80:10:10")}
      >
        <Text
          style={[
            styles.ratioButtonText,
            selectedRatio === "80:10:10" && selectedRatio !== "custom" && { color: "white" },
          ]}
        >
          80:10:10
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.ratioButton,
          selectedRatio === "75:15:10" && selectedRatio !== "custom" && styles.selectedRatioButton,
        ]}
        onPress={() => onSelectRatio(75, 15, 10, "75:15:10")}
      >
        <Text
          style={[
            styles.ratioButtonText,
            selectedRatio === "75:15:10" && selectedRatio !== "custom" && { color: "white" },
          ]}
        >
          75:15:10
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  ratioButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  ratioButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#000080",
  },
  selectedRatioButton: {
    backgroundColor: "#000080",
    borderColor: "green",
  },
  ratioButtonText: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "600",
    color: "black",
  },
})
