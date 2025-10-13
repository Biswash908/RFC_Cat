import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useCustomRatio } from "../hooks/useCustomRatio"
import { RatioInputGrid } from "../components/custom-ratio/RatioInputGrid"

const CustomRatioScreen: React.FC = () => {
  const { meatRatio, boneRatio, organRatio, setMeatRatio, setBoneRatio, setOrganRatio, handleSaveRatio } =
    useCustomRatio()

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select your Custom ratio:</Text>
      </View>

      <RatioInputGrid
        meatRatio={meatRatio}
        boneRatio={boneRatio}
        organRatio={organRatio}
        onMeatChange={setMeatRatio}
        onBoneChange={setBoneRatio}
        onOrganChange={setOrganRatio}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveRatio}>
        <Text style={styles.buttonText}>Use Ratio</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    backgroundColor: "#000080",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default CustomRatioScreen
