"use client"

import { useState, useEffect } from "react"

export interface Revenue {
  id: string
  date: string
  client: string
  description: string
  amount: number
  createdAt: string
}

export interface Cost {
  id: string
  date: string
  category: string
  description: string
  amount: number
  createdAt: string
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue))
      } catch (error) {
        console.error(error)
      }
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
