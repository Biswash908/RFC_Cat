// Feeding calculation formulas based on cat weight, age, activity level, and goals

export interface FeedingCalculationParams {
  weight: number // kg
  ageGroup: "kitten" | "adult" | "senior"
  sex: "male" | "female"
  reproductiveState: "intact" | "neutered"
  activityLevel: "low" | "normal" | "high"
  feedingGoal: "maintain" | "lose" | "gain"
  currentFeed?: number // g/day, only for weight loss
}

export interface FeedingResult {
  dailyFeed: number // grams
  perMeal: number // grams (2 meals/day)
  percentBodyWeight: number // %
  meat: number // grams (80%)
  bone: number // grams (10%)
  organ: number // grams (10%)
  note?: string
}

export interface BasicFeedingResult {
  minDaily: number // grams
  maxDaily: number // grams
  minPerMeal: number // grams
  maxPerMeal: number // grams
  minPercent: number // %
  maxPercent: number // %
}

export const calculateBasicFeeding = (weight: number, ageGroup: "kitten" | "adult" | "senior"): BasicFeedingResult => {
  let minPercent = 2.5
  let maxPercent = 3.5

  // Adjust percentage ranges based on age group
  if (ageGroup === "adult") {
    minPercent = 2.5
    maxPercent = 3.5
  } else if (ageGroup === "senior") {
    minPercent = 2.0
    maxPercent = 3.0
  }

  const minDaily = Math.round(((weight * minPercent) / 100) * 1000)
  const maxDaily = Math.round(((weight * maxPercent) / 100) * 1000)
  const minPerMeal = Math.round(minDaily / 2)
  const maxPerMeal = Math.round(maxDaily / 2)

  return {
    minDaily,
    maxDaily,
    minPerMeal,
    maxPerMeal,
    minPercent,
    maxPercent,
  }
}

export const calculateFeeding = (params: FeedingCalculationParams): FeedingResult => {
  let basePercentage = 2.5 // Default 2.5% of body weight

  // Adjust for age
  if (params.ageGroup === "kitten") {
    basePercentage = 4.0 // Kittens need more
  } else if (params.ageGroup === "senior") {
    basePercentage = 2.5 // Use base percentage for senior, detailed range handled in calculateBasicFeeding
  }

  // Adjust for sex and reproductive state
  if (params.sex === "male" && params.reproductiveState === "intact") {
    basePercentage += 0.2
  } else if (params.sex === "female" && params.reproductiveState === "intact") {
    basePercentage += 0.1
  }

  // Adjust for activity level
  if (params.activityLevel === "low") {
    basePercentage -= 0.3
  } else if (params.activityLevel === "high") {
    basePercentage += 0.3
  }

  // Adjust for feeding goal
  if (params.feedingGoal === "lose") {
    basePercentage -= 0.5
  } else if (params.feedingGoal === "gain") {
    basePercentage += 0.3
  }

  // Ensure minimum and maximum
  basePercentage = Math.max(1.5, Math.min(4.0, basePercentage))

  const dailyFeed = Math.round(((params.weight * basePercentage) / 100) * 1000) // Round to nearest 0.1g
  const perMeal = Math.round(dailyFeed / 2)

  const meat = Math.round(dailyFeed * 0.8)
  const bone = Math.round(dailyFeed * 0.1)
  const organ = Math.round(dailyFeed * 0.1)

  let note: string | undefined

  if (params.feedingGoal === "lose" && params.currentFeed) {
    const reduction = Math.round(params.currentFeed / 8)
    const newAmount = params.currentFeed - reduction
    note = `Reduce by ${reduction}g (from ${params.currentFeed}g to ${newAmount}g) and recheck in 4–6 weeks for safe gradual weight loss.`
  }

  return {
    dailyFeed,
    perMeal,
    percentBodyWeight: basePercentage,
    meat,
    bone,
    organ,
    note,
  }
}
