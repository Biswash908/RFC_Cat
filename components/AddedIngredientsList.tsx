import * as React from "react";
import { StyleSheet, View } from "react-native";
import AddedIngredient from "./AddedIngredient";

const AddedIngredientsList = () => {
  return (
    <View style={styles.frameParent}>
      <AddedIngredient
        beefRibs="Beef - Ribs"
        m="4.8 M"
        b="5.2 B"
        ellipse1={require("../assets/ellipse-1.png")}
        kg="10 kg"
      />
      <AddedIngredient
        beefRibs="Chicken - Back"
        m="2 M"
        b="2 B"
        ellipse1={require("../assets/ellipse-11.png")}
        kg="4 kg"
        propMarginTop={16}
        propAlignSelf="stretch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  frameParent: {
    width: 360,
    marginTop: 6,
  },
});

export default AddedIngredientsList;
