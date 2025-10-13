import type React from "react"
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const isIOS = Platform.OS === "ios"
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))

interface CorrectorBoxProps {
  title: string
  values: { primary: string; secondary: string }
}

export const CorrectorBox: React.FC<CorrectorBoxProps> = ({ title, values }) => {
  return (
    <View style={styles.correctorBox}>
      <Text style={styles.correctorTitle}>{title}</Text>
      <Text style={styles.correctorText}>{values.primary}</Text>
      <Text style={styles.correctorText}>{values.secondary}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  correctorBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "transparent",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#4747f5",
  },
  correctorTitle: {
    fontSize: rs(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
    marginBottom: 8,
  },
  correctorText: {
    fontSize: rs(isSmallDevice ? 12 : 14),
  },
})
