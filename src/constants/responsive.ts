import { Dimensions, Platform } from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export const isSmallDevice = SCREEN_WIDTH < 375
export const isIOS = Platform.OS === "ios"

const scale = SCREEN_WIDTH / 375
const verticalScale = SCREEN_HEIGHT / 812

// Responsive sizing functions
export const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))
export const vs = (size: number) => Math.round(size * (isIOS ? Math.min(verticalScale, 1.2) : verticalScale))

export { SCREEN_WIDTH, SCREEN_HEIGHT }
