// Utility functions for formatting weights and other values

export const formatWeight = (weight: number | undefined, weightUnit: "g" | "kg" | "lbs") => {
  if (weight === undefined) weight = 0

  let formattedNumber
  if (weightUnit === "g") {
    formattedNumber = weight % 1 === 0 ? weight.toFixed(0) : weight.toFixed(2)
  } else {
    formattedNumber = weight.toFixed(2)
  }

  return formattedNumber + weightUnit
}
