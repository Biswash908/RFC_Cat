import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import type { AdvancedFeedingResult } from "../../utils/feeding-calculator"

interface AdvancedResultCardProps {
  result: AdvancedFeedingResult
  ratio?: { meat: number; bone: number; organ: number } | null
}

export const AdvancedResultCard: React.FC<AdvancedResultCardProps> = ({ result, ratio }) => {
  const meatPercent = ratio ? (ratio.meat / (ratio.meat + ratio.bone + ratio.organ)) * 100 : 80
  const bonePercent = ratio ? (ratio.bone / (ratio.meat + ratio.bone + ratio.organ)) * 100 : 10
  const organPercent = ratio ? (ratio.organ / (ratio.meat + ratio.bone + ratio.organ)) * 100 : 10

  const liverPercent = organPercent / 2
  const otherOrganPercent = organPercent / 2

  const minMeat = Math.round(result.minDaily * (meatPercent / 100))
  const maxMeat = Math.round(result.maxDaily * (meatPercent / 100))
  const minBone = Math.round(result.minDaily * (bonePercent / 100))
  const maxBone = Math.round(result.maxDaily * (bonePercent / 100))
  const minLiver = Math.round(result.minDaily * (liverPercent / 100))
  const maxLiver = Math.round(result.maxDaily * (liverPercent / 100))
  const minOrgan = Math.round(result.minDaily * (otherOrganPercent / 100))
  const maxOrgan = Math.round(result.maxDaily * (otherOrganPercent / 100))

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recommended Daily Feed (Advanced)</Text>

      <View style={styles.mainResult}>
        <Text style={styles.mainValue}>
          {result.minDaily} – {result.maxDaily} g
        </Text>
        <Text style={styles.subText}>
          ≈ {result.minPercent.toFixed(2)}% – {result.maxPercent.toFixed(2)}% of body weight
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.ratioDisplay}>
        <Text style={styles.ratioText}>
          Ratio: {meatPercent.toFixed(0)}% : {bonePercent.toFixed(0)}% : {organPercent.toFixed(0)}%
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.componentsContainer}>
        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>🥩 Meat ({meatPercent.toFixed(0)}%)</Text>
          <Text style={styles.componentValue}>
            {minMeat} – {maxMeat} g
          </Text>
        </View>

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>🦴 Bone ({bonePercent.toFixed(0)}%)</Text>
          <Text style={styles.componentValue}>
            {minBone} – {maxBone} g
          </Text>
        </View>

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>🩸 Liver ({liverPercent.toFixed(0)}%)</Text>
          <Text style={styles.componentValue}>
            {minLiver} – {maxLiver} g
          </Text>
        </View>

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>🧠 Other Organ ({otherOrganPercent.toFixed(0)}%)</Text>
          <Text style={styles.componentValue}>
            {minOrgan} – {maxOrgan} g
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
  ratioDisplay: {
    alignItems: "center",
    paddingVertical: 8,
  },
  ratioText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000080",
  },
})
