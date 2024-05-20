import Cube2 from '../Components/Shared/Cube2/Cube2'
import BasicScene from '../Modules/Basics/BasicScene'

export default class Main2 extends BasicScene {
  /**
   * Constructor
   */
  constructor() {
    super()

    // Components
    this.components = {
      cube: new Cube2(),
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
