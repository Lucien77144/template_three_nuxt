import Cube from '../Components/Main/Cube/Cube'
import ExtendableScene from '../Modules/Extendables/ExtendableScene'
import type { ExtendableSceneEvents } from '../Modules/Extendables/ExtendableScene/ExtendableSceneEvents'

export default class Main
  extends ExtendableScene
  implements ExtendableSceneEvents
{
  /**
   * Constructor
   */
  constructor() {
    super()
    this.components = {
      cube: new Cube(),
    }

    // Init the scene
    this.OnInit()
  }

  public override OnInit() {
    super.OnInit()

    this.camera.instance.position.z = 40
  }
}
