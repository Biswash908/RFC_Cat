export const STANDARD_RATIOS = {
    "80:10:10": { meat: 80, bone: 10, organ: 10 },
    "75:15:10": { meat: 75, bone: 15, organ: 10 },
  } as const
  
  export const DEFAULT_RATIO = "80:10:10"
  
  export const RATIO_INFO_TEXT =
    "• Adult cats: 80% meat, 10% bone, 10% secreting organs\n\n" +
    "• Kittens and pregnant/nursing cats: 75% meat, 15% bone, 10% secreting organs\n\n" +
    "The higher bone content for kittens and mothers provides essential calcium for growth and lactation."
  
  export const CORRECTOR_INFO_TEXT =
    "The corrector values help you achieve the intended ratio. Adjust these values to match your desired meat, bone, and organ distribution."
  