import {ElementRef, Injectable, NgZone} from "@angular/core"
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import {CelestialBodyService} from "../../../api/celestial-body.service"
import {TextureLoaderService} from "./texture-loader.service"
import {CelestialBody} from "../../../models/celestial-body.model"
import {BehaviorSubject} from "rxjs"
import {RingTextureGeneratorService} from './ring-texture-generator.service';

@Injectable()
export class SolarSystemService {
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private controls!: OrbitControls
  private animationFrameId!: number
  private raycaster = new THREE.Raycaster()
  private mouse = new THREE.Vector2()
  private celestialBodies: Map<string, THREE.Object3D> = new Map()
  private clock = new THREE.Clock()
  private asteroidBelt!: THREE.Object3D
  private cameraAnimationInProgress = false
  private initialCameraPosition = new THREE.Vector3(0, 30, 50)
  private rendererContainer!: ElementRef

  private selectedBodySubject = new BehaviorSubject<CelestialBody | null>(null)
  public selectedBody$ = this.selectedBodySubject.asObservable()

  private mousePositionSubject = new BehaviorSubject<{ x: number; y: number }>({ x: 0, y: 0 })
  public mousePosition$ = this.mousePositionSubject.asObservable()

  private isInfoVisibleSubject = new BehaviorSubject<boolean>(false)
  public isInfoVisible$ = this.isInfoVisibleSubject.asObservable()

  private focusedPlanetSubject = new BehaviorSubject<string | null>(null)
  public focusedPlanet$ = this.focusedPlanetSubject.asObservable()

  constructor(
    private celestialBodyService: CelestialBodyService,
    private textureLoaderService: TextureLoaderService,
    private ringTextureGeneratorService: RingTextureGeneratorService,
    private ngZone: NgZone,
  ) {}

  public async initialize(rendererContainer: ElementRef): Promise<void> {
    this.rendererContainer = rendererContainer

    // Collect all texture URLs that will be needed
    const textureUrls = this.collectTextureUrls()

    // Preload all textures
    await this.textureLoaderService.preloadTextures(textureUrls)

    // Initialize the scene
    this.initThreeJS()
    this.createSolarSystem()
    this.createAsteroidBelt()
    this.addEventListeners()

    // Start animation loop
    this.ngZone.runOutsideAngular(() => {
      this.animate()
    })
  }

  private collectTextureUrls(): string[] {
    const textureUrls: string[] = []

    // Add sun texture
    textureUrls.push("textures/sun.jpg")

    // Add planet textures
    const bodies = this.celestialBodyService.getCelestialBodies()
    bodies
      .filter((body) => body.type === "planet")
      .forEach((planet) => {
        textureUrls.push(`textures/${planet.name.toLowerCase()}.jpg`)

        // Add ring textures if the planet has rings
        if (planet.rings) {
          switch (planet.name) {
            case "Saturn":
              textureUrls.push("textures/saturn-ring.png")
              break
            case "Jupiter":
              textureUrls.push("textures/jupiter-ring.png")
              break
            case "Uranus":
              textureUrls.push("textures/uranus-ring.png")
              break
            case "Neptune":
              textureUrls.push("textures/neptune-ring.png")
              break
          }
        }

        // Add moon textures if any
        if (planet.moons && planet.moons.length > 0) {
          planet.moons.forEach((moon) => {
            if (moon.texturePath) {
              textureUrls.push(moon.texturePath)
            }
          })
        }
      })

    // Remove duplicates
    return [...new Set(textureUrls)]
  }

  public focusOnPlanet(planetId: string): void {
    if (planetId === "reset") {
      this.resetCameraPosition()
      this.focusedPlanetSubject.next(null)
      return
    }

    const planet = this.celestialBodyService.getCelestialBodyById(planetId)
    if (!planet) return

    const planetMesh = this.celestialBodies.get(planet.name)
    if (!planetMesh) return

    this.focusedPlanetSubject.next(planetId)
    this.animateCameraToPosition(planetMesh.position, planet)
  }

  private resetCameraPosition(): void {
    this.animateCameraToPosition(new THREE.Vector3(0, 0, 0), null, true)
  }

  private animateCameraToPosition(targetPosition: THREE.Vector3, planet: CelestialBody | null, isReset = false): void {
    if (this.cameraAnimationInProgress) return

    this.cameraAnimationInProgress = true

    // Store the starting position and target
    const startPosition = this.camera.position.clone()
    const startTarget = this.controls.target.clone()

    // Calculate the target position based on the planet
    let endPosition: THREE.Vector3
    let endTarget: THREE.Vector3

    if (isReset) {
      // Reset to initial overview position
      endPosition = this.initialCameraPosition.clone()
      endTarget = new THREE.Vector3(0, 0, 0)
    } else if (planet) {
      // Calculate appropriate distance based on planet size
      const distance = planet.radius * 10 // Adjust this multiplier as needed

      // Calculate a position that's offset from the planet
      // This creates a view that's slightly angled rather than directly above
      const offset = new THREE.Vector3(distance * 0.8, distance * 0.6, distance * 0.8)

      endPosition = targetPosition.clone().add(offset)
      endTarget = targetPosition.clone()
    } else {
      return // No valid target
    }

    // Animation parameters
    const duration = 1500 // milliseconds
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Use an easing function for smoother animation
      const easeProgress = this.easeInOutCubic(progress)

      // Interpolate position and target
      const newPosition = new THREE.Vector3().lerpVectors(startPosition, endPosition, easeProgress)
      const newTarget = new THREE.Vector3().lerpVectors(startTarget, endTarget, easeProgress)

      // Update camera and controls
      this.camera.position.copy(newPosition)
      this.controls.target.copy(newTarget)
      this.controls.update()

      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        this.cameraAnimationInProgress = false
      }
    }

    // Start animation
    animate()
  }

  // Easing function for smoother animation
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  private initThreeJS(): void {
    // Create scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0f1123)

    // Create camera
    const aspectRatio = this.getAspectRatio()
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000)
    this.camera.position.copy(this.initialCameraPosition)

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.getWidth(), this.getHeight())
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 5
    this.controls.maxDistance = 100

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1)
    this.scene.add(ambientLight)

    // Add directional light (sun)
    const sunLight = new THREE.PointLight(0xffffff, 2, 0, 0)
    sunLight.position.set(0, 0, 0)
    this.scene.add(sunLight)

    // Add stars background
    this.addStarField()
  }

  private addStarField(): void {
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
    })

    const starVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = (Math.random() - 0.5) * 2000
      starVertices.push(x, y, z)
    }

    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3))
    const stars = new THREE.Points(starGeometry, starMaterial)
    this.scene.add(stars)
  }

  private createSolarSystem(): void {
    // Get celestial body data from service
    const bodies = this.celestialBodyService.getCelestialBodies()

    // Create the Sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32)
    const sunTexture = this.textureLoaderService.getTexture("textures/sun.jpg")
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      map: sunTexture,
    })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    sun.userData = bodies.find((body) => body.name === "Sun") ?? {}
    this.scene.add(sun)
    this.celestialBodies.set("Sun", sun)

    // Create planets and their orbits
    bodies
      .filter((body) => body.type === "planet")
      .forEach((planet) => {
        // Create orbit path
        const orbitGeometry = new THREE.RingGeometry(planet.orbitRadius, planet.orbitRadius + 0.05, 128)
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0xeff5fe, // This is your ebony-50 color
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3,
        })
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
        orbit.rotation.x = Math.PI / 2
        this.scene.add(orbit)

        // Create planet
        const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32)
        const textureUrl = `textures/${planet.name.toLowerCase()}.jpg`
        const planetTexture = this.textureLoaderService.getTexture(textureUrl)

        // Create material with texture if available, otherwise use default material
        const planetMaterial = planetTexture
          ? new THREE.MeshStandardMaterial({
            color: planet.color,
            roughness: 0.7,
            metalness: 0.1,
            map: planetTexture,
          })
          : new THREE.MeshStandardMaterial({
            color: planet.color,
            roughness: 0.7,
            metalness: 0.1,
          })

        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial)

        // Position planet
        const angle = Math.random() * Math.PI * 2
        planetMesh.position.x = Math.cos(angle) * planet.orbitRadius
        planetMesh.position.z = Math.sin(angle) * planet.orbitRadius

        // Store planet data
        planetMesh.userData = planet
        this.scene.add(planetMesh)
        this.celestialBodies.set(planet.name, planetMesh)

        // Add rings if the planet has them
        if (planet.rings) {
          this.addPlanetaryRings(planetMesh, planet)
        }

        // Add moons if any
        if (planet.moons && planet.moons.length > 0) {
          planet.moons.forEach((moon) => {
            const moonGeometry = new THREE.SphereGeometry(moon.radius, 16, 16)

            // Get moon texture if available
            let moonMaterial: THREE.Material
            if (moon.texturePath) {
              const moonTexture = this.textureLoaderService.getTexture(moon.texturePath)
              moonMaterial = moonTexture
                ? new THREE.MeshStandardMaterial({
                  color: moon.color,
                  roughness: 0.8,
                  map: moonTexture,
                })
                : new THREE.MeshStandardMaterial({
                  color: moon.color,
                  roughness: 0.8,
                })
            } else {
              moonMaterial = new THREE.MeshStandardMaterial({
                color: moon.color,
                roughness: 0.8,
              })
            }

            const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)

            // Create moon orbit
            const moonOrbitGeometry = new THREE.RingGeometry(moon.orbitRadius, moon.orbitRadius + 0.02, 64)
            const moonOrbitMaterial = new THREE.MeshBasicMaterial({
              color: 0x5260d9, // This is your ebony-600 color
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.2,
            })
            const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial)
            moonOrbit.rotation.x = Math.PI / 2

            // Create a pivot for the moon to orbit around its planet
            const moonPivot = new THREE.Object3D()
            planetMesh.add(moonPivot)
            moonPivot.add(moonOrbit)
            moonPivot.add(moonMesh)

            // Position moon
            const moonAngle = Math.random() * Math.PI * 2
            moonMesh.position.x = Math.cos(moonAngle) * moon.orbitRadius
            moonMesh.position.z = Math.sin(moonAngle) * moon.orbitRadius

            // Store moon data
            moonMesh.userData = moon
            this.celestialBodies.set(moon.name, moonMesh)
          })
        }
      })
  }

  private addPlanetaryRings(planetMesh: THREE.Mesh, planet: any): void {
    if (!planet.rings) return

    console.log(`Adding rings to ${planet.name}`, planet.rings)

    // Define ring properties based on the planet
    let ringConfig = {
      innerRadius: 0,
      outerRadius: 0,
      texture: "",
      color: 0xffffff,
      tilt: 0,
      opacity: 0.8,
    }

    // Set specific ring properties for each planet
    switch (planet.name) {
      case "Saturn":
        ringConfig = {
          innerRadius: planet.radius * 1.2,
          outerRadius: planet.radius * 2.0,
          texture: "textures/saturn-ring.png", // Keep using the external texture for Saturn if available
          color: 0xffffff,
          tilt: 0.5,
          opacity: 0.9,
        }
        break
      case "Jupiter":
        ringConfig = {
          innerRadius: planet.radius * 1.1,
          outerRadius: planet.radius * 1.3,
          texture: "", // No texture path, will use procedural
          color: 0xaaaaaa,
          tilt: 0.05,
          opacity: 0.4,
        }
        break
      case "Uranus":
        ringConfig = {
          innerRadius: planet.radius * 1.2,
          outerRadius: planet.radius * 1.7,
          texture: "", // No texture path, will use procedural
          color: 0xbbbbbb,
          tilt: 1.7,
          opacity: 0.6,
        }
        break
      case "Neptune":
        ringConfig = {
          innerRadius: planet.radius * 1.1,
          outerRadius: planet.radius * 1.5,
          texture: "", // No texture path, will use procedural
          color: 0xaaaaaa,
          tilt: 0.5,
          opacity: 0.5,
        }
        break
      default:
        return // Skip if not one of the ringed planets
    }

    // Create ring geometry
    const ringGeometry = new THREE.RingGeometry(ringConfig.innerRadius, ringConfig.outerRadius, 64)

    // Create ring material
    let ringMaterial: THREE.Material
    let ringTexture: THREE.Texture | undefined

    // Try to get external texture first if specified
    if (ringConfig.texture) {
      ringTexture = this.textureLoaderService.getTexture(ringConfig.texture)
    }

    // If external texture is not available or not specified, generate procedural texture
    if (!ringTexture) {
      console.log(`Generating procedural ring texture for ${planet.name}`)

      // Generate appropriate procedural texture based on planet
      switch (planet.name) {
        case "Saturn":
          // For Saturn, we'll still try to use the external texture first
          // But if it's not available, we could generate a more complex one
          ringTexture = this.ringTextureGeneratorService.generateRingTexture({
            color: 0xd6c49e,
            backgroundColor: 0x000000,
            opacity: 0.9,
            noise: 0.1,
            dustDensity: 0.8,
            gaps: {
              count: 10,
              opacity: 0.8,
              width: 0.02,
              variance: 0.01,
            },
            clumps: {
              count: 12,
              size: 0.1,
              opacity: 0.8,
            },
            seed: 13579,
          })
          break
        case "Jupiter":
          ringTexture = this.ringTextureGeneratorService.generateJupiterRingTexture()
          break
        case "Uranus":
          ringTexture = this.ringTextureGeneratorService.generateUranusRingTexture()
          break
        case "Neptune":
          ringTexture = this.ringTextureGeneratorService.generateNeptuneRingTexture()
          break
      }
    }

    // Create material with texture
    if (ringTexture) {
      ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        color: ringConfig.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: ringConfig.opacity,
      })
      console.log(`Using texture for ${planet.name}'s rings`)
    } else {
      // Fallback to basic material if texture is not available
      ringMaterial = new THREE.MeshBasicMaterial({
        color: ringConfig.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: ringConfig.opacity,
      })
      console.warn(`Using fallback material for ${planet.name}'s rings`)
    }

    // Create ring mesh
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)

    // Set ring rotation
    ring.rotation.x = Math.PI / 2

    // Apply tilt if specified
    if (ringConfig.tilt) {
      ring.rotation.x += ringConfig.tilt
    }

    // Add ring to planet
    planetMesh.add(ring)

    console.log(`Added rings to ${planet.name}`)
  }

  private createAsteroidBelt(): void {
    const beltConfig = this.celestialBodyService.getAsteroidBeltConfig()

    // Create a container for all asteroids
    this.asteroidBelt = new THREE.Object3D()
    this.asteroidBelt.name = "Asteroid Belt"
    this.scene.add(this.asteroidBelt)

    // Create asteroid belt info for hover
    this.asteroidBelt.userData = {
      id: "asteroid-belt",
      name: "Asteroid Belt",
      type: "asteroid",
      diameter: 0,
      description:
        "The asteroid belt is a torus-shaped region in the Solar System, located roughly between the orbits of the planets Mars and Jupiter, that is occupied by a great many solid, irregularly shaped bodies, of many sizes but much smaller than planets, called asteroids or minor planets.",
      distanceFromSun: 350, // Average distance in million km
      orbitalPeriod: 2000, // Average orbital period in days
    }
    this.celestialBodies.set("Asteroid Belt", this.asteroidBelt)

    // Create asteroid geometries
    const asteroidGeometries = [
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
    ]

    // Create asteroid material
    const asteroidMaterial = new THREE.MeshStandardMaterial({
      color: beltConfig.color,
      roughness: 0.8,
      metalness: 0.2,
    })

    // Create asteroids
    for (let i = 0; i < beltConfig.count; i++) {
      // Randomly select a geometry
      const geometry = asteroidGeometries[Math.floor(Math.random() * asteroidGeometries.length)]

      // Create asteroid mesh
      const asteroid = new THREE.Mesh(geometry, asteroidMaterial)

      // Random position within the belt
      const radius = beltConfig.innerRadius + Math.random() * (beltConfig.outerRadius - beltConfig.innerRadius)
      const theta = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * beltConfig.height

      asteroid.position.x = radius * Math.cos(theta)
      asteroid.position.y = height
      asteroid.position.z = radius * Math.sin(theta)

      // Random rotation
      asteroid.rotation.x = Math.random() * Math.PI
      asteroid.rotation.y = Math.random() * Math.PI
      asteroid.rotation.z = Math.random() * Math.PI

      // Random scale (size)
      const scale = beltConfig.size.min + Math.random() * (beltConfig.size.max - beltConfig.size.min)
      asteroid.scale.set(scale, scale, scale)

      // Add to belt
      this.asteroidBelt.add(asteroid)
    }

    // Create belt orbit visualization with much more subtle appearance
    const beltOrbitGeometry = new THREE.RingGeometry(beltConfig.innerRadius, beltConfig.outerRadius, 128)
    const beltOrbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x343d7b, // This is your ebony-900 color
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08, // Much lower opacity
    })
    const beltOrbit = new THREE.Mesh(beltOrbitGeometry, beltOrbitMaterial)
    beltOrbit.rotation.x = Math.PI / 2
    this.scene.add(beltOrbit)
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate())

    const delta = this.clock.getDelta()

    // Update planet positions
    this.celestialBodyService
      .getCelestialBodies()
      .filter((body) => body.type === "planet")
      .forEach((planet) => {
        const planetMesh = this.celestialBodies.get(planet.name)
        if (planetMesh) {
          // Rotate planet around the sun
          const rotationSpeed = planet.orbitalSpeed * delta
          const currentX = planetMesh.position.x
          const currentZ = planetMesh.position.z

          // Apply rotation matrix
          planetMesh.position.x = currentX * Math.cos(rotationSpeed) - currentZ * Math.sin(rotationSpeed)
          planetMesh.position.z = currentX * Math.sin(rotationSpeed) + currentZ * Math.cos(rotationSpeed)

          // Rotate planet around its axis
          planetMesh.rotation.y += planet.rotationSpeed * delta

          // Update moons if any
          if (planet.moons && planet.moons.length > 0) {
            planet.moons.forEach((moon) => {
              const moonPivot = planetMesh.children.find((child) =>
                child.children.some((c) => c.userData["name"] === moon.name),
              )
              if (moonPivot) {
                moonPivot.rotation.y += moon.orbitalSpeed * delta
              }
            })
          }

          // If this planet is focused, update the camera target to follow it
          if (this.focusedPlanetSubject.value === planet.id && !this.cameraAnimationInProgress) {
            this.controls.target.copy(planetMesh.position)
            this.controls.update()
          }
        }
      })

    // Rotate asteroid belt
    if (this.asteroidBelt) {
      this.asteroidBelt.rotation.y += 0.0005

      // Optionally, rotate individual asteroids for more dynamic effect
      this.asteroidBelt.children.forEach((asteroid) => {
        asteroid.rotation.x += 0.001 * Math.random()
        asteroid.rotation.y += 0.001 * Math.random()
      })
    }

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  private onMouseMove = (event: MouseEvent): void => {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera)

    // Find intersections with celestial bodies
    const celestialBodyObjects = Array.from(this.celestialBodies.values())
    const intersects = this.raycaster.intersectObjects(celestialBodyObjects, true)

    if (intersects.length > 0) {
      // Find the first object with userData
      let object = intersects[0].object

      // If the object doesn't have userData but is part of a parent with userData, use the parent
      while (object && !object.userData["name"]) {
        object = object.parent as THREE.Object3D
      }

      if (object && object.userData["name"]) {
        this.selectedBodySubject.next(object.userData as CelestialBody)
        this.isInfoVisibleSubject.next(true)
        this.mousePositionSubject.next({ x: event.clientX, y: event.clientY })
      } else {
        this.isInfoVisibleSubject.next(false)
      }
    } else {
      this.isInfoVisibleSubject.next(false)
    }
  }

  private onWindowResize = (): void => {
    if (!this.camera || !this.renderer) return

    this.camera.aspect = this.getAspectRatio()
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.getWidth(), this.getHeight())
  }

  private addEventListeners(): void {
    window.addEventListener("resize", this.onWindowResize)
    this.rendererContainer.nativeElement.addEventListener("mousemove", this.onMouseMove)
  }

  private getAspectRatio(): number {
    return this.getWidth() / this.getHeight()
  }

  private getWidth(): number {
    return this.rendererContainer.nativeElement.clientWidth
  }

  private getHeight(): number {
    return this.rendererContainer.nativeElement.clientHeight
  }

  public dispose(): void {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId)
    }

    window.removeEventListener("resize", this.onWindowResize)

    if (this.rendererContainer?.nativeElement) {
      this.rendererContainer.nativeElement.removeEventListener("mousemove", this.onMouseMove)
    }

    if (this.controls) {
      this.controls.dispose()
    }

    if (this.renderer) {
      this.renderer.dispose()
    }

    // Clear all references
    this.celestialBodies.clear()
  }
}
