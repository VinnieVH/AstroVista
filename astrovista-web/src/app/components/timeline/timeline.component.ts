import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;

  // Timeline objects
  private timelineGroup!: THREE.Group;

  // Timeline properties
  private baseTimelineLength = 20;
  private zoomLevel = 1;
  private minZoom = 0.5;
  private maxZoom = 5;

  private timelineEvents: {date: Date, title: string, position: number}[] = [
    {date: new Date(2022, 0, 1), title: 'Jan 2022', position: 0},
    {date: new Date(2022, 3, 15), title: 'Apr 2022', position: 4},
    {date: new Date(2022, 6, 30), title: 'Jul 2022', position: 7},
    {date: new Date(2022, 9, 10), title: 'Oct 2022', position: 10},
    {date: new Date(2023, 0, 1), title: 'Jan 2023', position: 12},
    {date: new Date(2023, 6, 1), title: 'Jul 2023', position: 18}
  ];

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initThree();
    this.createTimeline();
    this.animate();
  }

  private initThree(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fa);

    // Create timeline group to manage all timeline elements
    this.timelineGroup = new THREE.Group();
    this.scene.add(this.timelineGroup);

    // Orthographic camera for 2D view (no perspective)
    const aspect = this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight;
    const frustumSize = 15;
    this.camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.rendererContainer.nativeElement.clientWidth,
      this.rendererContainer.nativeElement.clientHeight
    );
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    // Handle window resize
    window.addEventListener('resize', () => {
      const aspect = this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight;
      const frustumSize = 15;

      this.camera.left = frustumSize * aspect / -2;
      this.camera.right = frustumSize * aspect / 2;
      this.camera.top = frustumSize / 2;
      this.camera.bottom = frustumSize / -2;

      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.rendererContainer.nativeElement.clientWidth,
        this.rendererContainer.nativeElement.clientHeight
      );
    });
  }

  private createTimeline(): void {
    // Clear existing timeline
    while(this.timelineGroup.children.length > 0) {
      this.timelineGroup.remove(this.timelineGroup.children[0]);
    }

    // Get current timeline length based on zoom
    const timelineLength = this.baseTimelineLength / this.zoomLevel;

    // Create main timeline line
    const timelineGeometry = new THREE.BoxGeometry(timelineLength, 0.2, 0.1);
    const timelineMaterial = new THREE.MeshBasicMaterial({ color: 0x4285f4 });
    const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
    this.timelineGroup.add(timeline);

    // Add scale markers - adjust number based on zoom
    const markerCount = Math.ceil(timelineLength) + 1;
    const markerSpacing = 1 / this.zoomLevel;

    for (let i = 0; i < markerCount; i++) {
      const markerGeometry = new THREE.BoxGeometry(0.05, 0.5, 0.1);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);

      marker.position.set(
        -timelineLength/2 + (i * markerSpacing),
        0.25,
        0
      );

      this.timelineGroup.add(marker);

      // Add label for each marker (with adjusted spacing based on zoom)
      if (i % Math.max(1, Math.floor(2 / this.zoomLevel)) === 0) {
        this.addTextLabel(i.toString(), marker.position.x, marker.position.y + 0.5, marker.position.z);
      }
    }

    // Add event markers - filter based on visible range
    const visibleMin = -timelineLength/2;
    const visibleMax = timelineLength/2;

    this.timelineEvents.forEach(event => {
      // Scale position based on zoom
      const scaledPosition = event.position / this.zoomLevel;

      // Only add if the event is in the visible range
      if (scaledPosition >= visibleMin && scaledPosition <= visibleMax) {
        this.addEventMarker(event, scaledPosition);
      }
    });
  }

  private addEventMarker(event: {date: Date, title: string, position: number}, scaledPosition: number): void {
    // Create a circle for the event
    const circleGeometry = new THREE.CircleGeometry(0.3, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xea4335 });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);

    // Position the circle on the timeline
    circle.position.set(
      -this.baseTimelineLength/(2 * this.zoomLevel) + scaledPosition,
      0.5,
      0.1
    );
    circle.lookAt(this.camera.position);

    this.timelineGroup.add(circle);

    // Add event title
    this.addTextLabel(
      event.title,
      circle.position.x,
      circle.position.y + 0.8,
      circle.position.z,
      0.5 // Smaller text for events
    );

    // Add a vertical line from timeline to event
    const lineGeometry = new THREE.BoxGeometry(0.05, 0.5, 0.1);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xea4335 });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);

    line.position.set(
      circle.position.x,
      0.25,
      0
    );

    this.timelineGroup.add(line);
  }

  private addTextLabel(text: string, x: number, y: number, z: number, scale: number = 1): void {
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = 'rgba(255, 255, 255, 0)'; // Transparent background
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = '24px Arial';
      context.fillStyle = '#000000';
      context.textAlign = 'center';
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });

      const labelGeometry = new THREE.PlaneGeometry(2 * scale, 0.5 * scale);
      const label = new THREE.Mesh(labelGeometry, material);

      label.position.set(x, y, z);
      label.lookAt(this.camera.position);

      this.timelineGroup.add(label);
    }
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  // Zoom in/out with mouse wheel
  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent): void {
    event.preventDefault();

    // Adjust zoom level based on scroll direction
    const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
    this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel + zoomDelta));

    // Recreate timeline with new zoom
    this.createTimeline();
  }

  // Add touch zoom for mobile
  private touchDistance = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.touchDistance = Math.hypot(
        event.touches[0].pageX - event.touches[1].pageX,
        event.touches[0].pageY - event.touches[1].pageY
      );
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2) {
      event.preventDefault();

      const newDistance = Math.hypot(
        event.touches[0].pageX - event.touches[1].pageX,
        event.touches[0].pageY - event.touches[1].pageY
      );

      const deltaDistance = newDistance - this.touchDistance;
      this.touchDistance = newDistance;

      // Adjust zoom based on pinch/spread
      const zoomDelta = deltaDistance * 0.01;
      this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel + zoomDelta));

      this.createTimeline();
    }
  }
}
