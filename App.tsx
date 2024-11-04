import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Platform } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import RecipeContentScreen from './screens/RecipeContentScreen';
import RecipeFoodInfoScreen from './screens/RecipeFoodInfoScreen';
import RecipeSearchScreen from './screens/RecipeSearchScreen';
import FoodInputScreen from './screens/FoodInputScreen';
import FoodInfoScreen from './screens/FoodInfoScreen';
import SearchScreen from './screens/SearchScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import InfoAndSupportScreen from './screens/InfoAndSupportScreen'; // Merged screen
import RecipeScreen from './screens/RecipeScreen'; // Recipe screen
import CustomRatioScreen from './screens/CustomRatioScreen';
import FAQScreen from './screens/FAQScreen';
import RawFeedingFAQScreen from './screens/RawFeedingFAQScreen';
import { UnitProvider } from './UnitContext';
import { SaveProvider } from './SaveContext';

// Define the stack's parameter list
export type RootStackParamList = {
  FoodInputScreen: { fromRecipe?: boolean }; // Added fromRecipe param
  FoodInfoScreen: { ingredient: Ingredient; editMode: boolean };
  SearchScreen: undefined;
  CalculatorScreen: { meat: number; bone: number; organ: number };
  FAQScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator (Home, Info & Support, Recipe)
const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;

          if (route.name === 'Home') {
            iconName = 'house';
            label = 'Home';
          } else if (route.name === 'InfoAndSupport') {
            iconName = 'gear';
            label = 'Support';
          } else if (route.name === 'Recipe') {
            iconName = 'book';
            label = 'Recipes';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: 50 }}>
              <FontAwesome6
                name={iconName}
                size={28} // Slightly reduced size for consistency
                color={ 'white' } // Optionally, use color change on focus
                style={{ textAlign: 'center' }}
              />
              <Text style={{ color: 'white', fontSize: 12 }}>{label}</Text>
            </View>
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#000080',
          paddingVertical: 5,
          height: Platform.OS === 'ios' ? 70 : 60, // Adjust height for platform differences
        },
      })}
    >
      <Tab.Screen
        name="InfoAndSupport"
        component={InfoAndSupportScreen}
        options={{
          title: 'Support',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: '600',
            color: 'black',
          },
        }}
      />
      <Tab.Screen
        name="Home"
        component={FoodInputScreen}
        options={{ headerShown: false
        }}
      />
      <Tab.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{
          title: 'Recipes',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: '600',
            color: 'black',
          },
        }}
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <UnitProvider>
      <SaveProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeTabs">
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FoodInfoScreen"
            component={FoodInfoScreen}
            options={{ title: 'Food Information' }}
          />
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{ title: 'Search Ingredients' }}
          />
          <Stack.Screen
            name="RecipeFoodInfoScreen"
            component={RecipeFoodInfoScreen}
            options={{ title: 'Food Information' }}
          />
          <Stack.Screen
            name="RecipeSearchScreen"
            component={RecipeSearchScreen}
            options={{ title: 'Search Ingredients' }}
          />
          <Stack.Screen name="CalculatorScreen" component={CalculatorScreen} />
          <Stack.Screen name="RecipeContentScreen" component={RecipeContentScreen} />
          <Stack.Screen name="CustomRatioScreen" component={CustomRatioScreen} />
          <Stack.Screen name="InfoAndSupportScreen" component={InfoAndSupportScreen} />
          <Stack.Screen name="RecipeScreen" component={RecipeScreen} />

          <Stack.Screen 
            name="FAQScreen" 
            component={FAQScreen}
            options={{ title: 'App FAQs' }} 
          />
          <Stack.Screen 
            name="RawFeedingFAQScreen" 
            component={RawFeedingFAQScreen}
            options={{title: 'Raw Feeding FAQs'}}
            />
        </Stack.Navigator>
      </NavigationContainer>
      </SaveProvider>
    </UnitProvider>
  );
};

export default App;
