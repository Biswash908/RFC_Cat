import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import type { BasicFeedingResult } from "../../utils/feeding-calculator"

interface BasicResultCardProps {
  result: BasicFeedingResult
}

export const BasicResultCard: React.FC<BasicResultCardProps> = ({ result }) => {
  const minPerMealThree = Math.round((result.minDaily / 3) * 10) / 10
  const maxPerMealThree = Math.round((result.maxDaily / 3) * 10) / 10

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recommended Daily Feed Range</Text>

      <View style={styles.mainResult}>
        <Text style={styles.mainValue}>
          {result.minDaily}–{result.maxDaily} g
        </Text>
        <Text style={styles.subText}>
          ≈ {result.minPercent.toFixed(1)}–{result.maxPercent.toFixed(1)}% of body weight
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.mealsContainer}>
        <View style={styles.mealRow}>
          <Text style={styles.mealLabel}>Per meal: 2 meals/day</Text>
          <Text style={styles.mealValue}>
            {result.minPerMeal}–{result.maxPerMeal} g
          </Text>
        </View>

        <View style={styles.mealRow}>
          <Text style={styles.mealLabel}>Per meal: 3 meals/day</Text>
          <Text style={styles.mealValue}>
            {minPerMealThree}–{maxPerMealThree} g
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>Important Note:</Text>
        <Text style={styles.noteText}>
          This is an estimate meant for maintaining your cat’s current weight. Every cat is different; observe your cat’s
          body condition, activity level, and eating habits to decide if any adjustment is needed. You can slightly increase
          the amount if your cat needs to gain weight or reduce it a little if weight loss is needed.
        </Text>
      </View>
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
    color: "#d45500ff",
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
  mealsContainer: {
    gap: 12,
  },
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  noteContainer: {
    backgroundColor: "#f5f5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#f7a600",
    padding: 12,
    borderRadius: 6,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
})
