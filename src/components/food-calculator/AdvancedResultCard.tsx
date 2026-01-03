import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import type { AdvancedFeedingResult } from "../../utils/feeding-calculator"

interface AdvancedResultCardProps {
  result: AdvancedFeedingResult
}

export const AdvancedResultCard: React.FC<AdvancedResultCardProps> = ({ result }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recommended Daily Feed (Advanced)</Text>

      <View style={styles.mainResult}>
        <Text style={styles.mainValue}>
          {result.minDailyFood}–{result.maxDailyFood} g
        </Text>
        <Text style={styles.subText}>≈ {result.feedingPercent.toFixed(2)}% of body weight</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.componentsContainer}>
        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>🥩 Meat (80%)</Text>
          <Text style={styles.componentValue}>
            {result.minMeat}–{result.maxMeat} g
          </Text>
        </View>

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>🦴 Bone (10%)</Text>
          <Text style={styles.componentValue}>
            {result.minBone}–{result.maxBone} g
          </Text>
        </View>

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>🩸 Liver (5%)</Text>
          <Text style={styles.componentValue}>
            {result.minLiver}–{result.maxLiver} g
          </Text>
        </View>

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>🧠 Other Organ (5%)</Text>
          <Text style={styles.componentValue}>
            {result.minOrgan}–{result.maxOrgan} g
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>{result.note}</Text>
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
  componentsContainer: {
    gap: 10,
  },
  componentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  componentLabel: {
    fontSize: 14,
    color: "#666",
  },
  componentValue: {
    fontSize: 16,
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
  noteText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
})
