import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // UUID generation

type Recipe = {
  id: string; // Recipe ID (unique per recipe)
  name: string;
  ingredients: string;
  userId: string; // Unique ID for device/user
};

type SaveContextType = {
  customRatios: { meat: number; bone: number; organ: number };
  recipes: Recipe[];
  userId: string | null; // Unique device/user ID
  saveCustomRatios: (newRatios: { meat: number; bone: number; organ: number }) => void;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'userId'>) => void;
  fetchAllRecipes: () => Promise<void>;
};

const SaveContext = createContext<SaveContextType | undefined>(undefined);

export const SaveProvider: React.FC = ({ children }) => {
  const [customRatios, setCustomRatios] = useState({
    meat: 0,
    bone: 0,
    organ: 0,
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedRatios = await AsyncStorage.getItem('customRatios');
      if (storedRatios) setCustomRatios(JSON.parse(storedRatios));

      const storedRecipes = await AsyncStorage.getItem('recipes');
      if (storedRecipes) setRecipes(JSON.parse(storedRecipes));

      let storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        storedUserId = uuidv4();
        await AsyncStorage.setItem('userId', storedUserId);
      }
      setUserId(storedUserId);
    };
    loadData();
  }, []);

  const saveCustomRatios = (newRatios: { meat: number; bone: number; organ: number }) => {
    setCustomRatios(newRatios);
    AsyncStorage.setItem('customRatios', JSON.stringify(newRatios));
  };

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'userId'>) => {
    if (!userId) return;

    const newRecipe = {
      ...recipe,
      id: uuidv4(),
      userId,
    };

    setRecipes((prev) => [...prev, newRecipe]);
    AsyncStorage.setItem('recipes', JSON.stringify([...recipes, newRecipe]));

    try {
      await axios.post('http://localhost/save_recipe.php', newRecipe);
    } catch (error) {
      console.error('Error saving recipe to database:', error);
    }
  };

  const fetchAllRecipes = async () => {
    if (!userId) return;

    try {
      const response = await axios.get('http://localhost/get_recipes.php', {
        params: { userId },
      });
      const dbRecipes = response.data;

      setRecipes(dbRecipes);
      AsyncStorage.setItem('recipes', JSON.stringify(dbRecipes));
    } catch (error) {
      console.error('Error fetching recipes from database:', error);
    }
  };

  return (
    <SaveContext.Provider
      value={{
        customRatios,
        recipes,
        userId,
        saveCustomRatios,
        addRecipe,
        fetchAllRecipes,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};

export const useSaveContext = () => {
  const context = useContext(SaveContext);
  if (!context) {
    throw new Error('useSaveContext must be used within a SaveProvider');
  }
  return context;
};