import Cube2 from '../Components/Shared/Cube2/Cube2'
import AbstractScene from '../Modules/Abstract/AbstractScene'

export default class Main2 extends AbstractScene {
  /**
   * Constructor
   */
  constructor() {
    super()
    this.components = {
      cube: new Cube2({
        position: { x: 0.25, y: 0.25, z: 0.25 },
      }),
    }

    // Init the scene
    this.init()
  }

  init() {
    super.init()

    this.camera.instance.position.z = 40
  }
}
