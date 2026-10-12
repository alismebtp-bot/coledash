import { useState, useEffect, useCallback } from 'react'

interface GeoLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

interface GeoLocationState {
  location: GeoLocation | null
  loading: boolean
  error: string | null
}

export function useGeoLocation() {
  const [state, setState] = useState<GeoLocationState>({
    location: null,
    loading: false,
    error: null,
  })

  const requestLocation = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
          loading: false,
          error: null,
        })
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return { ...state, refresh: requestLocation }
}
