import Floor2 from '../Components/Floor2/Floor2'
import World from '../Utils/World'

export default class Scene2 extends World {
  /**
   * Constructor
   */
  constructor() {
    super()

    // New elements
    this.components = {
      floor: new Floor2(),
    }

    this._init()
  }
}
