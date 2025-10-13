import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { formatAmount } from "../../../utils/formatting"

interface TotalBarProps {
  totalMeat: number
  totalBone: number
  totalOrgan: number
  totalWeight: number
  unit: string
}

export const TotalBar: React.FC<TotalBarProps> = ({ totalMeat, totalBone, totalOrgan, totalWeight, unit }) => {
  const meatPercent = totalWeight > 0 ? ((totalMeat / totalWeight) * 100).toFixed(1) : "0.0"
  const bonePercent = totalWeight > 0 ? ((totalBone / totalWeight) * 100).toFixed(1) : "0.0"
  const organPercent = totalWeight > 0 ? ((totalOrgan / totalWeight) * 100).toFixed(1) : "0.0"

  return (
    <View style={styles.totalBar}>
      <Text style={styles.totalTitle}>Totals</Text>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Meat:</Text>
        <Text style={styles.totalValue}>
          {formatAmount(totalMeat, unit)} ({meatPercent}%)
        </Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Bone:</Text>
        <Text style={styles.totalValue}>
          {formatAmount(totalBone, unit)} ({bonePercent}%)
        </Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Organ:</Text>
        <Text style={styles.totalValue}>
          {formatAmount(totalOrgan, unit)} ({organPercent}%)
        </Text>
      </View>
      <View style={[styles.totalRow, styles.totalWeightRow]}>
        <Text style={styles.totalWeightLabel}>Total Weight:</Text>
        <Text style={styles.totalWeightValue}>{formatAmount(totalWeight, unit)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  totalBar: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  totalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 15,
    color: "#666",
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  totalWeightRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalWeightLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalWeightValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
  },
})
