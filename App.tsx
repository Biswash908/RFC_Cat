"use client";

if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  console.debug = () => {};
}

import type React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, StatusBar } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

import FoodInputScreen from "./screens/FoodInputScreen";
import FoodInfoScreen from "./screens/FoodInfoScreen";
import SearchScreen from "./screens/SearchScreen";
import CalculatorScreen from "./screens/CalculatorScreen";
import InfoAndSupportScreen from "./screens/InfoAndSupportScreen";
import RecipeScreen from "./screens/RecipeScreen";
import CustomRatioScreen from "./screens/CustomRatioScreen";
import FAQScreen from "./screens/FAQScreen";
import RawFeedingFAQScreen from "./screens/RawFeedingFAQScreen";

import { UnitProvider } from "./UnitContext";
import { SaveProvider } from "./SaveContext";

// Define the ingredient type
interface Ingredient {
  name: string;
}

// Define the stack's parameter list
export type RootStackParamList = {
  FoodInputScreen: { fromRecipe?: boolean };
  FoodInfoScreen: { ingredient: Ingredient; editMode: boolean };
  SearchScreen: undefined;
  CalculatorScreen: { meat: number; bone: number; organ: number };
  CustomRatioScreen: {
    onSave?: (
      meat: number,
      bone: number,
      organ: number,
      plantMatter: number,
      includePlantMatter: boolean
    ) => void;
    currentValues?: {
      meat: number;
      bone: number;
      organ: number;
      plantMatter: number;
      includePlantMatter: boolean;
    };
  };
  FAQScreen: undefined;
  RawFeedingFAQScreen: undefined;
  InfoAndSupportScreen: undefined;
  RecipeScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator (Home, Info & Support, Recipe)
const HomeTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          let iconName: string;
          let label: string;

          if (route.name === "Home") {
            iconName = "house";
            label = "Home";
          } else if (route.name === "InfoAndSupport") {
            iconName = "gear";
            label = "Support";
          } else if (route.name === "Recipe") {
            iconName = "book";
            label = "Recipes";
          }

          return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <FontAwesome6
                name={iconName}
                size={22}
                color={"white"}
                style={{ textAlign: "center" }}
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  marginTop: 2,
                  fontFamily: "Roboto-Regular",
                }}
              >
                {label}
              </Text>
            </View>
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#000080",
          height: 60 + insets.bottom, // dynamic height
          paddingBottom: insets.bottom, // safe area padding
        },
      })}
    >
      <Tab.Screen
        name="InfoAndSupport"
        component={InfoAndSupportScreen}
        options={{
          title: "Support",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
            color: "black",
            fontFamily: "Roboto-Medium",
          },
        }}
      />
      <Tab.Screen name="Home" component={FoodInputScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{
          title: "Recipes",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
            color: "black",
            fontFamily: "Roboto-Medium",
          },
        }}
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <UnitProvider>
        <SaveProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="HomeTabs"
              screenOptions={{
                headerTitleStyle: {
                  fontSize: 20,
                  fontWeight: "600",
                  color: "black",
                  fontFamily: "Roboto-Medium",
                },
                headerTitleAlign: "center",
                headerStyle: {
                  backgroundColor: "white",
                },
                headerBackTitle: "Back",
              }}
            >
              <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
              <Stack.Screen
                name="FoodInfoScreen"
                component={FoodInfoScreen}
                options={{ title: "Food Information" }}
              />
              <Stack.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{ title: "Search Ingredients" }}
              />
              <Stack.Screen name="CalculatorScreen" component={CalculatorScreen} />
              <Stack.Screen
                name="CustomRatioScreen"
                component={CustomRatioScreen}
                options={{ title: "Custom Ratio" }}
              />
              <Stack.Screen name="InfoAndSupportScreen" component={InfoAndSupportScreen} />
              <Stack.Screen name="RecipeScreen" component={RecipeScreen} />
              <Stack.Screen name="FAQScreen" component={FAQScreen} options={{ title: "App FAQs" }} />
              <Stack.Screen
                name="RawFeedingFAQScreen"
                component={RawFeedingFAQScreen}
                options={{ title: "Raw Feeding FAQs" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SaveProvider>
      </UnitProvider>
    </SafeAreaProvider>
  );
};

export default App;
