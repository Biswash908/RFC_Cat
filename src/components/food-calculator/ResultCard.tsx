import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import type { FeedingResult } from "../../utils/feeding-calculator"

interface ResultCardProps {
  result: FeedingResult
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recommended Daily Feed</Text>

      <View style={styles.mainResult}>
        <Text style={styles.mainValue}>{result.dailyFeed} g</Text>
        <Text style={styles.subText}>≈ {result.percentBodyWeight.toFixed(1)}% of body weight</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.mealRow}>
        <Text style={styles.mealLabel}>Per Meal (2 meals/day):</Text>
        <Text style={styles.mealValue}>{result.perMeal} g</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.breakdownTitle}>Breakdown (80/10/10)</Text>

      <View style={styles.breakdownRow}>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Meat</Text>
          <Text style={styles.breakdownValue}>{result.meat} g</Text>
          <Text style={styles.breakdownPercent}>(80%)</Text>
        </View>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Bone</Text>
          <Text style={styles.breakdownValue}>{result.bone} g</Text>
          <Text style={styles.breakdownPercent}>(10%)</Text>
        </View>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Organ</Text>
          <Text style={styles.breakdownValue}>{result.organ} g</Text>
          <Text style={styles.breakdownPercent}>(10%)</Text>
        </View>
      </View>

      {result.note && (
        <>
          <View style={styles.divider} />
          <Text style={styles.note}>{result.note}</Text>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  mainResult: {
    alignItems: "center",
    marginBottom: 12,
  },
  mainValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f7a600",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mealLabel: {
    fontSize: 14,
    color: "#666",
  },
  mealValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  breakdownItem: {
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000080",
  },
  breakdownPercent: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  note: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 18,
  },
})
