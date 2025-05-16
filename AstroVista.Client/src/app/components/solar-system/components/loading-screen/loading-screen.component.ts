import { Component, Input } from "@angular/core"

@Component({
  selector: "app-loading-screen",
  template: `
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-ebony-950 z-50">
      <div class="text-center">
        <div class="relative w-24 h-24 mb-8 mx-auto">
          <!-- Orbit Animation -->
          <div class="absolute inset-0 rounded-full border-4 border-ebony-800 opacity-25"></div>
          <div class="absolute inset-0 rounded-full border-t-4 border-ebony-400 animate-spin"></div>

          <!-- Planet in the middle -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-ebony-400 to-ebony-600 shadow-lg"></div>
          </div>
        </div>

        <h2 class="text-ebony-100 text-xl font-semibold mb-2">{{ message }}</h2>
        <div class="w-64 h-2 bg-ebony-900 rounded-full overflow-hidden mx-auto">
          <div
            class="h-full bg-ebony-500 rounded-full transition-all duration-300 ease-out"
            [style.width.%]="progress"
          ></div>
        </div>
        <p class="text-ebony-400 mt-2">{{ progress }}%</p>
      </div>
    </div>
  `,
})
export class LoadingScreenComponent {
  @Input() progress = 0
  @Input() message = "Loading..."
}
