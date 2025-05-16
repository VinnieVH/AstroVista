import { Injectable } from "@angular/core"
import type { CelestialBody } from "../models/celestial-body.model"

@Injectable({
  providedIn: "root",
})
export class CelestialBodyService {
  private celestialBodies: CelestialBody[] = [
    {
      id: "sun",
      name: "Sun",
      type: "star",
      diameter: 1392700,
      mass: 1.989e30,
      description:
        "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.",
      radius: 5,
      color: 0xffff00,
      orbitRadius: 0,
      orbitalSpeed: 0,
      rotationSpeed: 0.002,
      texturePath: "textures/sun.jpg"
    },
    {
      id: "mercury",
      name: "Mercury",
      type: "planet",
      diameter: 4879,
      mass: 3.3011e23,
      distanceFromSun: 57.9,
      orbitalPeriod: 88,
      rotationPeriod: 58.6,
      description:
        "Mercury is the smallest and innermost planet in the Solar System. It has no natural satellites and no substantial atmosphere.",
      radius: 0.5,
      color: 0x8c8c8c,
      orbitRadius: 10,
      orbitalSpeed: 0.04,
      rotationSpeed: 0.004,
      texturePath: "textures/mercury.jpg"
    },
    {
      id: "venus",
      name: "Venus",
      type: "planet",
      diameter: 12104,
      mass: 4.8675e24,
      distanceFromSun: 108.2,
      orbitalPeriod: 224.7,
      rotationPeriod: -243, // Negative indicates retrograde rotation
      description:
        "Venus is the second planet from the Sun. It has the densest atmosphere of all terrestrial planets, consisting mostly of carbon dioxide.",
      radius: 0.9,
      color: 0xe39e54,
      orbitRadius: 15,
      orbitalSpeed: 0.03,
      rotationSpeed: -0.002,
      texturePath: "textures/venus.jpg"
    },
    {
      id: "earth",
      name: "Earth",
      type: "planet",
      diameter: 12756,
      mass: 5.97237e24,
      distanceFromSun: 149.6,
      orbitalPeriod: 365.2,
      rotationPeriod: 1,
      description:
        "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is water-covered.",
      radius: 1,
      color: 0x2b82c9,
      orbitRadius: 20,
      orbitalSpeed: 0.025,
      rotationSpeed: 0.01,
      texturePath: "textures/earth.jpg",
      moons: [
        {
          id: "moon",
          name: "Moon",
          type: "moon",
          diameter: 3475,
          mass: 7.342e22,
          distanceFromSun: 149.6, // Same as Earth
          orbitalPeriod: 27.3,
          rotationPeriod: 27.3,
          description:
            "The Moon is Earth's only natural satellite. It is the fifth-largest satellite in the Solar System and the largest among planetary satellites relative to the size of the planet that it orbits.",
          radius: 0.27,
          color: 0xcccccc,
          orbitRadius: 2.5,
          orbitalSpeed: 0.05,
          rotationSpeed: 0.05,
          texturePath: "textures/moon.jpg"
        },
      ],
    },
    {
      id: "mars",
      name: "Mars",
      type: "planet",
      diameter: 6792,
      mass: 6.4171e23,
      distanceFromSun: 227.9,
      orbitalPeriod: 687,
      rotationPeriod: 1.03,
      description:
        'Mars is the fourth planet from the Sun. It is often referred to as the "Red Planet" due to its reddish appearance, caused by iron oxide on its surface.',
      radius: 0.7,
      color: 0xc1440e,
      orbitRadius: 25,
      orbitalSpeed: 0.02,
      rotationSpeed: 0.009,
      texturePath: "textures/mars.jpg",
      moons: [
        {
          id: "phobos",
          name: "Phobos",
          type: "moon",
          diameter: 22.2,
          mass: 1.0659e16,
          orbitalPeriod: 0.32,
          rotationPeriod: 0.32,
          description:
            "Phobos is the innermost and larger of the two natural satellites of Mars. It is irregularly shaped and heavily cratered.",
          radius: 0.1,
          color: 0x888888,
          orbitRadius: 1.5,
          orbitalSpeed: 0.1,
          rotationSpeed: 0.1,
          texturePath: "textures/phobos.jpg"
        },
        {
          id: "deimos",
          name: "Deimos",
          type: "moon",
          diameter: 12.6,
          mass: 1.4762e15,
          orbitalPeriod: 1.26,
          rotationPeriod: 1.26,
          description: "Deimos is the smaller and outermost of the two natural satellites of Mars.",
          radius: 0.05,
          color: 0x777777,
          orbitRadius: 2,
          orbitalSpeed: 0.08,
          rotationSpeed: 0.08,
          texturePath: "textures/deimos.jpg"
        },
      ],
    },
    {
      id: "jupiter",
      name: "Jupiter",
      type: "planet",
      diameter: 142984,
      mass: 1.8982e27,
      distanceFromSun: 778.6,
      orbitalPeriod: 4331,
      rotationPeriod: 0.41,
      description:
        "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets combined.",
      radius: 2.5,
      color: 0xd8ca9d,
      orbitRadius: 32,
      orbitalSpeed: 0.015,
      rotationSpeed: 0.02,
      texturePath: "textures/jupiter.jpg",
      moons: [
        {
          id: "io",
          name: "Io",
          type: "moon",
          diameter: 3643,
          orbitalPeriod: 1.77,
          description:
            "Io is the innermost of the four Galilean moons of Jupiter and the most volcanically active body in the Solar System.",
          radius: 0.2,
          color: 0xf9d71c,
          orbitRadius: 3.5,
          orbitalSpeed: 0.07,
          rotationSpeed: 0.07,
          texturePath: "textures/io.jpg"
        },
        {
          id: "europa",
          name: "Europa",
          type: "moon",
          diameter: 3122,
          orbitalPeriod: 3.55,
          description:
            "Europa is the smallest of the four Galilean moons and the sixth-closest to Jupiter. It has a smooth, icy surface with few craters.",
          radius: 0.18,
          color: 0xf2f2f2,
          orbitRadius: 4,
          orbitalSpeed: 0.06,
          rotationSpeed: 0.06,
          texturePath: "textures/europa.jpg"
        },
      ],
      rings: true
    },
    {
      id: "saturn",
      name: "Saturn",
      type: "planet",
      diameter: 120536,
      mass: 5.6834e26,
      distanceFromSun: 1433.5,
      orbitalPeriod: 10747,
      rotationPeriod: 0.45,
      texturePath: "textures/saturn.jpg",
      description:
        "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius about nine times that of Earth. It has a prominent ring system.",
      radius: 2.2,
      color: 0xe3dccb,
      orbitRadius: 39,
      orbitalSpeed: 0.01,
      rotationSpeed: 0.018,
      rings: true
    },
    {
      id: "uranus",
      name: "Uranus",
      type: "planet",
      diameter: 51118,
      mass: 8.681e25,
      distanceFromSun: 2872.5,
      orbitalPeriod: 30589,
      rotationPeriod: -0.72, // Negative indicates retrograde rotation
      texturePath: "textures/uranus.jpg",
      description:
        "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. It is an ice giant.",
      radius: 1.5,
      color: 0x9fe3de,
      orbitRadius: 45,
      orbitalSpeed: 0.007,
      rotationSpeed: -0.015,
      rings: true
    },
    {
      id: "neptune",
      name: "Neptune",
      type: "planet",
      diameter: 49528,
      mass: 1.02413e26,
      distanceFromSun: 4495.1,
      orbitalPeriod: 59800,
      rotationPeriod: 0.67,
      texturePath: "textures/neptune.jpg",
      description:
        "Neptune is the eighth and farthest known planet from the Sun in the Solar System. It is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.",
      radius: 1.4,
      color: 0x3d5ef5,
      orbitRadius: 50,
      orbitalSpeed: 0.005,
      rotationSpeed: 0.016,
      rings: true
    },
    {
      id: "pluto",
      name: "Pluto",
      type: "dwarf-planet",
      diameter: 2376,
      mass: 1.303e22,
      distanceFromSun: 5906.4,
      orbitalPeriod: 90560,
      rotationPeriod: -6.39, // Negative indicates retrograde rotation
      texturePath: "textures/pluto.jpg",
      description:
        "Pluto is a dwarf planet in the Kuiper belt. It was the first Kuiper belt object to be discovered and was originally classified as the ninth planet from the Sun.",
      radius: 0.3,
      color: 0xbfb3a2,
      orbitRadius: 55,
      orbitalSpeed: 0.004,
      rotationSpeed: -0.008,
    },
  ]

  private asteroidBeltConfig = {
    innerRadius: 27, // Just outside Mars orbit
    outerRadius: 29, // Just inside Jupiter orbit
    height: 1.2, // Thickness of the belt
    count: 2000, // Number of asteroids
    size: {
      min: 0.02,
      max: 0.1,
    },
    color: 0x8b7d6b,
  }

  constructor() {}

  getCelestialBodies(): CelestialBody[] {
    return this.celestialBodies;
  }

  getCelestialBodyById(id: string): CelestialBody | undefined {
    return this.celestialBodies.find((body) => body.id === id);
  }

  getCelestialBodyByName(name: string): CelestialBody | undefined {
    return this.celestialBodies.find((body) => body.name === name);
  }

  getAsteroidBeltConfig() {
    return this.asteroidBeltConfig;
  }
}
