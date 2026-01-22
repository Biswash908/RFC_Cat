"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface SaveContextType {
  customRatio: { meat: number; bone: number; organ: number } | null
  setCustomRatio: (ratio: { meat: number; bone: number; organ: number } | null) => void
  customRatios: { meat: number; bone: number; organ: number } | null
  selectedRatio: { meat: number; bone: number; organ: number } | null
  setSelectedRatio: (ratio: { meat: number; bone: number; organ: number } | null) => void
  hasCompletedOnboarding: boolean
  setOnboardingCompleted: (completed: boolean) => Promise<void>
  hasSeenFoodInputWalkthrough: boolean
  setFoodInputWalkthroughSeen: (seen: boolean) => Promise<void>
  resetFoodInputWalkthrough: () => Promise<void>
}

const SaveContext = createContext<SaveContextType | undefined>(undefined)

export const SaveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customRatio, setCustomRatio] = useState<{ meat: number; bone: number; organ: number } | null>(null)
  const [selectedRatio, setSelectedRatio] = useState<{ meat: number; bone: number; organ: number } | null>(null)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [hasSeenFoodInputWalkthrough, setHasSeenFoodInputWalkthrough] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize selectedRatio and onboarding state from AsyncStorage on mount
  useEffect(() => {
    const initializeState = async () => {
      try {
        // Load onboarding state
        const onboardingCompleted = await AsyncStorage.getItem("hasCompletedOnboarding")
        if (onboardingCompleted === "true") {
          setHasCompletedOnboarding(true)
        }

        // Load walkthrough state
        const walkthroughSeen = await AsyncStorage.getItem("hasSeenFoodInputWalkthrough")
        if (walkthroughSeen === "true") {
          setHasSeenFoodInputWalkthrough(true)
        }

        // Try to load temporary ratio first (from CalculatorScreen)
        const tempMeat = await AsyncStorage.getItem("tempMeatRatio")
        const tempBone = await AsyncStorage.getItem("tempBoneRatio")
        const tempOrgan = await AsyncStorage.getItem("tempOrganRatio")

        if (tempMeat && tempBone && tempOrgan) {
          const ratio = {
            meat: Number(tempMeat),
            bone: Number(tempBone),
            organ: Number(tempOrgan),
          }
          console.log("[v0] SaveContext - Initialized from temp storage:", ratio)
          setSelectedRatio(ratio)
          setIsInitialized(true)
          return
        }

        // Fallback to regular ratio storage
        const savedMeat = await AsyncStorage.getItem("meatRatio")
        const savedBone = await AsyncStorage.getItem("boneRatio")
        const savedOrgan = await AsyncStorage.getItem("organRatio")

        if (savedMeat && savedBone && savedOrgan) {
          const ratio = {
            meat: Number(savedMeat),
            bone: Number(savedBone),
            organ: Number(savedOrgan),
          }
          console.log("[v0] SaveContext - Initialized from regular storage:", ratio)
          setSelectedRatio(ratio)
          setIsInitialized(true)
          return
        }

        // Default fallback
        console.log("[v0] SaveContext - No stored ratio, using default 80:10:10")
        setSelectedRatio({ meat: 80, bone: 10, organ: 10 })
        setIsInitialized(true)
      } catch (error) {
        console.error("[v0] SaveContext - Failed to initialize state:", error)
        setSelectedRatio({ meat: 80, bone: 10, organ: 10 })
        setIsInitialized(true)
      }
    }

    initializeState()
  }, [])

  const handleSetSelectedRatio = (ratio: { meat: number; bone: number; organ: number } | null) => {
    console.log("[v0] SaveContext - setSelectedRatio called with:", ratio)
    setSelectedRatio(ratio)
  }

  const handleSetOnboardingCompleted = async (completed: boolean) => {
    try {
      await AsyncStorage.setItem("hasCompletedOnboarding", completed ? "true" : "false")
      setHasCompletedOnboarding(completed)
      console.log("[v0] SaveContext - Onboarding completed:", completed)
    } catch (error) {
      console.error("[v0] SaveContext - Failed to save onboarding state:", error)
    }
  }

  const handleSetFoodInputWalkthroughSeen = async (seen: boolean) => {
    try {
      await AsyncStorage.setItem("hasSeenFoodInputWalkthrough", seen ? "true" : "false")
      setHasSeenFoodInputWalkthrough(seen)
      console.log("[v0] SaveContext - Food input walkthrough marked as seen:", seen)
    } catch (error) {
      console.error("[v0] SaveContext - Failed to save walkthrough state:", error)
    }
  }

  const handleResetFoodInputWalkthrough = async () => {
    try {
      await AsyncStorage.removeItem("hasSeenFoodInputWalkthrough")
      setHasSeenFoodInputWalkthrough(false)
      console.log("[v0] SaveContext - Food input walkthrough reset")
    } catch (error) {
      console.error("[v0] SaveContext - Failed to reset walkthrough:", error)
    }
  }

  return (
    <SaveContext.Provider
      value={{
        customRatio,
        setCustomRatio,
        customRatios: customRatio,
        selectedRatio,
        setSelectedRatio: handleSetSelectedRatio,
        hasCompletedOnboarding,
        setOnboardingCompleted: handleSetOnboardingCompleted,
        hasSeenFoodInputWalkthrough,
        setFoodInputWalkthroughSeen: handleSetFoodInputWalkthroughSeen,
        resetFoodInputWalkthrough: handleResetFoodInputWalkthrough,
      }}
    >
      {children}
    </SaveContext.Provider>
  )
}

export const useSaveContext = () => {
  const context = useContext(SaveContext)
  console.log("[v0] useSaveContext called, context value:", context)
  if (!context) {
    throw new Error("useSaveContext must be used within SaveProvider")
  }
  return context
}
