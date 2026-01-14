/**
 * Geocoding utility for converting addresses to coordinates
 * Currently uses a placeholder implementation
 * TODO: Integrate with a geocoding service (Google Maps, Mapbox, or Nominatim)
 */

export type Coordinates = {
  latitude: number
  longitude: number
}

/**
 * Default coordinates for Casablanca, Morocco
 * Used as fallback when geocoding fails or address is unavailable
 */
const DEFAULT_COORDINATES: Coordinates = {
  latitude: 33.5731,
  longitude: -7.5898,
}

/**
 * Convert an address string to coordinates
 * @param address - Full address string
 * @returns Promise<Coordinates> - Latitude and longitude
 * 
 * TODO: Implement actual geocoding service integration
 * Options:
 * 1. Google Maps Geocoding API
 * 2. Mapbox Geocoding API  
 * 3. Nominatim (OpenStreetMap) - Free
 */
export async function geocodeAddress(address: string): Promise<Coordinates> {
  if (!address || address.trim() === '') {
    return DEFAULT_COORDINATES
  }

  try {
    // Placeholder implementation
    // In production, call actual geocoding API
    
    // Example with Nominatim (free OpenStreetMap service):
    // const response = await fetch(
    //   `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    // )
    // const data = await response.json()
    // if (data && data.length > 0) {
    //   return {
    //     latitude: parseFloat(data[0].lat),
    //     longitude: parseFloat(data[0].lon),
    //   }
    // }

    console.warn('Geocoding not implemented, using default coordinates for:', address)
    return DEFAULT_COORDINATES
  } catch (error) {
    console.error('Geocoding failed:', error)
    return DEFAULT_COORDINATES
  }
}

/**
 * Get coordinates from order data
 * @param deliveryAddress - Delivery address from order
 * @returns Coordinates
 */
export function getCoordinatesFromOrder(deliveryAddress: string | null | undefined): Coordinates {
  // TODO: Call geocodeAddress when implemented
  // For now, return default
  if (!deliveryAddress) {
    return DEFAULT_COORDINATES
  }
  
  return DEFAULT_COORDINATES
}

/**
 * Get organization's default location
 * Should be fetched from organization settings
 * @param organizationId - Organization ID
 * @returns Coordinates
 */
export function getOrganizationLocation(organizationId?: string): Coordinates {
  // TODO: Fetch from organization settings API
  return DEFAULT_COORDINATES
}
