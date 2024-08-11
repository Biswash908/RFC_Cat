import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FoodInputScreen from './screens/FoodInputScreen';
import FoodInfoScreen from './screens/FoodInfoScreen';
import SearchScreen from './screens/SearchScreen';
import CalculatorScreen from './screens/CalculatorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FoodInputScreen">
        <Stack.Screen name="FoodInputScreen" component={FoodInputScreen}
          options={{ headerShown: false }}/>
        <Stack.Screen name="FoodInfoScreen" component={FoodInfoScreen}
          options={{ title: 'Food Information' }}/>
        <Stack.Screen name="SearchScreen" component={SearchScreen}
          options={{ title: 'Search Ingredients' }}/>
         <Stack.Screen name="CalculatorScreen" component={CalculatorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;