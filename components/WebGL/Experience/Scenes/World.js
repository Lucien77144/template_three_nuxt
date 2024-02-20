import Experience from '../Experience'
import Floor from '../Components/Floor/Floor'
import { Scene } from 'three'
import Camera from '../Camera'

export default class World {
  /**
   * Constructor
   */
  constructor() {
    // Get elements from experience
    this.experience = new Experience()

    // New elements
    this.components = {
      floor: new Floor(),
    }
    this.scene = new Scene()
    this.camera = new Camera()

    // Init
    this._init()
  }

  /**
   * Update the world
   */
  _init() {
    Object.keys(this.components).forEach((c) => {
      this.scene.add(this.components[c].item)
    })
    this.scene.add(this.camera.instance)
  }

  /**
   * Update the world
   */
  update() {
    Object.keys(this.components).forEach((_key) => {
      this.components[_key].update()
    })
    this.camera.update()
  }

  /**
   * Resize the world
   */
  resize() {
    this.camera.resize()
  }

  /**
   * Dispose the world
   */
  dispose() {
    Object.keys(this.components).forEach((_key) => {
      this.components[_key].dispose()
    })
  }
}
