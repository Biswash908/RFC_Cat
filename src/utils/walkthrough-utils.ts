import AsyncStorage from "@react-native-async-storage/async-storage"

export const WALKTHROUGH_KEY = "hasSeenFoodInputWalkthrough"

export const hasSeenWalkthrough = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(WALKTHROUGH_KEY)
    return value === "true"
  } catch (error) {
    console.error("[v0] Failed to check walkthrough status:", error)
    return false
  }
}

export const markWalkthroughAsComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(WALKTHROUGH_KEY, "true")
  } catch (error) {
    console.error("[v0] Failed to mark walkthrough as complete:", error)
  }
}

export const resetWalkthrough = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(WALKTHROUGH_KEY)
  } catch (error) {
    console.error("[v0] Failed to reset walkthrough:", error)
  }
}
