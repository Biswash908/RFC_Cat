import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { rs, isSmallDevice, SCREEN_WIDTH } from "../../constants/responsive"

interface SupplementTooltipProps {
  ingredientName: string
}

const getSupplementInfo = (name: string): string => {
  if (name === "Bone Meal") {
    return "Bone Meal is shown as 416.667% bone because it's a concentrated calcium and phosphorus supplement. This percentage reflects its equivalent calcium content compared to raw bone, not its actual weight."
  } else if (name === "Powdered Eggshell") {
    return "Powdered Eggshell is listed as 2500% bone due to its extremely high calcium concentration. Just 1g can replace about 25g of raw bone, making it a potent bone substitute in boneless diets."
  }
  return ""
}

export const SupplementTooltip: React.FC<SupplementTooltipProps> = ({ ingredientName }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipOpacity] = useState(new Animated.Value(0))

  const toggleTooltip = () => {
    if (showTooltip) {
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowTooltip(false))
    } else {
      setShowTooltip(true)
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showTooltip) {
      timer = setTimeout(() => {
        Animated.timing(tooltipOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowTooltip(false))
      }, 5000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [showTooltip, tooltipOpacity])

  return (
    <View style={styles.tooltipContainer}>
      <TouchableOpacity onPress={toggleTooltip} style={styles.infoButton}>
        <FontAwesome name="info-circle" size={20} color="#000080" />
      </TouchableOpacity>

      {showTooltip && (
        <>
          <TouchableOpacity style={styles.tooltipOverlay} activeOpacity={1} onPress={toggleTooltip} />
          <Animated.View style={[styles.tooltip, { opacity: tooltipOpacity }]}>
            <Text style={styles.tooltipText}>{getSupplementInfo(ingredientName)}</Text>
            <View style={styles.tooltipArrow} />
          </Animated.View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "relative",
  },
  infoButton: {
    marginLeft: 10,
    padding: 5,
  },
  tooltipOverlay: {
    position: "absolute",
    top: -1000,
    left: -1000,
    width: 3000,
    height: 3000,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#e3f2fd",
    borderRadius: 6,
    padding: 10,
    width: SCREEN_WIDTH * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#000080",
    top: 33,
    right: -100,
    zIndex: 1000,
  },
  tooltipText: {
    fontSize: rs(isSmallDevice ? 12 : 14),
    color: "#333",
  },
  tooltipArrow: {
    position: "absolute",
    top: -10,
    right: 103,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#000080",
  },
})
