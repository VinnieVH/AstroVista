import { Component, Input, Output, EventEmitter } from "@angular/core"

@Component({
  selector: "app-focused-planet-indicator",
  template: `
    <div class="absolute bottom-5 right-5 text-ebony-50 bg-ebony-800/80 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="4"></circle>
      </svg>
      <span>Viewing: {{ planetName }}</span>
      <button
        (click)="resetView.emit()"
        class="ml-2 text-ebony-300/80 hover:text-ebony-100"
        title="Return to overview"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"></path>
        </svg>
      </button>
    </div>
  `,
})
export class FocusedPlanetIndicatorComponent {
  @Input() planetName = ""
  @Output() resetView = new EventEmitter<void>()
}
