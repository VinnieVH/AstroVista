import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;
  private orbitControls!: OrbitControls;
  private stats!: Stats;
  private gui!: GUI;
  private frameId: number | null = null;

  constructor() { }

  ngAfterViewInit(): void {
    this.initThree();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
    }
    this.cleanUp();
  }

  private initThree(): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f1123);

    // Loaders
    new GLTFLoader().load(
      '/models/suzanne.glb',
      (gltf: GLTF) => {
        this.scene.add(gltf.scene);
      },
      (xhr: ProgressEvent) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error: unknown) => {
        console.log(error);
      })

    // Camera
    const width = this.getContainerWidth();
    const height = this.getContainerHeight();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Add window resize listener
    window.addEventListener('resize', () => this.onWindowResize());

    // Add Stats window
    this.stats = new Stats();
    this.rendererContainer.nativeElement.appendChild(this.stats.dom);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  private animate(): void {
    this.frameId = requestAnimationFrame(() => this.animate());

    this.stats.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    const width = this.getContainerWidth();
    const height = this.getContainerHeight();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private getContainerWidth(): number {
    return this.rendererContainer.nativeElement.clientWidth;
  }

  private getContainerHeight(): number {
    return this.rendererContainer.nativeElement.clientHeight;
  }

  private cleanUp(): void {
    // Dispose of resources to prevent memory leaks
    if (this.cube) {
      this.scene.remove(this.cube);
      (this.cube.geometry as THREE.BufferGeometry).dispose();
      (this.cube.material as THREE.Material).dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
