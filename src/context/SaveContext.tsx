"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface SaveContextType {
  customRatio: { meat: number; bone: number; organ: number } | null
  setCustomRatio: (ratio: { meat: number; bone: number; organ: number } | null) => void
  customRatios: { meat: number; bone: number; organ: number } | null
}

const SaveContext = createContext<SaveContextType | undefined>(undefined)

export const SaveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customRatio, setCustomRatio] = useState<{ meat: number; bone: number; organ: number } | null>(null)

  return (
    <SaveContext.Provider value={{ customRatio, setCustomRatio, customRatios: customRatio }}>
      {children}
    </SaveContext.Provider>
  )
}

export const useSaveContext = () => {
  const context = useContext(SaveContext)
  if (!context) {
    throw new Error("useSaveContext must be used within SaveProvider")
  }
  return context
}
