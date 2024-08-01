import * as React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import AddedIngredientsList from "./AddedIngredientsList"; // Corrected the import path
import { FontFamily, FontSize, Color, Padding, Border } from "../GlobalStyles"; // Adjusted the import path

const FoodInputScreenContent = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.frameFlexBox}>
      <View style={[styles.frameWrapper, styles.frameWrapperLayout]}>
        <View style={[styles.frameContainer, styles.frameFlexBox]}>
          <View
            style={[styles.rawFeedingCalculatorWrapper, styles.wrapperFlexBox]}
          >
            <Text style={styles.rawFeedingCalculator}>
              Raw Feeding Calculator
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.frameView}>
        <View style={[styles.vectorParent, styles.wrapperFlexBox]}>
          <Image
            style={[styles.vectorIcon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/vector1.png")}
          />
          <Pressable
            style={styles.vector}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Image
              style={[styles.icon, styles.iconLayout]}
              contentFit="cover"
              source={require("../assets/vector2.png")}
            />
          </Pressable>
          <View style={[styles.ingredientsInputWrapper, styles.wrapperFlexBox]}>
            <Text style={styles.ingredientsInput}>Ingredients Input</Text>
          </View>
        </View>
      </View>
      <View style={[styles.frameWrapper1, styles.frameWrapperLayout]}>
        <View style={[styles.frameGroup, styles.wrapperFlexBox]}>
          <View style={[styles.totalWrapper, styles.wrapperFlexBox]}>
            <Text style={styles.textTypo}>Total:</Text>
          </View>
          <Text style={[styles.text, styles.textTypo]}>{` `}</Text>
          <View style={[styles.meatWrapper, styles.wrapperFlexBox]}>
            <Text style={styles.textTypo}>48.57% Meat</Text>
          </View>
          <View style={[styles.meatWrapper, styles.wrapperFlexBox]}>
            <Text style={styles.textTypo}>51.43% Bone</Text>
          </View>
          <View style={[styles.meatWrapper, styles.wrapperFlexBox]}>
            <Text style={styles.textTypo}>0.00% Organ</Text>
          </View>
        </View>
      </View>
      <AddedIngredientsList />
    </View>
  );
};

const styles = StyleSheet.create({
  frameWrapperLayout: {
    width: 360,
    alignItems: "center",
  },
  frameFlexBox: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  wrapperFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconLayout: {
    maxWidth: "100%",
    overflow: "hidden",
    flex: 1,
  },
  textTypo: {
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorBlack,
  },
  rawFeedingCalculator: {
    color: Color.colorWhite,
    textAlign: "center",
    fontFamily: FontFamily.interSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_lg,
    flex: 1,
  },
  rawFeedingCalculatorWrapper: {
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
  },
  frameContainer: {
    justifyContent: "center",
    flex: 1,
  },
  frameWrapper: {
    backgroundColor: Color.colorGreenyellow,
    height: 49,
    padding: Padding.p_3xs,
  },
  vectorIcon: {
    height: 14,
    zIndex: 0,
  },
  icon: {
    height: "100%",
  },
  vector: {
    height: 25,
    zIndex: 1,
    marginLeft: 304,
  },
  ingredientsInput: {
    color: Color.colorBlack,
    textAlign: "center",
    fontFamily: FontFamily.interSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_lg,
    flex: 1,
  },
  ingredientsInputWrapper: {
    position: "absolute",
    top: 3,
    left: 12,
    paddingLeft: Padding.p_76xl,
    paddingTop: Padding.p_11xs,
    paddingRight: Padding.p_75xl,
    paddingBottom: Padding.p_11xs,
    zIndex: 2,
    justifyContent: "center",
    flex: 1,
  },
  vectorParent: {
    paddingHorizontal: Padding.p_xs,
    paddingVertical: 0,
    flex: 1,
  },
  frameView: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_smi,
    marginTop: 6,
    overflow: "hidden",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  totalWrapper: {
    width: 45,
    justifyContent: "center",
  },
  text: {
    marginLeft: 1,
  },
  meatWrapper: {
    marginLeft: 1,
    justifyContent: "center",
    flex: 1,
  },
  frameGroup: {
    height: 17,
    paddingLeft: Padding.p_4xs,
    alignSelf: "stretch",
    flexDirection: "row",
  },
  frameWrapper1: {
    borderRadius: Border.br_11xs,
    borderStyle: "solid",
    borderColor: Color.colorSilver,
    borderWidth: 1,
    paddingLeft: Padding.p_9xs,
    paddingRight: Padding.p_xl,
    marginTop: 6,
  },
});

export default FoodInputScreenContent;
