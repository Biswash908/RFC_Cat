"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { View, StyleSheet, StatusBar, Platform, Dimensions, InteractionManager } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { CopilotStep, useCopilot } from "react-native-copilot"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useUnit } from "../context/UnitContext"
import { useSaveContext } from "../context/SaveContext"
import { TopBar } from "../components/food-input/ui/TopBar"
import { TotalBar } from "../components/food-input/ui/TotalBar"
import { IngredientList } from "../components/food-input/ui/IngredientList"
import { ActionButtons } from "../components/food-input/ui/ActionButtons"
import { SaveRecipeModal } from "../components/food-input/modals/SaveRecipeModal"
import { WalkthroughableView } from "../components/common/WalkthroughableView"
import { useFoodInputLogic } from "../hooks/useFoodInputLogic"
import { useRecipeSaving } from "../hooks/useRecipeSaving"
import { useRatioState } from "../hooks/useRatioState"
import { useRouteParams } from "../hooks/useRouteParams"
import { formatWeight } from "../utils/formatters"

const isIOS = Platform.OS === "ios"
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const isSmallDevice = SCREEN_WIDTH < 375
const scale = SCREEN_WIDTH / 375
const verticalScale = SCREEN_HEIGHT / 812
const rs = (size: number) => Math.round(size * (isIOS ? Math.min(scale, 1.2) : scale))
const vs = (size: number) => Math.round(size * (isIOS ? Math.min(verticalScale, 1.2) : verticalScale))

const FoodInputScreen: React.FC = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { unit: globalUnit } = useUnit()
  const { hasSeenFoodInputWalkthrough, setFoodInputWalkthroughSeen } = useSaveContext()
  const { start, copilotEvents } = useCopilot()
  const [containerReady, setContainerReady] = useState(false)
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false)
  const startedRef = useRef(false)

  const {
    ingredients,
    setIngredients,
    totalMeat,
    totalBone,
    totalOrgan,
    totalWeight,
    recipeName,
    setRecipeName,
    isModalVisible,
    setIsModalVisible,
    isSaving,
    setIsSaving,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    loadedRecipeIdRef,
    originalIngredientsRef,
    originalRatioRef,
    calculateTotals,
    checkForChanges,
    handleDeleteIngredient,
    handleClearScreen,
  } = useFoodInputLogic(globalUnit)

  const {
    newMeat,
    setNewMeat,
    newBone,
    setNewBone,
    newOrgan,
    setNewOrgan,
    selectedRatio,
    setSelectedRatio,
    tempRatio,
    setTempRatio,
    selectedRatioRef,
  } = useRatioState()

  const { handleSaveRecipe, createNewRecipe } = useRecipeSaving(
    ingredients,
    recipeName,
    setRecipeName,
    setIsSaving,
    setHasUnsavedChanges,
    setIsModalVisible,
    loadedRecipeIdRef,
    originalIngredientsRef,
    originalRatioRef,
  )

  useRouteParams(
    globalUnit,
    ingredients,
    setIngredients,
    calculateTotals,
    setRecipeName,
    setSelectedRatio,
    setNewMeat,
    setNewBone,
    setNewOrgan,
    setTempRatio,
    selectedRatioRef,
    loadedRecipeIdRef,
    originalIngredientsRef,
    originalRatioRef,
  )

  useEffect(() => {
    checkForChanges()
  }, [ingredients, newMeat, newBone, newOrgan, selectedRatio, checkForChanges])

  // Listen for navigation params to check if tutorial should be shown
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const params = navigation.getState().routes[navigation.getState().index]?.params as any
      if (params?.showTutorial) {
        setShouldShowTutorial(true)
      }
    })

    return unsubscribe
  }, [navigation])

  // Setup walkthrough - only shows when explicitly requested
  useEffect(() => {
    if (!containerReady || startedRef.current || !shouldShowTutorial) return

    startedRef.current = true

    const timeout = setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          // Extra delay ensures all layouts are fully measured on iOS
          setTimeout(() => {
            start()
          }, 100)
        })
      })
    }, 300)

    return () => clearTimeout(timeout)
  }, [containerReady, start, shouldShowTutorial])

  // Handle walkthrough completion
  useEffect(() => {
    const unsubscribe = copilotEvents.on("stop", async () => {
      await setFoodInputWalkthroughSeen(true)
    })

    return () => unsubscribe?.()
  }, [copilotEvents, setFoodInputWalkthroughSeen])

  const handleCalculate = async () => {
    const tempMeatRatio = await AsyncStorage.getItem("tempMeatRatio")
    const tempBoneRatio = await AsyncStorage.getItem("tempBoneRatio")
    const tempOrganRatio = await AsyncStorage.getItem("tempOrganRatio")
    const tempSelectedRatio = await AsyncStorage.getItem("tempSelectedRatio")

    let latestRatio
    if (tempMeatRatio && tempBoneRatio && tempOrganRatio && tempSelectedRatio) {
      latestRatio = {
        meat: Number(tempMeatRatio),
        bone: Number(tempBoneRatio),
        organ: Number(tempOrganRatio),
        selectedRatio: tempSelectedRatio,
        isUserDefined: true,
      }
    } else {
      latestRatio = {
        meat: newMeat,
        bone: newBone,
        organ: newOrgan,
        selectedRatio: selectedRatio,
        isUserDefined: true,
      }
    }

    navigation.navigate("CalculatorScreen", {
      meat: totalMeat,
      bone: totalBone,
      organ: totalOrgan,
      ratio: latestRatio,
    })
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View
        style={styles.container}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout
          if (width > 0 && height > 0 && !containerReady) {
            setContainerReady(true)
          }
        }}
      >
        <TopBar recipeName={recipeName} />

        <CopilotStep
          name="totalBar"
          order={1}
          text="This bar shows the total amount of ingredients in your recipe. Keep an eye here to make sure your recipe is balanced."
          verticalOffset={0}
        >
          <WalkthroughableView style={{ width: "100%", alignSelf: "stretch" }}>
            <TotalBar
              totalMeat={totalMeat}
              totalBone={totalBone}
              totalOrgan={totalOrgan}
              totalWeight={totalWeight}
              unit={globalUnit}
              formatWeight={formatWeight}
            />
          </WalkthroughableView>
        </CopilotStep>

        <View style={[styles.contentContainer, { paddingBottom: (isIOS ? 120 : 100) + insets.bottom }]}>
          <CopilotStep
            name="ingredientList"
            order={2}
            text="Here is the list of ingredients you've added. You can review, edit, or remove items before saving."
            verticalOffset={Platform.OS === "ios" ? 0 : 5}
          >
            <WalkthroughableView style={{ flex: 1, width: "100%" }}>
              <IngredientList
                ingredients={ingredients}
                formatWeight={formatWeight}
                onEdit={(ingredient) =>
                  navigation.navigate("FoodInfoScreen", {
                    ingredient: ingredient,
                    editMode: true,
                  })
                }
                onDelete={handleDeleteIngredient}
              />
            </WalkthroughableView>
          </CopilotStep>
        </View>

        <SaveRecipeModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={(name) => {
            createNewRecipe(newMeat, newBone, newOrgan, selectedRatio, name)
          }}
          currentName={recipeName}
          isUpdate={!!loadedRecipeIdRef.current}
        />

        <ActionButtons
          onAddIngredient={() => navigation.navigate("SearchScreen")}
          onSaveRecipe={() => handleSaveRecipe(newMeat, newBone, newOrgan, selectedRatio)}
          onCalculate={handleCalculate}
          onClear={handleClearScreen}
          isSaving={isSaving}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  contentContainer: {
    flex: 1,
  },
})

export default FoodInputScreen
