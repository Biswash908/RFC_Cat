// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FoodInputScreen from './screens/FoodInputScreen';
import FoodInfoScreen from './screens/FoodInfoScreen';
import SearchScreen from './screens/SearchScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FoodInputScreen">
        <Stack.Screen
          name="FoodInputScreen"
          component={FoodInputScreen}
          options={{ title: 'Food Input' }}
        />
        <Stack.Screen
          name="FoodInfoScreen"
          component={FoodInfoScreen}
          options={{ title: 'Food Information' }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ title: 'Search Food' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
