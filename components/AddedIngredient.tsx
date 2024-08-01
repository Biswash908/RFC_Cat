import React, { useMemo } from "react";
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";
import { Color, FontSize, FontFamily, Border, Padding } from "../GlobalStyles";

export type AddedIngredientType = {
  beefRibs?: string;
  m?: string;
  b?: string;
  ellipse1?: ImageSourcePropType;
  kg?: string;

  /** Style props */
  propMarginTop?: number | string;
  propAlignSelf?: string;
};

const getStyleValue = (key: string, value: string | number | undefined) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const AddedIngredient = ({
  beefRibs,
  m,
  b,
  ellipse1,
  kg,
  propMarginTop,
  propAlignSelf,
}: AddedIngredientType) => {
  const frameViewStyle = useMemo(() => {
    return {
      ...getStyleValue("marginTop", propMarginTop),
    };
  }, [propMarginTop]);

  const beefRibsStyle = useMemo(() => {
    return {
      ...getStyleValue("alignSelf", propAlignSelf),
    };
  }, [propAlignSelf]);

  return (
    <View style={[styles.frameWrapper, styles.frameFlexBox, frameViewStyle]}>
      <View style={[styles.frameParent, styles.frameFlexBox]}>
        <View style={styles.beefRibsParent}>
          <Text style={[styles.beefRibs, beefRibsStyle]}>{beefRibs}</Text>
          <View style={styles.mParent}>
            <Text style={[styles.m, styles.mTypo]}>{m}</Text>
            <Text style={[styles.b, styles.bSpaceBlock]}>{b}</Text>
            <Text style={[styles.b, styles.bSpaceBlock]}>0 O</Text>
            <Image
              style={[styles.frameChild, styles.bSpaceBlock]}
              contentFit="cover"
              source={ellipse1}
            />
            <Text style={[styles.b, styles.bSpaceBlock]}>{kg}</Text>
          </View>
        </View>
        <Image
          style={styles.frameItem}
          contentFit="cover"
          source={require("../assets/frame-7.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameFlexBox: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  mTypo: {
    color: Color.colorDimgray,
    fontSize: FontSize.size_sm,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
  },
  bSpaceBlock: {
    marginLeft: 9,
    flex: 1,
  },
  beefRibs: {
    fontSize: FontSize.size_base,
    color: Color.colorBlack,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
  },
  m: {
    flex: 1,
  },
  b: {
    color: Color.colorDimgray,
    fontSize: FontSize.size_sm,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
  },
  frameChild: {
    maxWidth: "100%",
    height: 3,
    overflow: "hidden",
  },
  mParent: {
    marginTop: 4,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  beefRibsParent: {
    flex: 1,
  },
  frameItem: {
    width: 20,
    height: 13,
  },
  frameParent: {
    flex: 1,
  },
  frameWrapper: {
    borderRadius: Border.br_4xs,
    borderStyle: "solid",
    borderColor: Color.colorBlack,
    borderWidth: 1,
    height: 60,
    paddingLeft: Padding.p_xl,
    paddingTop: Padding.p_5xs,
    paddingRight: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    overflow: "hidden",
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
});

export default AddedIngredient;
