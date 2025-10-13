import type React from "react"
import { TouchableOpacity, Alert, StyleSheet, Dimensions } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const scale = SCREEN_WIDTH / 375
const rs = (size: number) => Math.round(size * Math.min(scale, 1.2))

interface InfoButtonProps {
  title: string
  message: string
}

export const InfoButton: React.FC<InfoButtonProps> = ({ title, message }) => {
  const showAlert = () => {
    Alert.alert(title, message, [{ text: "OK" }])
  }

  return (
    <TouchableOpacity onPress={showAlert} style={styles.infoIcon}>
      <FontAwesome name="info-circle" size={rs(20)} color="#000080" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  infoIcon: {
    marginRight: 1,
  },
})
