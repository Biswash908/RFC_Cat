import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

interface SupportLinkItemProps {
  title: string
  icon: string
  onPress: () => void
}

export const SupportLinkItem: React.FC<SupportLinkItemProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.iconContainer}>
        <FontAwesome name={icon as any} size={24} color="#000080" style={styles.icon} />
      </View>
      <Text style={styles.listItemText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  icon: {
    marginRight: 12,
  },
  listItemText: {
    fontSize: 18,
    color: "black",
  },
  iconContainer: {
    width: 38,
    alignItems: "center",
    justifyContent: "center",
  },
})
