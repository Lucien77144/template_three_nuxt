import Cube from '../Components/Shared/Cube/Cube'
import BasicScene from '../Modules/Basics/BasicScene'

export default class Main extends BasicScene {
  /**
   * Constructor
   */
  constructor() {
    super()

    // Components
    this.components = {
      cube: new Cube(),
    }

    // Init the scene
    this.init()
  }

  // --------------------------------
  // Workflow
  // --------------------------------

  // --------------------------------
  // Lifecycle
  // --------------------------------

  init() {
    super.init()

    this.camera.instance.position.z = 40
  }
}
