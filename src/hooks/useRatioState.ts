"use client"

import { useState, useRef, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import React from "react"

export const useRatioState = () => {
  const [newMeat, setNewMeat] = useState<number>(80)
  const [newBone, setNewBone] = useState<number>(10)
  const [newOrgan, setNewOrgan] = useState<number>(10)
  const [selectedRatio, setSelectedRatio] = useState<string>("80:10:10")
  const [tempRatio, setTempRatio] = useState<any>(null)
  const selectedRatioRef = useRef<string | null>(null)

  useEffect(() => {
    const loadRatioFromStorage = async () => {
      try {
        const savedRatio = await AsyncStorage.getItem("selectedRatio")
        const savedMeat = await AsyncStorage.getItem("meatRatio")
        const savedBone = await AsyncStorage.getItem("boneRatio")
        const savedOrgan = await AsyncStorage.getItem("organRatio")

        if (savedRatio && savedMeat && savedBone && savedOrgan) {
          setSelectedRatio(savedRatio)
          setNewMeat(Number(savedMeat))
          setNewBone(Number(savedBone))
          setNewOrgan(Number(savedOrgan))
        }
      } catch (error) {
        console.log("Failed to load ratio:", error)
      }
    }
    loadRatioFromStorage()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const refreshRatio = async () => {
        const savedRatio = await AsyncStorage.getItem("selectedRatio")
        const savedMeat = await AsyncStorage.getItem("meatRatio")
        const savedBone = await AsyncStorage.getItem("boneRatio")
        const savedOrgan = await AsyncStorage.getItem("organRatio")

        if (savedRatio && savedMeat && savedBone && savedOrgan) {
          setSelectedRatio(savedRatio)
          setNewMeat(Number(savedMeat))
          setNewBone(Number(savedBone))
          setNewOrgan(Number(savedOrgan))
        }
      }
      refreshRatio()
    }, []),
  )

  useFocusEffect(
    React.useCallback(() => {
      const loadTemporaryRatio = async () => {
        try {
          const tempSelectedRatio = await AsyncStorage.getItem("tempSelectedRatio")
          const tempMeatRatio = await AsyncStorage.getItem("tempMeatRatio")
          const tempBoneRatio = await AsyncStorage.getItem("tempBoneRatio")
          const tempOrganRatio = await AsyncStorage.getItem("tempOrganRatio")

          if (tempSelectedRatio && tempMeatRatio && tempBoneRatio && tempOrganRatio) {
            setSelectedRatio(tempSelectedRatio)
            setNewMeat(Number(tempMeatRatio))
            setNewBone(Number(tempBoneRatio))
            setNewOrgan(Number(tempOrganRatio))
            setTempRatio({
              meat: Number(tempMeatRatio),
              bone: Number(tempBoneRatio),
              organ: Number(tempOrganRatio),
              selectedRatio: tempSelectedRatio,
              isUserDefined: true,
            })
          }
        } catch (error) {
          console.log("Failed to load temporary ratio:", error)
        }
      }
      loadTemporaryRatio()
    }, []),
  )

  return {
    newMeat,
    setNewMeat,
    newBone,
    setNewBone,
    newOrgan,
    setNewOrgan,
    selectedRatio,
    setSelectedRatio,
    tempRatio,
    setTempRatio,
    selectedRatioRef,
  }
}
