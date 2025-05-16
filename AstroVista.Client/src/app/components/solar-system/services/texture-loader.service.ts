import { Injectable } from "@angular/core"
import * as THREE from "three"
import { BehaviorSubject, type Observable } from "rxjs"

export interface LoadingState {
  isLoading: boolean
  progress: number
  message: string
}

@Injectable({
  providedIn: "root",
})
export class TextureLoaderService {
  private readonly loadingManager: THREE.LoadingManager
  private textureLoader: THREE.TextureLoader
  private loadedTextures: Map<string, THREE.Texture> = new Map()

  private loadingStateSubject = new BehaviorSubject<LoadingState>({
    isLoading: false,
    progress: 0,
    message: "Preparing to load textures...",
  })

  public loadingState$: Observable<LoadingState> = this.loadingStateSubject.asObservable()

  constructor() {
    this.loadingManager = new THREE.LoadingManager()
    this.setupLoadingManager()
    this.textureLoader = new THREE.TextureLoader(this.loadingManager)
  }

  private setupLoadingManager(): void {
    this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(`Started loading: ${url}`)
      this.loadingStateSubject.next({
        isLoading: true,
        progress: 0,
        message: `Loading textures (${itemsLoaded}/${itemsTotal})...`,
      })
    }

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = Math.floor((itemsLoaded / itemsTotal) * 100)
      console.log(`Loading file: ${url}. Loaded ${itemsLoaded}/${itemsTotal} files.`)
      this.loadingStateSubject.next({
        isLoading: true,
        progress,
        message: `Loading textures (${itemsLoaded}/${itemsTotal})...`,
      })
    }

    this.loadingManager.onLoad = () => {
      console.log("Loading complete!")
      this.loadingStateSubject.next({
        isLoading: false,
        progress: 100,
        message: "Loading complete!",
      })
    }

    this.loadingManager.onError = (url) => {
      console.error(`Error loading: ${url}`)
      this.loadingStateSubject.next({
        ...this.loadingStateSubject.value,
        message: `Error loading texture: ${url}. Using fallback...`,
      })
    }
  }

  public preloadTextures(textureUrls: string[]): Promise<void> {
    if (textureUrls.length === 0) {
      this.loadingManager.onLoad()
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      // Set up a one-time listener for the onLoad event
      const originalOnLoad = this.loadingManager.onLoad
      this.loadingManager.onLoad = () => {
        originalOnLoad()
        resolve()
        // Restore the original onLoad handler
        this.loadingManager.onLoad = originalOnLoad
      }

      // Load all textures
      textureUrls.forEach((url) => {
        this.textureLoader.load(
          url,
          (texture) => {
            // Store the loaded texture
            this.loadedTextures.set(url, texture)
          },
          undefined, // onProgress is handled by the LoadingManager
          (error) => {
            console.error(`Error loading texture ${url}:`, error)
          },
        )
      })
    })
  }

  public getTexture(url: string): THREE.Texture | undefined {
    return this.loadedTextures.get(url)
  }

  public dispose(): void {
    // Dispose of all textures
    this.loadedTextures.forEach((texture) => {
      texture.dispose()
    })
    this.loadedTextures.clear()
  }
}
