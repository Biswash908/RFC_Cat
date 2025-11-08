import type React from "react"
import { View } from "react-native"
import Svg, { Path } from "react-native-svg"

interface PetFoodBowlIconProps {
  size?: number
  color?: string
}

export const PetFoodBowlIcon: React.FC<PetFoodBowlIconProps> = ({ size = 22, color = "white" }) => {
  // internally scale up drawing so it fills the same space as FontAwesome icons
  const scale = size / 24

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 20 20" // tighter frame so it fills space
        fill="none"
      >
        {/* Bowl base */}
        <Path
          d="M2 13.5c0 .8.6 1.5 1.5 1.5h13c.9 0 1.5-.7 1.5-1.5 0-.3 0-.5-.1-.8l-1.8-6c-.3-1-1.1-1.7-2.2-1.7H6.1c-1.1 0-1.9.7-2.2 1.7l-1.8 6c-.1.3-.1.5-.1.8Z"
          fill={color}
        />
        {/* Bowl opening */}
        <Path
          d="M5.2 8.3c0-.6.4-1 1-1h7.6c.6 0 1 .4 1 1 0 .2 0 .3-.1.5l-.6 2.1H5.9l-.6-2.1c0-.2-.1-.3-.1-.5Z"
          fill={color}
        />
      </Svg>
    </View>
  )
}
