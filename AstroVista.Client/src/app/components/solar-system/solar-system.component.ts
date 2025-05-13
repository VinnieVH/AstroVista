import {
  Component,
  type ElementRef,
  type OnInit,
  ViewChild,
  type AfterViewInit,
  type OnDestroy,
  signal,
  computed,
} from "@angular/core"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { CelestialBodyService } from "../../api/celestial-body.service"
import { CelestialBody } from "../../models/celestial-body.model"
import {DecimalPipe, NgStyle, TitleCasePipe} from '@angular/common';

@Component({
  selector: "app-solar-system",
  imports: [
    NgStyle,
    TitleCasePipe,
    DecimalPipe
  ],
  standalone: true,
  templateUrl: "./solar-system.component.html",
})
export class SolarSystemComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("rendererContainer") rendererContainer!: ElementRef

  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private controls!: OrbitControls
  private animationFrameId!: number
  private raycaster = new THREE.Raycaster()
  private mouse = new THREE.Vector2()
  private celestialBodies: Map<string, THREE.Object3D> = new Map()
  private clock = new THREE.Clock()

  // Signals for reactive state
  selectedBody = signal<CelestialBody | null>(null)
  isInfoVisible = signal(false)
  mousePosition = signal({ x: 0, y: 0 })

  // Computed values
  infoPosition = computed(() => {
    return {
      left: `${this.mousePosition().x + 20}px`,
      top: `${this.mousePosition().y - 20}px`,
    }
  })

  constructor(private celestialBodyService: CelestialBodyService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThreeJS()
    this.createSolarSystem()
    this.animate()
    this.addEventListeners()
  }

  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.animationFrameId)
    window.removeEventListener("resize", this.onWindowResize)
    this.rendererContainer.nativeElement.removeEventListener("mousemove", this.onMouseMove)
    this.controls.dispose()
    this.renderer.dispose()
  }

  private initThreeJS(): void {
    // Create scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0f1123)

    // Create camera
    const aspectRatio = this.getAspectRatio()
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000)
    this.camera.position.set(0, 30, 50)

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.getWidth(), this.getHeight())
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 10
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
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00
    })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    sun.userData['name'] = bodies.find((body) => body.name === "Sun")
    this.scene.add(sun)
    this.celestialBodies.set("Sun", sun)

    // Create planets and their orbits
    bodies
      .filter((body) => body.type === "planet")
      .forEach((planet) => {
        // Create orbit path
        const orbitGeometry = new THREE.RingGeometry(planet.orbitRadius, planet.orbitRadius + 0.05, 128)
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x444444,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3,
        })
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
        orbit.rotation.x = Math.PI / 2
        this.scene.add(orbit)

        // Create planet
        const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32)
        const planetMaterial = new THREE.MeshStandardMaterial({
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

        // Add moons if any
        if (planet.moons && planet.moons.length > 0) {
          planet.moons.forEach((moon) => {
            const moonGeometry = new THREE.SphereGeometry(moon.radius, 16, 16)
            const moonMaterial = new THREE.MeshStandardMaterial({
              color: moon.color,
              roughness: 0.8,
            })
            const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)

            // Create moon orbit
            const moonOrbitGeometry = new THREE.RingGeometry(moon.orbitRadius, moon.orbitRadius + 0.02, 64)
            const moonOrbitMaterial = new THREE.MeshBasicMaterial({
              color: 0x333333,
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
        }
      })

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

    // Find intersections
    const intersects = this.raycaster.intersectObjects(Array.from(this.celestialBodies.values()))

    if (intersects.length > 0) {
      const object = intersects[0].object
      if (object.userData) {
        this.selectedBody.set(object.userData as CelestialBody)
        this.isInfoVisible.set(true)
        this.mousePosition.set({ x: event.clientX, y: event.clientY })
      }
    } else {
      this.isInfoVisible.set(false)
    }
  }

  private onWindowResize = (): void => {
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
}
