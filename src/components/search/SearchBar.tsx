import type React from "react"
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  return (
    <View style={[styles.container, Platform.OS === "android" && { marginBottom: 10 }]}>
      <TextInput style={styles.input} placeholder="Search ingredients..." value={value} onChangeText={onChangeText} />
      <TouchableOpacity style={styles.icon}>
        <FontAwesome name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10,
  },
})
