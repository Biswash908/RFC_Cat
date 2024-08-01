import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, TextInput } from "react-native";
import { Padding, FontFamily, FontSize, Border, Color } from "../GlobalStyles";

const SearchBar = () => {
  return (
    <View style={[styles.frameWrapper, styles.frameFlexBox1]}>
      <View style={[styles.frameParent, styles.frameFlexBox]}>
        <View style={[styles.frameContainer, styles.frameFlexBox]}>
          <Image
            style={styles.frameChild}
            contentFit="cover"
            source={require("../assets/frame-27.png")}
          />
        </View>
        <TextInput
          style={[styles.frameItem, styles.frameFlexBox]}
          placeholder="Search for a food item"
          placeholderTextColor="#b4b4b4"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameFlexBox1: {
    alignSelf: "stretch",
    overflow: "hidden",
  },
  frameFlexBox: {
    alignItems: "center",
    flexDirection: "row",
  },
  frameChild: {
    maxWidth: "100%",
    height: 25,
    flex: 1,
    overflow: "hidden",
  },
  frameContainer: {
    width: 45,
    padding: Padding.p_3xs,
  },
  frameItem: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_base,
    flex: 1,
  },
  frameParent: {
    borderRadius: Border.br_3xl,
    borderStyle: "solid",
    borderColor: Color.colorBlack,
    borderWidth: 1,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_4xs,
    overflow: "hidden",
    alignSelf: "stretch",
  },
  frameWrapper: {
    borderBottomRightRadius: Border.br_12xs,
    borderBottomLeftRadius: Border.br_12xs,
    backgroundColor: Color.colorWhitesmoke,
    padding: Padding.p_5xs,
    marginTop: 440,
    overflow: "hidden",
  },
});

export default SearchBar;
