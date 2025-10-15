import type React from "react"
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(scale, 1.2) : scale))

interface TotalBarProps {
  totalMeat: number
  totalBone: number
  totalOrgan: number
  totalWeight: number
  unit: "g" | "kg" | "lbs"
  formatWeight: (weight: number, unit: "g" | "kg" | "lbs") => string
}

export const TotalBar: React.FC<TotalBarProps> = ({
  totalMeat,
  totalBone,
  totalOrgan,
  totalWeight,
  unit,
  formatWeight,
}) => {
  return (
    <View style={styles.totalBar}>
      <Text style={styles.totalText}>Total: {formatWeight(totalWeight || 0, unit)}</Text>
      <Text style={styles.subTotalText}>
        Meat: {formatWeight(totalMeat || 0, unit)} (
        {totalWeight > 0 ? ((totalMeat / totalWeight) * 100).toFixed(2) : "0.00"}
        %) | Bone: {formatWeight(totalBone || 0, unit)} (
        {totalWeight > 0 ? ((totalBone / totalWeight) * 100).toFixed(2) : "0.00"}
        %) | Organ: {formatWeight(totalOrgan || 0, unit)} (
        {totalWeight > 0 ? ((totalOrgan / totalWeight) * 100).toFixed(2) : "0.00"}
        %)
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  totalBar: {
    padding: rs(isSmallDevice ? 5 : 8),
    borderBottomWidth: 1,
    borderBottomColor: "#ded8d7",
    backgroundColor: "white",
    marginTop: isSmallDevice ? -12 : -10,
  },
  totalText: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    fontWeight: "bold",
    color: "black",
  },
  subTotalText: {
    fontSize: rs(isSmallDevice ? 12 : 14),
    color: "black",
  },
})
