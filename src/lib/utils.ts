import { IUser } from "@/types/user"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createGuess = (): IUser => {
  const user = {
    id: new Date().getTime().toString(),
    name: `Guess_${Math.floor(Math.random() * 10000)}`
  }
  localStorage.setItem("user_info", JSON.stringify(user))
  return {
    id: user.id,
    name: user.name
  }
}

export const getUserInfo = (): { id: string; name: string } => {
  if (typeof window !== "undefined") {
    if (!localStorage.getItem("user_info")) {
      return createGuess()
    } else {
      return JSON.parse(localStorage.getItem("user_info") || "{}")
    }
  }
  return { id: "", name: ""}
}

export const getOrdinalSuffix = (number:number) => {
  if (number === 1) {
      return number + "st";
  } else if (number === 2) {
      return number + "nd";
  } else if (number === 3) {
      return number + "rd";
  } else {
      return number + "th";
  }
}
