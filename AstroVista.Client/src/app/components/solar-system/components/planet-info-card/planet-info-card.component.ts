import { Component, Input } from "@angular/core"
import { DecimalPipe, NgStyle, TitleCasePipe } from "@angular/common"
import type { CelestialBody } from "../../../../models/celestial-body.model"

@Component({
  selector: "app-planet-info-card",
  imports: [NgStyle, TitleCasePipe, DecimalPipe],
  template: `
    <div
      class="absolute bg-ebony-950/80 border border-ebony-700/30 rounded-lg p-3 text-ebony-50 max-w-xs backdrop-blur-md z-10 pointer-events-none shadow-lg"
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
    </div>
  `,
})
export class PlanetInfoCardComponent {
  @Input() body: CelestialBody | null = null
  @Input() position: { left: string; top: string } = { left: "0px", top: "0px" }
}
