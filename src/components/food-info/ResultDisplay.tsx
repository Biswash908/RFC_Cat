import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { rs, isSmallDevice } from "../../constants/responsive"
import { formatWeight } from "../../utils/weight-conversion"
import { SupplementTooltip } from "./SupplementTooltip"

interface ResultDisplayProps {
  ingredient: {
    name: string
    meat: number
    bone: number
    organ: number
    isSupplement?: boolean
  }
  meatWeight: number
  boneWeight: number
  organWeight: number
  selectedUnit: "g" | "kg" | "lbs"
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  ingredient,
  meatWeight,
  boneWeight,
  organWeight,
  selectedUnit,
}) => {
  const isSupplement =
    ingredient.name === "Bone Meal" || ingredient.name === "Powdered Eggshell" || ingredient.isSupplement

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>
        Meat: {ingredient.meat}% - {formatWeight(meatWeight, selectedUnit)}
      </Text>
      <View style={styles.boneRow}>
        <Text style={styles.resultText}>
          Bone: {ingredient.bone}% - {formatWeight(boneWeight, selectedUnit)}
        </Text>
        {isSupplement && <SupplementTooltip ingredientName={ingredient.name} />}
      </View>
      <Text style={styles.resultText}>
        Organ: {ingredient.organ}% - {formatWeight(organWeight, selectedUnit)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  resultContainer: {
    marginTop: 15,
  },
  resultText: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    marginVertical: 5,
  },
  boneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
  },
})
