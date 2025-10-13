"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface UnitContextType {
  unit: string
  setUnit: (unit: string) => void
}

const UnitContext = createContext<UnitContextType | undefined>(undefined)

export const UnitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unit, setUnit] = useState("g")

  return <UnitContext.Provider value={{ unit, setUnit }}>{children}</UnitContext.Provider>
}

export const useUnit = () => {
  const context = useContext(UnitContext)
  if (!context) {
    throw new Error("useUnit must be used within UnitProvider")
  }
  return context
}
