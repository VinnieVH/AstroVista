import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  signal,
  computed,
  inject,
} from "@angular/core"
import { CelestialBodyService } from "../../api/celestial-body.service"
import { CelestialBody } from "../../models/celestial-body.model"
import { LoadingScreenComponent } from "./components/loading-screen/loading-screen.component"
import { PlanetInfoCardComponent } from "./components/planet-info-card/planet-info-card.component"
import { PlanetSelectorComponent } from "./components/planet-selector/planet-selector.component"
import { FocusedPlanetIndicatorComponent } from "./components/focused-planet-indicator/focused-planet-indicator.component"
import { TextureLoaderService } from "./services/texture-loader.service"
import { SolarSystemService } from "./services/solar-system.service"
import { RingTextureGeneratorService } from "./services/ring-texture-generator.service"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"

@Component({
  selector: "app-solar-system",
  standalone: true,
  imports: [
    LoadingScreenComponent,
    PlanetInfoCardComponent,
    PlanetSelectorComponent,
    FocusedPlanetIndicatorComponent,
  ],
  providers: [TextureLoaderService, SolarSystemService, RingTextureGeneratorService],
  templateUrl: "./solar-system.component.html",
})
export class SolarSystemComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("rendererContainer") rendererContainer!: ElementRef

  private celestialBodyService = inject(CelestialBodyService)
  private textureLoaderService = inject(TextureLoaderService)
  private solarSystemService = inject(SolarSystemService)
  private ringTextureGeneratorService = inject(RingTextureGeneratorService)

  // Signals for reactive state
  selectedBody = signal<CelestialBody | null>(null)
  isInfoVisible = signal(false)
  mousePosition = signal({ x: 0, y: 0 })
  planetList = signal<CelestialBody[]>([])
  focusedPlanet = signal<string | null>(null)
  showPlanetSelector = signal(false)
  isLoading = signal(true)
  loadingProgress = signal(0)
  loadingMessage = signal("Preparing solar system...")

  // Computed values
  infoPosition = computed(() => {
    return {
      left: `${this.mousePosition().x + 20}px`,
      top: `${this.mousePosition().y - 20}px`,
    }
  })

  focusedPlanetName = computed(() => {
    const planetId = this.focusedPlanet()
    if (!planetId) return ""

    const planet = this.planetList().find((p) => p.id === planetId)
    return planet?.name || ""
  })

  constructor() {
    // Subscribe to loading state changes
    this.textureLoaderService.loadingState$.pipe(takeUntilDestroyed()).subscribe((state) => {
      this.isLoading.set(state.isLoading)
      this.loadingProgress.set(state.progress)
      this.loadingMessage.set(state.message)
    })

    // Subscribe to selected body changes
    this.solarSystemService.selectedBody$.pipe(takeUntilDestroyed()).subscribe((body) => {
      this.selectedBody.set(body)
    })

    // Subscribe to info visibility changes
    this.solarSystemService.isInfoVisible$.pipe(takeUntilDestroyed()).subscribe((visible) => {
      this.isInfoVisible.set(visible)
    })

    // Subscribe to mouse position changes
    this.solarSystemService.mousePosition$.pipe(takeUntilDestroyed()).subscribe((position) => {
      this.mousePosition.set(position)
    })

    // Subscribe to focused planet changes
    this.solarSystemService.focusedPlanet$.pipe(takeUntilDestroyed()).subscribe((planetId) => {
      this.focusedPlanet.set(planetId)
    })
  }

  ngOnInit(): void {
    // Get all planets for the selector
    this.planetList.set([
      { id: "reset", name: "Overview", type: "star" } as CelestialBody,
      ...this.celestialBodyService
        .getCelestialBodies()
        .filter((body) => body.type === "planet" || body.type === "star" || body.type === "dwarf-planet"),
    ])
  }

  ngAfterViewInit(): void {
    // Initialize the solar system
    this.solarSystemService.initialize(this.rendererContainer)
  }

  ngOnDestroy(): void {
    // Clean up resources
    this.solarSystemService.dispose()
    this.textureLoaderService.dispose()
    this.ringTextureGeneratorService.dispose()
  }

  togglePlanetSelector(): void {
    this.showPlanetSelector.update((value) => !value)
  }

  focusOnPlanet(planetId: string): void {
    this.solarSystemService.focusOnPlanet(planetId)
    this.showPlanetSelector.set(false)
  }
}
