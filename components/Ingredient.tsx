import React, { useMemo } from "react";
import { Text, StyleSheet, View } from "react-native";
import { FontSize, FontFamily, Color, Padding } from "../GlobalStyles";

export type IngredientType = {
  beefHeart?: string;

  /** Style props */
  propAlignSelf?: string;
};

const getStyleValue = (key: string, value: string | number | undefined) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const Ingredient = ({ beefHeart, propAlignSelf }: IngredientType) => {
  const beefHeartStyle = useMemo(() => {
    return {
      ...getStyleValue("alignSelf", propAlignSelf),
    };
  }, [propAlignSelf]);

  return (
    <View style={styles.frameWrapper}>
      <View style={[styles.frameContainer, styles.frameFlexBox]}>
        <View style={[styles.frameView, styles.frameFlexBox]}>
          <View style={styles.beefHeartWrapper}>
            <Text style={[styles.beefHeart, beefHeartStyle]}>{beefHeart}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  beefHeart: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.interRegular,
    color: Color.colorBlack,
    textAlign: "left",
  },
  beefHeartWrapper: {
    flex: 1,
  },
  frameView: {
    flex: 1,
  },
  frameContainer: {
    borderStyle: "solid",
    borderColor: Color.colorBlack,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "space-between",
    paddingLeft: Padding.p_xl,
    paddingTop: Padding.p_5xs,
    paddingRight: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    height: 60,
    alignSelf: "stretch",
    flexDirection: "row",
  },
  frameWrapper: {
    alignItems: "center",
    height: 60,
    alignSelf: "stretch",
  },
});

export default Ingredient;
