export interface CelestialBody {
  id: string
  name: string
  type: "star" | "planet" | "dwarf-planet" | "moon" | "asteroid" | "comet"
  diameter: number // in km
  mass?: number // in kg
  distanceFromSun?: number // in million km
  orbitalPeriod?: number // in Earth days
  rotationPeriod?: number // in Earth days
  description: string,

  // For visualization
  radius: number // scaled radius for visualization
  color: number // hex color
  orbitRadius: number // scaled orbit radius for visualization
  orbitalSpeed: number // orbital speed for animation
  rotationSpeed: number // rotation speed for animation
  moons?: CelestialBody[] // moons orbiting this body
  texturePath: string // path to texture file

  // Ring system
  rings?:
    | boolean
    | {
    innerRadius: number
    outerRadius: number
    texture?: string
    color?: number
    tilt?: number // in radians
  }
}
