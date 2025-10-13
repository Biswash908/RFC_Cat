export interface RatioValidationResult {
    isValid: boolean
    error?: string
  }
  
  export const validateRatioTotal = (meat: number, bone: number, organ: number): RatioValidationResult => {
    const total = meat + bone + organ
    const difference = total - 100
  
    // Check if all values are zero
    if (meat === 0 && bone === 0 && organ === 0) {
      return {
        isValid: false,
        error: "All values cannot be zero. Please enter valid ratio values.",
      }
    }
  
    // Check if total equals 100
    if (difference !== 0) {
      const message =
        difference > 0
          ? `You're ${difference.toFixed(2)}% over the limit. Adjust the values so the total ratio equals 100%.`
          : `You're ${Math.abs(difference).toFixed(2)}% under 100%. Add more to make the ratio total 100%.`
  
      return {
        isValid: false,
        error: message,
      }
    }
  
    return { isValid: true }
  }
  
  export const sanitizeNumericInput = (value: string): number => {
    const sanitized = Number.parseFloat(value.replace(/[^0-9.]/g, ""))
    return isNaN(sanitized) ? 0 : sanitized
  }
  