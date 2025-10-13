import type React from "react"
import { View, Text, StyleSheet } from "react-native"

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No recipes added yet</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
})
