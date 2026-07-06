"use client"

import { useLayoutEffect } from "react"
import { View, StyleSheet, StatusBar, Linking, TouchableOpacity, Text, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome } from "@expo/vector-icons"
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
    navigation.navigate("Home", { showTutorial: true })
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

        <TouchableOpacity style={styles.tutorialItem} onPress={handleShowWalkthroughAgain}>
          <View style={styles.iconContainer}>
            <FontAwesome name="repeat" size={24} color="#000080" style={styles.icon} />
          </View>
          <Text style={styles.tutorialItemText}>Show Tutorial Again</Text>
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
  tutorialItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  icon: {
    marginRight: 12,
  },
  tutorialItemText: {
    fontSize: 18,
    color: "black",
  },
  iconContainer: {
    width: 38,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default InfoAndSupportScreen
