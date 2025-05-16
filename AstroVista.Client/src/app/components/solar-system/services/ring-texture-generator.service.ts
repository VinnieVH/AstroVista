import { Injectable } from "@angular/core"
import * as THREE from "three"

@Injectable({
  providedIn: "root",
})
export class RingTextureGeneratorService {
  private textureCache: Map<string, THREE.CanvasTexture> = new Map();
  constructor() {}

  /**
   * Generates a procedural texture for planetary rings
   */
  generateRingTexture(
    options: {
      width?: number
      height?: number
      color?: THREE.Color | string | number
      backgroundColor?: THREE.Color | string | number
      opacity?: number
      noise?: number
      gaps?: {
        count: number
        opacity: number
        width: number
        variance: number
      }
      dustDensity?: number
      clumps?: {
        count: number
        size: number
        opacity: number
      }
      seed?: number
    } = {},
  ): THREE.CanvasTexture {
    // Generate a cache key based on the options
    const cacheKey = this.generateCacheKey(options)

    // Check if we already have this texture in the cache
    const cachedTexture = this.textureCache.get(cacheKey)
    if (cachedTexture) {
      return cachedTexture
    }

    // Set default options
    const config = {
      width: 1024,
      height: 128,
      color: new THREE.Color(0xffffff),
      backgroundColor: new THREE.Color(0x000000),
      opacity: 0.8,
      noise: 0.2,
      gaps: {
        count: 5,
        opacity: 0.3,
        width: 0.05,
        variance: 0.02,
      },
      dustDensity: 0.7,
      clumps: {
        count: 8,
        size: 0.1,
        opacity: 0.9,
      },
      seed: Math.random() * 1000,
      ...options,
    }

    // Create canvas and get context
    const canvas = document.createElement("canvas")
    canvas.width = config.width
    canvas.height = config.height
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      console.error("Could not get canvas context")
      // Return a simple fallback texture
      return new THREE.CanvasTexture(canvas)
    }

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0)"
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Convert colors to CSS format
    const color = new THREE.Color(config.color)
    const backgroundColor = new THREE.Color(config.backgroundColor)
    const colorStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`
    const bgColorStyle = `rgb(${Math.floor(backgroundColor.r * 255)}, ${Math.floor(backgroundColor.g * 255)}, ${Math.floor(
      backgroundColor.b * 255,
    )})`

    // Create a seeded random function
    const seededRandom = this.createSeededRandom(config.seed)

    // Draw background (usually transparent or very dark)
    ctx.fillStyle = `rgba(${Math.floor(backgroundColor.r * 255)}, ${Math.floor(backgroundColor.g * 255)}, ${Math.floor(
      backgroundColor.b * 255,
    )}, 0.1)`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw base dust particles
    this.drawDustParticles(ctx, canvas, colorStyle, config.dustDensity, config.opacity, seededRandom)

    // Draw gaps
    this.drawGaps(ctx, canvas, config.gaps, seededRandom)

    // Draw clumps (denser regions)
    this.drawClumps(ctx, canvas, colorStyle, config.clumps, seededRandom)

    // Add noise
    if (config.noise > 0) {
      this.addNoise(ctx, canvas, config.noise, seededRandom)
    }

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)

    this.textureCache.set(cacheKey, texture)
    return texture
  }

  private generateCacheKey(options: any): string {
    return JSON.stringify(options)
  }

  /**
   * Creates a seeded random function for consistent procedural generation
   */
  private createSeededRandom(seed: number): () => number {
    return () => {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }
  }

  /**
   * Draws dust particles that form the base of the ring
   */
  private drawDustParticles(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    color: string,
    density: number,
    opacity: number,
    random: () => number,
  ): void {
    const particleCount = Math.floor(canvas.width * canvas.height * density * 0.01)

    for (let i = 0; i < particleCount; i++) {
      const x = Math.floor(random() * canvas.width)
      const y = Math.floor(random() * canvas.height)
      const size = random() * 2 + 0.5
      const particleOpacity = (random() * 0.5 + 0.5) * opacity

      ctx.fillStyle = color.replace("rgb", "rgba").replace(")", `, ${particleOpacity})`)
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  /**
   * Draws gaps in the rings
   */
  private drawGaps(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    gaps: { count: number; opacity: number; width: number; variance: number },
    random: () => number,
  ): void {
    ctx.globalCompositeOperation = "destination-out"

    for (let i = 0; i < gaps.count; i++) {
      const x = Math.floor(random() * canvas.width)
      const width = Math.floor((gaps.width + random() * gaps.variance) * canvas.width)
      const opacity = gaps.opacity + random() * 0.2

      const gradient = ctx.createLinearGradient(x - width / 2, 0, x + width / 2, 0)
      gradient.addColorStop(0, `rgba(0, 0, 0, 0)`)
      gradient.addColorStop(0.5, `rgba(0, 0, 0, ${opacity})`)
      gradient.addColorStop(1, `rgba(0, 0, 0, 0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(x - width / 2, 0, width, canvas.height)
    }

    ctx.globalCompositeOperation = "source-over"
  }

  /**
   * Draws denser clumps in the rings
   */
  private drawClumps(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    color: string,
    clumps: { count: number; size: number; opacity: number },
    random: () => number,
  ): void {
    for (let i = 0; i < clumps.count; i++) {
      const x = Math.floor(random() * canvas.width)
      const y = Math.floor(random() * canvas.height)
      const size = Math.floor(clumps.size * canvas.height)

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, color.replace("rgb", "rgba").replace(")", `, ${clumps.opacity})`))
      gradient.addColorStop(1, color.replace("rgb", "rgba").replace(")", `, 0)`))

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.ellipse(x, y, size, size / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  /**
   * Adds noise to the texture for a more natural look
   */
  private addNoise(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    amount: number,
    random: () => number,
  ): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        // Only add noise to non-transparent pixels
        const noise = (random() * 2 - 1) * amount * 255
        data[i] = Math.max(0, Math.min(255, data[i] + noise))
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  /**
   * Generate a texture specifically for Jupiter's rings
   */
  generateJupiterRingTexture(): THREE.CanvasTexture {
    return this.generateRingTexture({
      color: 0xbbbbbb,
      backgroundColor: 0x222222,
      opacity: 0.3,
      noise: 0.1,
      dustDensity: 0.4,
      gaps: {
        count: 3,
        opacity: 0.7,
        width: 0.03,
        variance: 0.01,
      },
      clumps: {
        count: 5,
        size: 0.05,
        opacity: 0.4,
      },
      seed: 12345,
    })
  }

  /**
   * Generate a texture specifically for Uranus's rings
   */
  generateUranusRingTexture(): THREE.CanvasTexture {
    return this.generateRingTexture({
      color: 0xaaaacc,
      backgroundColor: 0x222233,
      opacity: 0.5,
      noise: 0.15,
      dustDensity: 0.6,
      gaps: {
        count: 8,
        opacity: 0.8,
        width: 0.02,
        variance: 0.01,
      },
      clumps: {
        count: 3,
        size: 0.08,
        opacity: 0.6,
      },
      seed: 67890,
    })
  }

  /**
   * Generate a texture specifically for Neptune's rings
   */
  generateNeptuneRingTexture(): THREE.CanvasTexture {
    return this.generateRingTexture({
      color: 0x8888aa,
      backgroundColor: 0x111122,
      opacity: 0.4,
      noise: 0.2,
      dustDensity: 0.5,
      gaps: {
        count: 4,
        opacity: 0.9,
        width: 0.04,
        variance: 0.02,
      },
      clumps: {
        count: 6,
        size: 0.12,
        opacity: 0.7,
      },
      seed: 24680,
    })
  }

  dispose(): void {
    // Dispose of all cached textures
    this.textureCache.forEach(texture => {
      if (texture && texture.dispose) {
        // Dispose of the texture to free GPU memory
        texture.dispose()

        // If the texture has a source (like a canvas), we might need to clean that up too
        if (texture.source && texture.source.data) {
          const source = texture.source.data

          // If the source is a canvas, we can clear it
          if (source instanceof HTMLCanvasElement) {
            const ctx = source.getContext('2d')
            if (ctx) {
              ctx.clearRect(0, 0, source.width, source.height)
            }
          }
        }
      }
    })

    // Clear the cache
    this.textureCache.clear()

    console.log('RingTextureGeneratorService: All textures disposed')
  }

}
