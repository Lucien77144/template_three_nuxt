import Cube from '../Components/Cube/Cube'
import Floor from '../Components/Floor/Floor'
import World from '../Utils/World'

export default class Scene1 extends World {
  /**
   * Constructor
   */
  constructor() {
    super()

    // New elements
    this.components = {
      floor: new Floor(),
      cube: new Cube(),
    }

    this._init()
  }
}
