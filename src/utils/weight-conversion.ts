export const convertWeight = (weight: number): number => {
    if (isNaN(weight)) return 0
    return weight
  }
  
  export const formatWeight = (value: number, unit: "g" | "kg" | "lbs"): string => {
    if (isNaN(value)) value = 0
  
    let formattedNumber: string
    if (unit === "g") {
      formattedNumber = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)
    } else {
      formattedNumber = value.toFixed(2)
    }
  
    return formattedNumber + unit
  }
  
  export const calculateComponentWeights = (
    totalWeight: number,
    percentages: { meat: number; bone: number; organ: number },
  ) => {
    return {
      meatWeight: (totalWeight * percentages.meat) / 100,
      boneWeight: (totalWeight * percentages.bone) / 100,
      organWeight: (totalWeight * percentages.organ) / 100,
    }
  }
  