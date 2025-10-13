import type React from "react"
import { View, StyleSheet } from "react-native"
import { RatioInputField } from "./RatioInputField"

interface RatioInputGridProps {
  meatRatio: number
  boneRatio: number
  organRatio: number
  onMeatChange: (value: number) => void
  onBoneChange: (value: number) => void
  onOrganChange: (value: number) => void
}

export const RatioInputGrid: React.FC<RatioInputGridProps> = ({
  meatRatio,
  boneRatio,
  organRatio,
  onMeatChange,
  onBoneChange,
  onOrganChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <RatioInputField label="Meat Ratio" value={meatRatio} onChangeValue={onMeatChange} />
        <RatioInputField label="Bone Ratio" value={boneRatio} onChangeValue={onBoneChange} />
      </View>
      <View style={styles.inputRow}>
        <RatioInputField label="Organ Ratio" value={organRatio} onChangeValue={onOrganChange} />
      </View>
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
})
