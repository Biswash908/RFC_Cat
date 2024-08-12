// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FoodInputScreen from './screens/FoodInputScreen';
import FoodInfoScreen from './screens/FoodInfoScreen';
import SearchScreen from './screens/SearchScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import { UnitProvider } from './UnitContext';

export type RootStackParamList = {
  FoodInputScreen: undefined;
  FoodInfoScreen: { ingredient: Ingredient; editMode: boolean };
  SearchScreen: undefined;
  CalculatorScreen: { meat: number; bone: number; organ: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <UnitProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="FoodInputScreen">
          <Stack.Screen 
            name="FoodInputScreen" 
            component={FoodInputScreen}
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
            name="CalculatorScreen" 
            component={CalculatorScreen} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UnitProvider>
  );
};

export default App;
