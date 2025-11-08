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

// Bottom Tab Navigator (Home, Info & Support, Recipe)
const HomeTabs = () => {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          let label: string

          if (route.name === "Home") {
            label = "Feeding Calc"
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FontAwesome6 name="calculator" size={22} color={"white"} style={{ textAlign: "center" }} />
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
            )
          } else if (route.name === "Recipe") {
            label = "Recipes"
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FontAwesome6 name="book" size={22} color={"white"} style={{ textAlign: "center" }} />
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
            )
          } else if (route.name === "FoodCalculator") {
            label = "Daily Portions"
            return (
              <View style={{ alignItems: "center", justifyContent: "center", height: 40 }}>
  <View style={{ position: "absolute", top: -7 }}>
    <PetFoodBowlIcon size={40} color="white" />
  </View>
  <Text
    style={{
      color: "white",
      fontSize: 10,
      position: "absolute",
      bottom: 0,
      fontFamily: "Roboto-Regular",
    }}
  >
    {label}
  </Text>
</View>


            )
          } else if (route.name === "InfoAndSupport") {
            label = "Support"
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FontAwesome6 name="gear" size={22} color={"white"} style={{ textAlign: "center" }} />
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
            )
          }
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#000080",
          height: Platform.OS === "ios" ? 75 : 60,
          paddingBottom: Platform.OS === "ios" ? insets.bottom / 2 : 8,
          paddingTop: 6,
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
      <Tab.Screen
        name="FoodCalculator"
        component={FoodCalculatorScreen}
        options={{
          title: "Daily Portions",
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
    </Tab.Navigator>
  )
}

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
                <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: "Search Ingredients" }} />
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
                <Stack.Screen
                  name="FoodCalculatorScreen"
                  component={FoodCalculatorScreen}
                  options={{ title: "Daily Portions" }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </RecipeProvider>
        </SaveProvider>
      </UnitProvider>
    </SafeAreaProvider>
  )
}

export default App
