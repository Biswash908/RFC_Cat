import type React from "react"
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native"
import { CorrectorBox } from "./CorrectorBox"
import { InfoButton } from "./InfoButton"
import { CORRECTOR_INFO_TEXT } from "../../constants/ratios"
import { formatWeight } from "../../utils/calculator-utils"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const isIOS = Platform.OS === "ios"
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))

interface CorrectorGridProps {
  meatCorrect: { bone: number; organ: number }
  boneCorrect: { meat: number; organ: number }
  organCorrect: { meat: number; bone: number }
  unit: string
}

export const CorrectorGrid: React.FC<CorrectorGridProps> = ({ meatCorrect, boneCorrect, organCorrect, unit }) => {
  return (
    <>
      <View style={styles.correctorInfoContainer}>
        <Text style={styles.correctorInfoText}>Use the corrector to achieve the intended ratio:</Text>
        <InfoButton title="Corrector Info" message={CORRECTOR_INFO_TEXT} />
      </View>

      <View style={styles.correctorContainer}>
        <CorrectorBox
          title="If Meat is correct"
          values={{
            primary: formatWeight(meatCorrect.bone, "bones", unit),
            secondary: formatWeight(meatCorrect.organ, "organs", unit),
          }}
        />
        <CorrectorBox
          title="If Bone is correct"
          values={{
            primary: formatWeight(boneCorrect.meat, "meat", unit),
            secondary: formatWeight(boneCorrect.organ, "organs", unit),
          }}
        />
        <CorrectorBox
          title="If Organ is correct"
          values={{
            primary: formatWeight(organCorrect.meat, "meat", unit),
            secondary: formatWeight(organCorrect.bone, "bones", unit),
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  correctorInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  correctorInfoText: {
    fontSize: rs(isSmallDevice ? 16 : 18),
    color: "black",
    fontWeight: "bold",
    flex: 1,
  },
  correctorContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    marginTop: 16,
  },
})
