import { Apple, Egg, Beef, Fish, Milk, Coffee, Banana, Salad } from "lucide-react"

// Helper function to get food icon
export const getFoodIcon = (foodName: string) => {
  const name = foodName.toLowerCase()
  if (name.includes("egg")) return Egg
  if (name.includes("beef") || name.includes("steak")) return Beef
  if (name.includes("fish") || name.includes("salmon") || name.includes("tuna") || name.includes("cod")) return Fish
  if (name.includes("milk") || name.includes("yogurt") || name.includes("cheese")) return Milk
  if (name.includes("coffee")) return Coffee
  if (name.includes("banana")) return Banana
  if (name.includes("salad") || name.includes("spinach") || name.includes("broccoli") || name.includes("vegetables"))
    return Salad
  return Apple
}
