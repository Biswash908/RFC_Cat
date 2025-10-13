"use client"

import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { RatioValues } from "../types/calculator.types"
import { DEFAULT_RATIO } from "../constants/ratios"

export const useRatioManagement = (loadedRatio?: RatioValues) => {
  const [newMeat, setNewMeat] = useState<number>(80)
  const [newBone, setNewBone] = useState<number>(10)
  const [newOrgan, setNewOrgan] = useState<number>(10)
  const [selectedRatio, setSelectedRatio] = useState<string>(DEFAULT_RATIO)
  const [customRatio, setCustomRatio] = useState<{ meat: number; bone: number; organ: number }>({
    meat: 0,
    bone: 0,
    organ: 0,
  })
  const [userSelectedRatio, setUserSelectedRatio] = useState<boolean>(false)

  // Load saved ratios on mount
  useEffect(() => {
    const loadSavedRatio = async () => {
      try {
        const savedMeat = await AsyncStorage.getItem("meatRatio")
        const savedBone = await AsyncStorage.getItem("boneRatio")
        const savedOrgan = await AsyncStorage.getItem("organRatio")
        const savedRatio = await AsyncStorage.getItem("selectedRatio")

        if (!userSelectedRatio && !loadedRatio) {
          setSelectedRatio(savedRatio || DEFAULT_RATIO)
          setNewMeat(Number(savedMeat) || 80)
          setNewBone(Number(savedBone) || 10)
          setNewOrgan(Number(savedOrgan) || 10)

          if (savedRatio === "custom") {
            const customMeat = Number(savedMeat) || 0
            const customBone = Number(savedBone) || 0
            const customOrgan = Number(savedOrgan) || 0

            setCustomRatio({ meat: customMeat, bone: customBone, organ: customOrgan })
            setSelectedRatio("custom")
          }
        }
      } catch (error) {
        console.log("❌ Failed to load ratios:", error)
      }
    }

    loadSavedRatio()
  }, [userSelectedRatio, loadedRatio])

  // Save ratios whenever they change
  useEffect(() => {
    const saveRatios = async () => {
      try {
        await AsyncStorage.setItem("meatRatio", newMeat.toString())
        await AsyncStorage.setItem("boneRatio", newBone.toString())
        await AsyncStorage.setItem("organRatio", newOrgan.toString())
        await AsyncStorage.setItem("selectedRatio", selectedRatio)

        if (selectedRatio === "custom") {
          await AsyncStorage.setItem("customMeatRatio", newMeat.toString())
          await AsyncStorage.setItem("customBoneRatio", newBone.toString())
          await AsyncStorage.setItem("customOrganRatio", newOrgan.toString())
        }
      } catch (error) {
        console.log("Failed to save ratios:", error)
      }
    }

    if (newMeat !== null && newBone !== null && newOrgan !== null) {
      saveRatios()
    }
  }, [newMeat, newBone, newOrgan, selectedRatio])

  const setRatio = async (meat: number, bone: number, organ: number, ratio: string) => {
    console.log(`✅ Setting ratio: ${ratio} (${meat}:${bone}:${organ})`)

    setNewMeat(meat)
    setNewBone(bone)
    setNewOrgan(organ)
    setSelectedRatio(ratio)
    setUserSelectedRatio(true)

    if (ratio === "custom") {
      setCustomRatio({ meat, bone, organ })
    }

    const saveItems = [
      ["meatRatio", meat.toString()],
      ["boneRatio", bone.toString()],
      ["organRatio", organ.toString()],
      ["selectedRatio", ratio],
      ["userSelectedRatio", "true"],
      ["tempMeatRatio", meat.toString()],
      ["tempBoneRatio", bone.toString()],
      ["tempOrganRatio", organ.toString()],
      ["tempSelectedRatio", ratio],
    ]

    if (ratio === "custom") {
      saveItems.push(
        ["customMeatRatio", meat.toString()],
        ["customBoneRatio", bone.toString()],
        ["customOrganRatio", organ.toString()],
      )
    }

    await AsyncStorage.multiSet(saveItems)
  }

  const clearUserSelection = async () => {
    await AsyncStorage.setItem("userSelectedRatio", "false")
    setUserSelectedRatio(false)
  }

  return {
    newMeat,
    newBone,
    newOrgan,
    selectedRatio,
    customRatio,
    userSelectedRatio,
    setRatio,
    setCustomRatio,
    clearUserSelection,
  }
}
