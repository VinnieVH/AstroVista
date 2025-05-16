import { Component, Input, Output, EventEmitter } from "@angular/core"
import { NgClass } from "@angular/common"
import type { CelestialBody } from "../../../../models/celestial-body.model"

@Component({
  selector: "app-planet-selector",
  imports: [NgClass],
  template: `
    <button
      (click)="toggleSelector.emit()"
      class="absolute top-5 left-5 bg-ebony-600 hover:bg-ebony-700 text-ebony-50 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-200 z-20"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="4"></circle>
        <line x1="21.17" y1="8" x2="12" y2="8"></line>
        <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
        <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
      </svg>
      <span>{{ focusedPlanetId ? 'Change Planet' : 'Select Planet' }}</span>
    </button>

    <!-- Planet Selector Dropdown -->
    @if (isOpen) {
      <div class="absolute top-16 left-5 bg-ebony-950/90 border border-ebony-700/30 rounded-lg p-2 text-ebony-50 backdrop-blur-md z-20 shadow-lg max-h-[70vh] overflow-y-auto">
        <h3 class="text-ebony-300 text-lg mb-2 px-2">Select a celestial body</h3>
        <div class="space-y-1">
          @for (planet of planets; track planet.id) {
            <button
              (click)="selectPlanet.emit(planet.id)"
              class="w-full text-left px-3 py-2 rounded hover:bg-ebony-800/50 transition-colors flex items-center space-x-2"
              [ngClass]="{'bg-ebony-700/50': focusedPlanetId === planet.id}"
            >
              @if (planet.id === 'reset') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-ebony-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <line x1="12" y1="2" x2="12" y2="22"></line>
                </svg>
              } @else {
                <span
                  class="inline-block w-3 h-3 rounded-full"
                  [style.backgroundColor]="'#' + planet.color!.toString(16).padStart(6, '0')"
                ></span>
              }
              <span>{{ planet.name }}</span>
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class PlanetSelectorComponent {
  @Input() planets: CelestialBody[] = []
  @Input() isOpen = false
  @Input() focusedPlanetId: string | null = null

  @Output() toggleSelector = new EventEmitter<void>()
  @Output() selectPlanet = new EventEmitter<string>()
}
