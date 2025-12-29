import type React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Text, View, StatusBar, Platform } from "react-native"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
import { FontAwesome6 } from "@expo/vector-icons"

import FoodInputScreen from "./src/screens/FoodInputScreen"
import FoodInfoScreen from "./src/screens/FoodInfoScreen"
import SearchScreen from "./src/screens/SearchScreen"
import CalculatorScreen from "./src/screens/CalculatorScreen"
import InfoAndSupportScreen from "./src/screens/InfoAndSupportScreen"
import RecipeScreen from "./src/screens/RecipeScreen"
import CustomRatioScreen from "./src/screens/CustomRatioScreen"
import FAQScreen from "./src/screens/FAQScreen"
import RawFeedingFAQScreen from "./src/screens/RawFeedingFAQScreen"
import FoodCalculatorScreen from "./src/screens/FoodCalculatorScreen"

import { UnitProvider } from "./src/context/UnitContext"
import { SaveProvider } from "./src/context/SaveContext"
import { RecipeProvider } from "./src/context/RecipeContext"
import { PetFoodBowlIcon } from "./src/components/icons/PetFoodBowlIcon"

// Define the ingredient type
interface Ingredient {
  name: string
}

// Define the stack's parameter list
export type RootStackParamList = {
  FoodInputScreen: { fromRecipe?: boolean }
  FoodInfoScreen: { ingredient: Ingredient; editMode: boolean }
  SearchScreen: undefined
  CalculatorScreen: { meat: number; bone: number; organ: number }
  CustomRatioScreen: {
    onSave?: (meat: number, bone: number, organ: number, plantMatter: number, includePlantMatter: boolean) => void
    currentValues?: {
      meat: number
      bone: number
      organ: number
      plantMatter: number
      includePlantMatter: boolean
    }
  }
  FAQScreen: undefined
  RawFeedingFAQScreen: undefined
  InfoAndSupportScreen: undefined
  RecipeScreen: undefined
  FoodCalculatorScreen: undefined
}

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

// ---------- BOTTOM TAB NAV ----------
const HomeTabs = () => {
  const insets = useSafeAreaInsets()
  const isIOS = Platform.OS === "ios"
  const isPad = Platform.isPad

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          let label: string
          let icon: React.ReactNode

          // Unified container styles
          const tabStyle = {
            alignItems: "center" as const,
            justifyContent: "center" as const,
            flex: 1,
            minWidth: isPad ? 110 : 80, // prevent wrapping on iPad
          }

          const textStyle = {
            color: "white",
            fontSize: isPad ? 12 : 10,
            marginTop: 2,
            fontFamily: "Roboto-Regular",
            textAlign: "center" as const,
            flexWrap: "nowrap" as const,
            includeFontPadding: false,
          }

          if (route.name === "Home") {
            label = "Feeding Calc"
            icon = <FontAwesome6 name="calculator" size={isPad ? 26 : 22} color="white" />
          } else if (route.name === "Recipe") {
            label = "Recipes"
            icon = <FontAwesome6 name="book" size={isPad ? 26 : 22} color="white" />
          } else if (route.name === "FoodCalculator") {
            label = "Daily Portions"
            icon = (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: isPad ? 30 : 24,
                }}
              >
                <PetFoodBowlIcon
                  size={isPad ? 36 : 42}
                  color="white"
                  style={{
                    marginBottom: isPad ? 0 : 0,
                  }}
                />
              </View>
            )
          } else if (route.name === "InfoAndSupport") {
            label = "Support"
            icon = <FontAwesome6 name="gear" size={isPad ? 26 : 22} color="white" />
          }

          return (
            <View style={tabStyle}>
              {icon}
              <Text
                style={textStyle}
                numberOfLines={1}
                ellipsizeMode="clip"
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {label}
              </Text>
            </View>
          )
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#000080",
          height: isIOS ? 75 : 60,
          paddingBottom: isIOS ? insets.bottom / 2 : 8,
          paddingTop: 6,
          flexDirection: "row",
          justifyContent: "space-evenly",
        },
      })}
    >
      <Tab.Screen name="Home" component={FoodInputScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{
          title: "Recipes",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "white" },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
            color: "black",
            fontFamily: "Roboto-Medium",
          },
        }}
      />
      <Tab.Screen
        name="FoodCalculator"
        component={FoodCalculatorScreen}
        options={{
          title: "Daily Portions",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "white" },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
            color: "black",
            fontFamily: "Roboto-Medium",
          },
        }}
      />
      <Tab.Screen
        name="InfoAndSupport"
        component={InfoAndSupportScreen}
        options={{
          title: "Support",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "white" },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
            color: "black",
            fontFamily: "Roboto-Medium",
          },
        }}
      />
    </Tab.Navigator>
  )
}

// ---------- APP ROOT ----------
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <UnitProvider>
        <SaveProvider>
          <RecipeProvider>
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
                  headerStyle: { backgroundColor: "white" },
                  headerBackTitle: "Back",
                }}
              >
                <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
                <Stack.Screen name="FoodInfoScreen" component={FoodInfoScreen} options={{ title: "Food Information" }} />
                <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: "Search Ingredients" }} />
                <Stack.Screen name="CalculatorScreen" component={CalculatorScreen} />
                <Stack.Screen name="CustomRatioScreen" component={CustomRatioScreen} options={{ title: "Custom Ratio" }} />
                <Stack.Screen name="InfoAndSupportScreen" component={InfoAndSupportScreen} />
                <Stack.Screen name="RecipeScreen" component={RecipeScreen} />
                <Stack.Screen name="FAQScreen" component={FAQScreen} options={{ title: "App FAQs" }} />
                <Stack.Screen name="RawFeedingFAQScreen" component={RawFeedingFAQScreen} options={{ title: "Raw Feeding FAQs" }} />
                <Stack.Screen name="FoodCalculatorScreen" component={FoodCalculatorScreen} options={{ title: "Daily Portions" }} />
              </Stack.Navigator>
            </NavigationContainer>
          </RecipeProvider>
        </SaveProvider>
      </UnitProvider>
    </SafeAreaProvider>
  )
}

export default App
