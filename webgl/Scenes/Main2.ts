import Cube2 from '../Components/Main2/Cube2/Cube2'
import ExtendableScene from '../Modules/Extendables/ExtendableScene'
import { ExtendableSceneEvents } from '../Modules/Extendables/ExtendableScene/ExtendableSceneEvents'

export default class Main2
  extends ExtendableScene
  implements ExtendableSceneEvents
{
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
    this.OnInit()
  }

  public override OnInit() {
    super.OnInit()

    this.camera.instance.position.z = 40
  }
}
