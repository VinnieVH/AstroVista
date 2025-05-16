import {Component, EventEmitter, Input, Output} from "@angular/core"
import { DecimalPipe, NgStyle, TitleCasePipe } from "@angular/common"
import type { CelestialBody } from "../../../../models/celestial-body.model"

@Component({
  selector: "app-planet-info-card",
  standalone: true,
  imports: [NgStyle, TitleCasePipe, DecimalPipe],
  template: `
    <div
      class="absolute bg-ebony-950/80 border border-ebony-700/30 rounded-lg p-3 text-ebony-50 max-w-xs backdrop-blur-md z-10 shadow-lg"
      [class.pointer-events-none]="!fixedPosition"
      [ngStyle]="position"
    >
      <h3 class="mt-0 mb-2 text-ebony-300 text-lg">{{ body?.name }}</h3>
      <div class="text-sm">
        @if (body?.type) {
          <p class="my-1.5"><span class="text-ebony-200 font-semibold">Type:</span> {{ body?.type | titlecase }}</p>
        }
        @if (body?.diameter) {
          <p class="my-1.5"><span class="text-ebony-200 font-semibold">Diameter:</span> {{ body?.diameter | number }} km</p>
        }
        @if (body?.distanceFromSun) {
          <p class="my-1.5"><span class="text-ebony-200 font-semibold">Distance from Sun:</span> {{ body?.distanceFromSun | number }} million km</p>
        }
        @if (body?.orbitalPeriod) {
          <p class="my-1.5"><span class="text-ebony-200 font-semibold">Orbital Period:</span> {{ body?.orbitalPeriod }} days</p>
        }
        @if (body?.rings) {
          <p class="my-1.5"><span class="text-ebony-200 font-semibold">Ring System:</span> Present</p>
        }
        @if (body?.description) {
          <p class="my-1.5">{{ body?.description }}</p>
        }
      </div>

      @if (fixedPosition && body?.id !== 'reset') {
        <button
          (click)="resetView.emit()"
          class="mt-3 text-ebony-300/80 hover:text-ebony-100 flex items-center space-x-1"
          title="Return to overview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          <span>Return to overview</span>
        </button>
      }
    </div>
  `,
})
export class PlanetInfoCardComponent {
  @Input() body: CelestialBody | null = null
  @Input() position: { [key: string]: string } = { left: "0px", top: "0px" }
  @Input() fixedPosition = false

  @Output() resetView = new EventEmitter<void>()
}
