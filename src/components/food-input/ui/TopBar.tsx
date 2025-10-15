import type React from "react"
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const scale = SCREEN_WIDTH / 375
const verticalScale = SCREEN_HEIGHT / 812
const rs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (Platform.OS === "ios" ? Math.min(verticalScale, 1.2) : verticalScale))

interface TopBarProps {
  recipeName: string
}

export const TopBar: React.FC<TopBarProps> = ({ recipeName }) => {
  return (
    <View style={styles.topBar}>
      <Text style={styles.topBarText}>{recipeName || "Raw Feeding Calc"}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: "white",
    paddingVertical: vs(isSmallDevice ? 7 : 15),
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? (isSmallDevice ? 5 : -10) : isSmallDevice ? 10 : 12,
    marginBottom: Platform.OS === "ios" ? (isSmallDevice ? 5 : -5) : isSmallDevice ? 2 : -6,
  },
  topBarText: {
    fontSize: rs(isSmallDevice ? 20 : 22),
    fontWeight: "600",
    color: "black",
  },
})
