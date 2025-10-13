export const formatWeight = (value: number, ingredient: string, unit: string): string => {
    // Handle NaN and Infinity values
    if (isNaN(value) || !isFinite(value)) value = 0
  
    // Format the number based on unit
    let formattedValue: string
    if (unit === "g") {
      // For grams, show whole numbers if possible
      formattedValue = Math.abs(value) % 1 === 0 ? Math.abs(value).toFixed(0) : Math.abs(value).toFixed(2)
    } else {
      // For kg and lbs, always show 2 decimal places
      formattedValue = Math.abs(value).toFixed(2)
    }
  
    const action = value > 0 ? "Add" : value < 0 ? "Remove" : "Add"
    return `${action} ${formattedValue}${unit} of ${ingredient}`
  }
  
  export const calculateCorrectorValues = (
    meatWeight: number,
    boneWeight: number,
    organWeight: number,
    meatRatio: number,
    boneRatio: number,
    organRatio: number,
  ) => {
    // If we have no weights at all, return zeros
    if (meatWeight === 0 && boneWeight === 0 && organWeight === 0) {
      return {
        meatCorrect: { bone: 0, organ: 0 },
        boneCorrect: { meat: 0, organ: 0 },
        organCorrect: { meat: 0, bone: 0 },
      }
    }
  
    const meatCorrect = { bone: 0, organ: 0 }
    const boneCorrect = { meat: 0, organ: 0 }
    const organCorrect = { meat: 0, bone: 0 }
  
    if (meatWeight > 0) {
      meatCorrect.bone = (meatWeight / meatRatio) * boneRatio - boneWeight
      meatCorrect.organ = (meatWeight / meatRatio) * organRatio - organWeight
    }
  
    if (boneWeight > 0) {
      boneCorrect.meat = (boneWeight / boneRatio) * meatRatio - meatWeight
      boneCorrect.organ = (boneWeight / boneRatio) * organRatio - organWeight
    }
  
    if (organWeight > 0) {
      organCorrect.meat = (organWeight / organRatio) * meatRatio - meatWeight
      organCorrect.bone = (organWeight / organRatio) * boneRatio - boneWeight
    }
  
    return { meatCorrect, boneCorrect, organCorrect }
  }
  
  export const isValidCustomRatio = (meat: number, bone: number, organ: number): boolean => {
    const total = meat + bone + organ
    return total > 0 && Math.abs(total - 100) < 5
  }
  