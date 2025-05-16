import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

@Component({
  selector: 'app-star-field',
  templateUrl: './star-field.component.html'
})
export class StarFieldComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  // Configurable inputs
  @Input() backgroundColor: string = '#0f1123';
  @Input() starsCount: number = 1500;
  @Input() bloomStrength: number = 0.5;
  @Input() bloomRadius: number = 0.4;
  @Input() bloomThreshold: number = 0.2;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private stars!: THREE.Points;
  private animationFrameId: number | null = null;
  private velocities: { speed: number }[] = [];
  private composer!: any;
  private renderPass!: any;
  private effectPass!: any;

  constructor() { }

  ngOnInit(): void {
    this.animate();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initThreeJS();
      this.createStars();
      this.setupResizeHandler();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.onWindowResize);

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.stars) {
      this.stars.geometry.dispose();
      (this.stars.material as THREE.Material).dispose();
    }
  }

  private initThreeJS(): void {
    try {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.backgroundColor);

      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
      this.camera.position.z = 5;

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
      });

      this.renderer.setClearColor(new THREE.Color(this.backgroundColor), 1);

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

      this.setupPostProcessing();

      this.composer.render();
    } catch (error) {
      console.error('Error initializing ThreeJS:', error);
    }
  }

  private setupPostProcessing(): void {
    try {
      this.renderPass = new RenderPass(this.scene, this.camera);

      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(this.renderPass);

      const motionBlurShader = {
        uniforms: {
          "tDiffuse": { value: null },
          "opacity": { value: 0.6 }
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
        fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
          vec4 previousFrame = texture2D(tDiffuse, vUv);
          gl_FragColor = previousFrame * opacity;
        }
      `
      };

      // Enhanced bloom settings for colored stars
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.bloomStrength,
        this.bloomRadius,
        this.bloomThreshold
      );
      this.composer.addPass(bloomPass);

      this.effectPass = new ShaderPass(motionBlurShader);
      this.effectPass.renderToScreen = true;
      this.composer.addPass(this.effectPass);

    } catch (error) {
      console.error('Error setting up post-processing:', error);
    }
  }

  private createStars(): void {
    try {
      const starTexture = new THREE.CanvasTexture(this.createStarTexture());
      starTexture.needsUpdate = true;

      const starsGeometry = new THREE.BufferGeometry();

      const positions = new Float32Array(this.starsCount * 3);
      const colors = new Float32Array(this.starsCount * 3);
      const sizes = new Float32Array(this.starsCount);
      const alphas = new Float32Array(this.starsCount); // For fade-in effect

      for (let i = 0; i < this.starsCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 15;

        // Star positions
        positions[i * 3] = Math.cos(angle) * radius;     // x
        positions[i * 3 + 1] = Math.sin(angle) * radius; // y
        positions[i * 3 + 2] = Math.random() * 100 - 50; // z

        // White to yellow color spectrum only
        const colorVariation = Math.random();

        if (colorVariation < 0.7) {
          // Pure white stars (70%)
          colors[i * 3] = 1.0;     // R
          colors[i * 3 + 1] = 1.0; // G
          colors[i * 3 + 2] = 1.0; // B
        } else if (colorVariation < 0.85) {
          // Slightly yellow-white stars (15%)
          colors[i * 3] = 1.0;     // R
          colors[i * 3 + 1] = 1.0; // G
          colors[i * 3 + 2] = 0.9; // B slightly reduced
        } else {
          // Golden yellow stars (15%)
          colors[i * 3] = 1.0;     // R
          colors[i * 3 + 1] = 0.9; // G slightly reduced
          colors[i * 3 + 2] = 0.6; // B more reduced
        }

        // Vary star sizes - make yellower stars slightly larger
        let sizeFactor = 1.0;
        if (colorVariation >= 0.85) {
          // Larger yellow stars
          sizeFactor = 1.3;
        }

        sizes[i] = (1.0 + Math.random() * 2.0) * sizeFactor;

        // Initialize alpha (fully visible)
        alphas[i] = 1.0;

        // Star velocities for movement
        this.velocities.push({
          speed: 0.2 + Math.random() * 0.6
        });
      }

      starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      starsGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

      // Create custom shader material for alpha fade-in
      const vertexShader = `
        attribute float size;
        attribute vec3 color;
        attribute float alpha;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = color;
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragmentShader = `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
          vec4 texColor = texture2D(pointTexture, uv);
          gl_FragColor = vec4(vColor, vAlpha) * texColor;
        }
      `;

      // Uniforms for the shader
      const uniforms = {
        pointTexture: { value: starTexture }
      };

      // Create shader material
      const starsMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      });

      // Remove previous stars if they exist
      if (this.stars && this.scene.children.includes(this.stars)) {
        this.scene.remove(this.stars);
        this.stars.geometry.dispose();
        (this.stars.material as THREE.Material).dispose();
      }

      this.stars = new THREE.Points(starsGeometry, starsMaterial);
      this.scene.add(this.stars);

    } catch (error) {
      console.error('Error creating stars:', error);
    }
  }

  private createStarTexture(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext('2d')!;

    // Clear to transparent
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Create a radial gradient for a circular star
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );

    // Softer gradient for white/yellow stars
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.25, 'rgba(255, 253, 240, 0.8)'); // Slightly warm tint
    gradient.addColorStop(0.5, 'rgba(255, 253, 235, 0.3)');  // Slightly warm tint
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    context.fillStyle = gradient;

    // Draw a circle
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    context.fill();

    return canvas;
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    try {
      // Update star positions to create travel effect
      if (this.stars && this.stars.geometry.attributes['position']) {
        const positions = (this.stars.geometry.attributes['position'] as THREE.BufferAttribute).array as Float32Array;
        const alphas = (this.stars.geometry.attributes['alpha'] as THREE.BufferAttribute).array as Float32Array;

        for (let i = 0; i < this.starsCount; i++) {
          positions[i * 3 + 2] += this.velocities[i].speed;

          if (positions[i * 3 + 2] > 5) {
            positions[i * 3 + 2] = -50;

            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 15;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(angle) * radius;

            // Reset alpha to transparent for fade-in effect
            alphas[i] = 0.0;
          }

          // Fade in stars as they move toward the viewer
          if (positions[i * 3 + 2] < -30 && alphas[i] < 1.0) {
            // Gradually increase alpha as star moves closer
            const fadeProgress = 1 - (Math.abs(positions[i * 3 + 2] + 30) / 20);
            alphas[i] = Math.max(0, Math.min(this.easeInCubic(fadeProgress), 1.0));
          }
        }

        (this.stars.geometry.attributes['position'] as THREE.BufferAttribute).needsUpdate = true;
        (this.stars.geometry.attributes['alpha'] as THREE.BufferAttribute).needsUpdate = true;
      }

      if (this.composer) {
        this.composer.render();
      }
    } catch (error) {
      console.error('Error in animation loop:', error);
      cancelAnimationFrame(this.animationFrameId!);
    }
  }

  // Helper function for smoother fade-in
  private easeInCubic(t: number): number {
    return t * t * t;
  }

  private onWindowResize = (): void => {
    if (this.camera && this.renderer) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.composer.setSize(width, height);
    }
  }

  private setupResizeHandler(): void {
    window.addEventListener('resize', this.onWindowResize);
  }
}
