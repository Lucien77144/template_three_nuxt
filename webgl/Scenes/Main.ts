import Cube from '../Components/Shared/Cube/Cube'
import AbstractScene from '../Modules/Abstract/AbstractScene'

export default class Main extends AbstractScene {
  /**
   * Constructor
   */
  constructor() {
    super()
    this.components = {
      cube: new Cube(),
    }

    // Init the scene
    this.init()
  }

  init() {
    super.init()

    this.camera.instance.position.z = 40
  }
}
