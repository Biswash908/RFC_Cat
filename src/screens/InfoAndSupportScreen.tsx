"use client"

import { useLayoutEffect } from "react"
import { View, StyleSheet, StatusBar, Linking, TouchableOpacity, Text, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSaveContext } from "../context/SaveContext"
import { SupportLinkItem } from "../components/support/SupportLinkItem"
import { supportLinks } from "../constants/support-links"

const InfoAndSupportScreen = ({ navigation }) => {
  const { resetFoodInputWalkthrough } = useSaveContext()

  const handleLinkPress = (action: string, value: string) => {
    if (action === "link") {
      Linking.openURL(value).catch((err) => console.error("Couldn't load page", err))
    } else if (action === "email") {
      Linking.openURL(`mailto:${value}`)
    } else if (action === "navigate") {
      navigation.navigate(value)
    }
  }

  const handleShowWalkthroughAgain = async () => {
    await resetFoodInputWalkthrough()
    navigation.navigate("Home")
  }

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Support" })
  }, [navigation])

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView style={styles.container}>
        {supportLinks.map((link) => (
          <SupportLinkItem
            key={link.id}
            title={link.title}
            icon={link.icon}
            onPress={() => handleLinkPress(link.action, link.value)}
          />
        ))}

        <TouchableOpacity style={styles.walkthroughButton} onPress={handleShowWalkthroughAgain}>
          <Text style={styles.walkthroughButtonText}>Show Tutorial Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  walkthroughButton: {
    backgroundColor: "#000080",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  walkthroughButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto-Medium",
  },
})

export default InfoAndSupportScreen
