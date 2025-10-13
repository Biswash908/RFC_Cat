import { convertFromGrams } from "./calculations"

export const formatAmount = (amountInGrams: number, unit: string): string => {
  const converted = convertFromGrams(amountInGrams, unit)
  return `${converted.toFixed(2)} ${unit}`
}

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return "0.0%"
  return `${((value / total) * 100).toFixed(1)}%`
}
