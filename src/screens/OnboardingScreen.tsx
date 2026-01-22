"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { useSaveContext } from "../context/SaveContext"

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, "OnboardingScreen">

interface OnboardingPage {
  emoji: string
  title: string
  description: string
}

const ONBOARDING_PAGES: OnboardingPage[] = [
  {
    emoji: "🥩",
    title: "What Is PMR Raw Feeding?",
    description:
      "PMR (Prey Model Raw) feeding is a raw, meat-only diet for cats.\n\nIt is based on feeding raw muscle meat, edible bone, and organs in balanced proportions.\n\nThis approach avoids processed foods and fillers.",
  },
  {
    emoji: "📱",
    title: "What This App Helps You Do",
    description:
      "This app helps you plan PMR raw feeding.\n\nYou can add raw ingredients, use or create recipes, and set meat, bone, and organ ratios.\n\nDaily portions are calculated based on your cat’s details.",
  },
  {
    emoji: "🧭",
    title: "Using the Results",
    description:
      "The app provides estimated feeding ranges and exact ingredient quantities based on the ratios you choose.\n\nFeed within the suggested range using your own judgement.\n\nIndividual cats can have different needs.",
  },
]

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const isPad = Platform.isPad
  const { setOnboardingCompleted } = useSaveContext()
  const [currentPage, setCurrentPage] = useState(0)

  const handleNext = () => {
    if (currentPage < ONBOARDING_PAGES.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleGetStarted = async () => {
    await setOnboardingCompleted(true)
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeTabs" }],
    })
  }

  const handleSkip = async () => {
    await setOnboardingCompleted(true)
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeTabs" }],
    })
  }

  const page = ONBOARDING_PAGES[currentPage]
  const isLastPage = currentPage === ONBOARDING_PAGES.length - 1

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: isPad ? 40 : 24,
          paddingTop: isPad ? 60 : 40,
          paddingBottom: insets.bottom + (isPad ? 60 : 40),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, opacity: 1 }}>
          <View style={{ flex: 1, justifyContent: "center", minHeight: isPad ? 200 : 150 }}>
            <View style={{ alignItems: "center", marginBottom: isPad ? 32 : 24 }}>
              <Text style={{ fontSize: isPad ? 80 : 64, lineHeight: isPad ? 88 : 72 }}>{page.emoji}</Text>
            </View>

            <Text
              style={{
                fontSize: isPad ? 32 : 28,
                fontWeight: "600",
                color: "#000",
                marginBottom: isPad ? 28 : 20,
                textAlign: "center",
                fontFamily: "Roboto-Medium",
                lineHeight: isPad ? 40 : 36,
              }}
            >
              {page.title}
            </Text>

            <Text
              style={{
                fontSize: isPad ? 17 : 15,
                color: "#555",
                lineHeight: isPad ? 28 : 24,
                textAlign: "center",
                fontFamily: "Roboto-Regular",
              }}
            >
              {page.description}
            </Text>
          </View>

          <View style={{ marginTop: isPad ? 32 : 24 }}>
            {isLastPage ? (
              <TouchableOpacity
                onPress={handleGetStarted}
                style={{
                  backgroundColor: "#000080",
                  paddingVertical: isPad ? 18 : 16,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: isPad ? 18 : 16,
                    fontWeight: "600",
                    fontFamily: "Roboto-Medium",
                  }}
                >
                  Get Started
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleNext}
                style={{
                  backgroundColor: "#000080",
                  paddingVertical: isPad ? 18 : 16,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: isPad ? 18 : 16,
                    fontWeight: "600",
                    fontFamily: "Roboto-Medium",
                  }}
                >
                  Next
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSkip}
              style={{
                backgroundColor: "#e0e0e0",
                paddingVertical: isPad ? 18 : 16,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginTop: isPad ? 12 : 10,
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: "#666",
                  fontSize: isPad ? 18 : 16,
                  fontWeight: "600",
                  fontFamily: "Roboto-Medium",
                }}
              >
                Skip Intro
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default OnboardingScreen
