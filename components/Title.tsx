import React, { useMemo } from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { FontSize, FontFamily, Color, Padding } from "../GlobalStyles";

export type TitleType = {
  search?: string;

  /** Style props */
  propFlex?: number;
};

const getStyleValue = (key: string, value: string | number | undefined) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const Title = ({ search, propFlex }: TitleType) => {
  const searchStyle = useMemo(() => {
    return {
      ...getStyleValue("flex", propFlex),
    };
  }, [propFlex]);

  return (
    <View style={styles.frameWrapper}>
      <View style={[styles.vectorParent, styles.vectorParentFlexBox]}>
        <Image
          style={styles.vectorIcon}
          contentFit="cover"
          source={require("../assets/vector.png")}
        />
        <View style={[styles.searchWrapper, styles.vectorParentFlexBox]}>
          <Text style={[styles.search, searchStyle]}>{search}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vectorParentFlexBox: {
    alignItems: "center",
    flexDirection: "row",
  },
  vectorIcon: {
    width: 7,
    height: 14,
  },
  search: {
    fontSize: FontSize.size_lg,
    fontWeight: "600",
    fontFamily: FontFamily.interSemiBold,
    color: Color.colorBlack,
    textAlign: "center",
  },
  searchWrapper: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: -10,
  },
  vectorParent: {
    paddingHorizontal: Padding.p_xs,
    paddingVertical: Padding.p_10xs,
    alignSelf: "stretch",
  },
  frameWrapper: {
    overflow: "hidden",
    paddingHorizontal: 0,
    paddingVertical: Padding.p_smi,
    alignSelf: "stretch",
  },
});

export default Title;
