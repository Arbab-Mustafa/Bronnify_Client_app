"use client"

import { useState, useEffect } from "react"

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000 // 24 hours

interface CacheItem<T> {
  data: T
  timestamp: number
}

export function useCachedData<T>(key: string, initialData: T, fetchFn?: () => Promise<T>) {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to get data from localStorage
        const cachedData = localStorage.getItem(`bronify-${key}`)

        if (cachedData) {
          const parsedCache: CacheItem<T> = JSON.parse(cachedData)

          // Check if cache is still valid
          if (Date.now() - parsedCache.timestamp < CACHE_EXPIRATION) {
            setData(parsedCache.data)
            setLoading(false)
            return
          }
        }

        // If no valid cache or fetchFn not provided, use initial data
        if (!fetchFn) {
          setData(initialData)
          setLoading(false)
          return
        }

        // Fetch fresh data
        const freshData = await fetchFn()

        // Save to cache
        const cacheItem: CacheItem<T> = {
          data: freshData,
          timestamp: Date.now(),
        }

        localStorage.setItem(`bronify-${key}`, JSON.stringify(cacheItem))

        setData(freshData)
        setLoading(false)
      } catch (err) {
        console.error("Error loading data:", err)
        setError(err instanceof Error ? err : new Error(String(err)))

        // Use initial data on error
        setData(initialData)
        setLoading(false)
      }
    }

    loadData()
  }, [key, initialData, fetchFn])

  return { data, loading, error }
}

