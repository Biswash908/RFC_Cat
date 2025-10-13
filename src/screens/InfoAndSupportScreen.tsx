"use client"

import { useLayoutEffect } from "react"
import { View, StyleSheet, SafeAreaView, StatusBar, Linking } from "react-native"
import { SupportLinkItem } from "../components/support/SupportLinkItem"
import { supportLinks } from "../constants/support-links"

const InfoAndSupportScreen = ({ navigation }) => {
  const handleLinkPress = (action: string, value: string) => {
    if (action === "link") {
      Linking.openURL(value).catch((err) => console.error("Couldn't load page", err))
    } else if (action === "email") {
      Linking.openURL(`mailto:${value}`)
    } else if (action === "navigate") {
      navigation.navigate(value)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Support" })
  }, [navigation])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        {supportLinks.map((link) => (
          <SupportLinkItem
            key={link.id}
            title={link.title}
            icon={link.icon}
            onPress={() => handleLinkPress(link.action, link.value)}
          />
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
})

export default InfoAndSupportScreen
