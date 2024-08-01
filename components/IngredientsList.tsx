import * as React from "react";
import { StyleSheet, View } from "react-native";
import Ingredient from "./Ingredient";

const IngredientsList = () => {
  return (
    <View style={styles.frameParent}>
      <Ingredient beefHeart="Beef - Heart" />
      <Ingredient beefHeart="Beef - Kidney" propAlignSelf="unset" />
      <Ingredient beefHeart="Beef - Liver" propAlignSelf="stretch" />
    </View>
  );
};

const styles = StyleSheet.create({
  frameParent: {
    alignSelf: "stretch",
  },
});

export default IngredientsList;
