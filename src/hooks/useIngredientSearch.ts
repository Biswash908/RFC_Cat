import { useState, useMemo } from "react"
import { INGREDIENTS_DATABASE } from "../constants/ingredients-data"

export const useIngredientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredIngredients = useMemo(() => {
    if (!searchQuery.trim()) {
      return INGREDIENTS_DATABASE
    }

    return INGREDIENTS_DATABASE.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    filteredIngredients,
  }
}
