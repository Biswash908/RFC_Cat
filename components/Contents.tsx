import React, { useMemo } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Color, FontFamily, FontSize, Padding } from "../GlobalStyles";

export type ContentsType = {
  boneContent?: string;
  prop?: string;
  kG?: string;

  /** Style props */
  propPaddingLeft?: number | string;
  propPaddingLeft1?: number | string;
  propFlex?: number | string;
  propMarginLeft?: number | string;
  propMarginLeft1?: number | string;
};

const getStyleValue = (key: string, value: string | number | undefined) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const Contents = ({
  boneContent,
  prop,
  kG,
  propPaddingLeft,
  propPaddingLeft1,
  propFlex,
  propMarginLeft,
  propMarginLeft1,
}: ContentsType) => {
  const frameView1Style = useMemo(() => {
    return {
      ...getStyleValue("paddingLeft", propPaddingLeft),
    };
  }, [propPaddingLeft]);

  const frameView2Style = useMemo(() => {
    return {
      ...getStyleValue("paddingLeft", propPaddingLeft1),
    };
  }, [propPaddingLeft1]);

  const frameView3Style = useMemo(() => {
    return {
      ...getStyleValue("flex", propFlex),
      ...getStyleValue("marginLeft", propMarginLeft),
    };
  }, [propFlex, propMarginLeft]);

  const frameView4Style = useMemo(() => {
    return {
      ...getStyleValue("marginLeft", propMarginLeft1),
    };
  }, [propMarginLeft1]);

  return (
    <View style={[styles.frameParent, frameView1Style]}>
      <View style={[styles.boneContentWrapper, frameView2Style]}>
        <Text style={styles.boneContent}>{boneContent}</Text>
      </View>
      <View style={[styles.wrapper, styles.wrapperFlexBox, frameView3Style]}>
        <Text style={[styles.text, styles.kgTypo]}>{prop}</Text>
      </View>
      <View style={[styles.kgWrapper, styles.wrapperFlexBox, frameView4Style]}>
        <Text style={styles.kgTypo}>{kG}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperFlexBox: {
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  kgTypo: {
    textAlign: "left",
    color: Color.colorBlack,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_2xl,
  },
  boneContent: {
    textAlign: "center",
    color: Color.colorBlack,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_2xl,
    flex: 1,
  },
  boneContentWrapper: {
    width: 137,
    paddingLeft: Padding.p_10xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    width: 44,
  },
  wrapper: {
    flex: 1,
    marginLeft: 20,
  },
  kgWrapper: {
    borderStyle: "solid",
    borderColor: Color.colorGray,
    borderWidth: 0.5,
    width: 102,
    overflow: "hidden",
    paddingHorizontal: Padding.p_lg,
    paddingVertical: Padding.p_11xs,
  },
  frameParent: {
    alignSelf: "stretch",
    marginTop: 67,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default Contents;
