import type React from "react"
import { View, StyleSheet, TouchableOpacity, Text, Platform, Dimensions } from "react-native"
import { RatioInputField } from "./RatioInputField"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const isIOS = Platform.OS === "ios"
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))

interface RatioInputGridProps {
  meatRatio: number
  boneRatio: number
  organRatio: number
  totalRatio: number
  onRatioChange: (type: string, value: string) => void
  onUseRatio: () => void
}

export const RatioInputGrid: React.FC<RatioInputGridProps> = ({
  meatRatio,
  boneRatio,
  organRatio,
  totalRatio,
  onRatioChange,
  onUseRatio,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <RatioInputField
          label="Meat Ratio"
          value={meatRatio}
          onChangeValue={(value) => onRatioChange("meat", value.toString())}
        />
        <RatioInputField
          label="Bone Ratio"
          value={boneRatio}
          onChangeValue={(value) => onRatioChange("bone", value.toString())}
        />
      </View>
      <View style={styles.inputRow}>
        <RatioInputField
          label="Organ Ratio"
          value={organRatio}
          onChangeValue={(value) => onRatioChange("organ", value.toString())}
        />
      </View>

      <View style={styles.totalContainer}>
      </View>

      <TouchableOpacity
        style={[styles.setRatioButton, totalRatio !== 100 && styles.setRatioButtonDisabled]}
        onPress={onUseRatio}
        disabled={totalRatio !== 100}
      >
        <Text style={styles.setRatioButtonText}>Set Ratio</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  totalText: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
    color: "#000",
  },
  setRatioButton: {
    backgroundColor: "#000080",
    paddingVertical: vs(12),
    paddingHorizontal: rs(40),
    borderRadius: 10,
    alignItems: "center",
    marginTop: -15,
  },
  setRatioButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  setRatioButtonText: {
    color: "white",
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
  },
})
